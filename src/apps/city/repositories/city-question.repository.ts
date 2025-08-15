import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityQuestion } from '../entities/city-question.entity';

@Injectable()
export class CityQuestionRepository {
  constructor(
    @InjectRepository(CityQuestion)
    private readonly cityQuestionRepository: Repository<CityQuestion>,
  ) {}

  async findAll(): Promise<CityQuestion[]> {
    return this.cityQuestionRepository.find({
      relations: ['city'],
      order: { question_order: 'ASC' },
    });
  }

  async findById(id: string): Promise<CityQuestion | null> {
    return this.cityQuestionRepository.findOne({
      where: { id },
      relations: ['city'],
    });
  }

  async findByCityId(cityId: string): Promise<CityQuestion[]> {
    return this.cityQuestionRepository.find({
      where: { city_id: cityId },
      relations: ['city'],
      order: { question_order: 'ASC' },
    });
  }

  async findRequiredByCityId(cityId: string): Promise<CityQuestion[]> {
    return this.cityQuestionRepository.find({
      where: { city_id: cityId, required: true },
      relations: ['city'],
      order: { question_order: 'ASC' },
    });
  }

  async findByOrder(
    cityId: string,
    questionOrder: number,
  ): Promise<CityQuestion | null> {
    return this.cityQuestionRepository.findOne({
      where: { city_id: cityId, question_order: questionOrder },
      relations: ['city'],
    });
  }

  async getNextOrder(cityId: string): Promise<number> {
    const result = await this.cityQuestionRepository
      .createQueryBuilder('cq')
      .select('COALESCE(MAX(cq.question_order), 0) + 1', 'nextOrder')
      .where('cq.city_id = :cityId', { cityId })
      .getRawOne();

    return parseInt(result.nextOrder, 10);
  }

  async create(questionData: Partial<CityQuestion>): Promise<CityQuestion> {
    if (!questionData.question_order && questionData.city_id) {
      questionData.question_order = await this.getNextOrder(
        questionData.city_id,
      );
    }

    const cityQuestion = this.cityQuestionRepository.create(questionData);
    return this.cityQuestionRepository.save(cityQuestion);
  }

  async update(
    id: string,
    questionData: Partial<CityQuestion>,
  ): Promise<CityQuestion> {
    await this.cityQuestionRepository.update(id, questionData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('City question not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.cityQuestionRepository.delete(id);
  }

  async reorderQuestions(
    cityId: string,
    questionOrders: { id: string; order: number }[],
  ): Promise<void> {
    const queryRunner =
      this.cityQuestionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const { id, order } of questionOrders) {
        await queryRunner.manager.update(CityQuestion, id, {
          question_order: order,
        });
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async countByCityId(cityId: string): Promise<number> {
    return this.cityQuestionRepository.count({ where: { city_id: cityId } });
  }

  async countRequiredByCityId(cityId: string): Promise<number> {
    return this.cityQuestionRepository.count({
      where: { city_id: cityId, required: true },
    });
  }

  async duplicate(
    sourceQuestionId: string,
    targetCityId: string,
  ): Promise<CityQuestion> {
    const sourceQuestion = await this.findById(sourceQuestionId);
    if (!sourceQuestion) {
      throw new Error('Source question not found');
    }

    const nextOrder = await this.getNextOrder(targetCityId);

    return this.create({
      city_id: targetCityId,
      question_text: sourceQuestion.question_text,
      question_order: nextOrder,
      required: sourceQuestion.required,
    });
  }

  async bulkCreate(
    cityId: string,
    questions: Partial<CityQuestion>[],
  ): Promise<CityQuestion[]> {
    const queryRunner =
      this.cityQuestionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdQuestions: CityQuestion[] = [];
      let currentOrder = await this.getNextOrder(cityId);

      for (const questionData of questions) {
        const question = this.cityQuestionRepository.create({
          ...questionData,
          city_id: cityId,
          question_order: currentOrder,
        });
        const saved = await queryRunner.manager.save(question);
        createdQuestions.push(saved);
        currentOrder++;
      }

      await queryRunner.commitTransaction();
      return createdQuestions;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
