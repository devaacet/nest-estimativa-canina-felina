import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FormQuestionResponse } from '../entities/form-question-response.entity';

@Injectable()
export class FormQuestionResponseRepository extends Repository<FormQuestionResponse> {
  constructor(private dataSource: DataSource) {
    super(FormQuestionResponse, dataSource.createEntityManager());
  }

  async findByFormId(formId: string): Promise<FormQuestionResponse[]> {
    return this.find({
      where: { formId },
      relations: ['question'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByFormAndQuestion(
    formId: string,
    questionId: string,
  ): Promise<FormQuestionResponse | null> {
    return this.findOne({
      where: { formId, questionId },
      relations: ['question', 'form'],
    });
  }

  async upsertResponse(
    formId: string,
    questionId: string,
    responseText: string,
  ): Promise<FormQuestionResponse> {
    const existing = await this.findByFormAndQuestion(formId, questionId);

    if (existing) {
      existing.responseText = responseText;
      existing.updatedAt = new Date();
      return this.save(existing);
    } else {
      const newResponse = this.create({
        formId,
        questionId,
        responseText,
      });
      return this.save(newResponse);
    }
  }

  async deleteByFormAndQuestion(
    formId: string,
    questionId: string,
  ): Promise<void> {
    await this.delete({ formId, questionId });
  }

  async findRequiredUnansweredByForm(
    formId: string,
  ): Promise<FormQuestionResponse[]> {
    return this.createQueryBuilder('response')
      .leftJoinAndSelect('response.question', 'question')
      .where('response.formId = :formId', { formId })
      .andWhere('question.required = :required', { required: true })
      .andWhere("(response.responseText IS NULL OR response.responseText = '')")
      .getMany();
  }

  async countRequiredAnsweredByForm(formId: string): Promise<number> {
    return this.createQueryBuilder('response')
      .leftJoin('response.question', 'question')
      .where('response.formId = :formId', { formId })
      .andWhere('question.required = :required', { required: true })
      .andWhere('response.responseText IS NOT NULL')
      .andWhere("response.responseText != ''")
      .getCount();
  }
}
