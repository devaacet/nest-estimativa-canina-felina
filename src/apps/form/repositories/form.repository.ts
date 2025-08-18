import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { FormStatus } from '../../../shared/enums';

@Injectable()
export class FormRepository extends Repository<Form> {
  constructor(private dataSource: DataSource) {
    super(Form, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<Form[]> {
    return this.find({
      where: { userId },
      relations: [
        'user',
        'city',
        'currentAnimals',
        'previousAnimals',
        'puppiesKittens',
        'animalAbsence',
        'questionResponses',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCityId(cityId: string): Promise<Form[]> {
    return this.find({
      where: { cityId },
      relations: [
        'user',
        'city',
        'currentAnimals',
        'previousAnimals',
        'puppiesKittens',
        'animalAbsence',
        'questionResponses',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndCity(userId: string, cityId: string): Promise<Form[]> {
    return this.find({
      where: { userId, cityId },
      relations: [
        'user',
        'city',
        'currentAnimals',
        'previousAnimals',
        'puppiesKittens',
        'animalAbsence',
        'questionResponses',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findDraftsByUser(userId: string): Promise<Form[]> {
    return this.find({
      where: { userId, status: FormStatus.DRAFT },
      relations: ['user', 'city'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findSubmittedByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Form[]> {
    return this.createQueryBuilder('form')
      .leftJoinAndSelect('form.user', 'user')
      .leftJoinAndSelect('form.city', 'city')
      .where('form.status = :status', { status: 'submitted' })
      .andWhere('form.formDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('form.formDate', 'DESC')
      .getMany();
  }

  async updateCurrentStep(id: string, currentStep: number): Promise<void> {
    await this.update(id, { currentStep });
  }

  async markAsCompleted(id: string): Promise<void> {
    await this.update(id, {
      status: FormStatus.COMPLETED,
      currentStep: 8,
    });
  }

  async markAsSubmitted(id: string): Promise<void> {
    await this.update(id, {
      status: FormStatus.SUBMITTED,
      submittedAt: new Date(),
    });
  }

  async getAnimalCount(id: string): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('COUNT(ca.id)', 'count')
      .from('form_current_animals', 'ca')
      .where('ca.form_id = :id', { id })
      .getRawOne();
    
    return parseInt(result?.count || '0', 10);
  }

  async getFormWithAllRelations(id: string): Promise<Form | null> {
    return this.findOne({
      where: { id },
      relations: [
        'user',
        'city',
        'currentAnimals',
        'previousAnimals',
        'puppiesKittens',
        'animalAbsence',
        'questionResponses',
        'questionResponses.question',
      ],
    });
  }
}
