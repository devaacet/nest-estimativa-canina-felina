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

  async updateAnimalCount(id: string): Promise<void> {
    const result = await this.createQueryBuilder()
      .update(Form)
      .set({
        totalAnimalsRegistered: () => `(
          COALESCE((SELECT COUNT(*) FROM form_current_animals WHERE form_id = :id), 0) +
          COALESCE((SELECT COUNT(*) FROM form_previous_animals WHERE form_id = :id), 0) +
          COALESCE((SELECT COUNT(*) FROM form_puppies_kittens WHERE form_id = :id AND had_puppies_last_12_months = true), 0)
        )`,
      })
      .where('id = :id', { id })
      .execute();
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
