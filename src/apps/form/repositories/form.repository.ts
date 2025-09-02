import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Form } from '../entities/form.entity';
import { CastrationStatus, FormStatus } from '../../../shared/enums';

@Injectable()
export class FormRepository extends Repository<Form> {
  constructor(private dataSource: DataSource) {
    super(Form, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<Form[]> {
    return this.find({
      where: { user: { id: userId } },
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
      where: { city: { id: cityId } },
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
      where: { user: { id: userId }, city: { id: cityId } },
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
      where: { user: { id: userId }, status: FormStatus.DRAFT },
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
      .andWhere('form.interview_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('form.interview_date', 'DESC')
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
      .getRawOne<{ count: string }>();

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

  async getKpisData(
    cityIds?: string[],
    dateRange?: { startDate: Date; endDate: Date },
  ): Promise<{
    totalForms: number;
    completedForms: number;
    submittedForms: number;
    totalAnimalsRegistered: number;
    householdsWithPets: number;
    castratedAnimals: number;
    vaccinatedAnimals: number;
  }> {
    let query = this.createQueryBuilder('form')
      .leftJoin('form.currentAnimals', 'ca')
      .leftJoin('form.previousAnimals', 'pa')
      .leftJoin('form.puppiesKittens', 'pk');

    if (cityIds && cityIds.length > 0) {
      query = query.where('form.city_id IN (:...cityIds)', { cityIds });
    }

    if (dateRange) {
      if (cityIds && cityIds.length > 0) {
        query = query.andWhere(
          'form.interview_date BETWEEN :startDate AND :endDate',
          {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        );
      } else {
        query = query.where(
          'form.interview_date BETWEEN :startDate AND :endDate',
          {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        );
      }
    }

    const forms = await query.getMany();

    // Calcular KPIs
    const totalForms = forms.length;
    const completedForms = forms.filter(
      (f) =>
        f.status === FormStatus.COMPLETED || f.status === FormStatus.SUBMITTED,
    ).length;
    const submittedForms = forms.filter(
      (f) => f.status === FormStatus.SUBMITTED,
    ).length;

    // Contagem de animais
    const formsWithAnimals = await this.createQueryBuilder('form')
      .leftJoinAndSelect('form.currentAnimals', 'ca')
      .where(
        cityIds && cityIds.length > 0 ? 'form.city_id IN (:...cityIds)' : '1=1',
        { cityIds },
      )
      .andWhere(
        dateRange
          ? 'form.interview_date BETWEEN :startDate AND :endDate'
          : '1=1',
        dateRange,
      )
      .getMany();

    let totalAnimalsRegistered = 0;
    let householdsWithPets = 0;
    let castratedAnimals = 0;
    let vaccinatedAnimals = 0;

    formsWithAnimals.forEach((form) => {
      if (form.currentAnimals && form.currentAnimals.length > 0) {
        householdsWithPets++;
        totalAnimalsRegistered += form.currentAnimals.length;

        form.currentAnimals.forEach((animal) => {
          if (animal.castrationStatus !== CastrationStatus.NO) {
            castratedAnimals++;
          }
          if (animal.isVaccinated) {
            vaccinatedAnimals++;
          }
        });
      }
    });

    return {
      totalForms,
      completedForms,
      submittedForms,
      totalAnimalsRegistered,
      householdsWithPets,
      castratedAnimals,
      vaccinatedAnimals,
    };
  }

  async getCompletedFormsTimeline(
    cityIds?: string[],
    dateRange?: { startDate: Date; endDate: Date },
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<Array<{ date: string; completedForms: number }>> {
    const dateGroupings = {
      week: "TO_CHAR(form.interview_date, 'IYYY-IW')",
      month: "TO_CHAR(form.interview_date, 'YYYY-MM')",
      day: "TO_CHAR(form.interview_date, 'YYYY-MM-DD')",
    };

    const dateGrouping = dateGroupings[groupBy];

    let query = this.createQueryBuilder('form')
      .select(dateGrouping, 'date')
      .addSelect('COUNT(form.id)', 'completedForms')
      .where('form.status IN (:...statuses)', {
        statuses: [FormStatus.COMPLETED, FormStatus.SUBMITTED],
      });

    if (cityIds && cityIds.length > 0) {
      query = query.andWhere('form.city_id IN (:...cityIds)', { cityIds });
    }

    if (dateRange) {
      query = query.andWhere(
        'form.interview_date BETWEEN :startDate AND :endDate',
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      );
    }

    const results = await query
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany<{ completedForms: string; date: string }>();

    return results.map((result) => ({
      date: result.date,
      completedForms: parseInt(result.completedForms, 10),
    }));
  }

  async getActiveCitiesCount(
    cityIds?: string[],
    dateRange?: { startDate: Date; endDate: Date },
  ): Promise<number> {
    let query = this.createQueryBuilder('form').select(
      'DISTINCT form.city_id',
      'cityId',
    );

    if (cityIds && cityIds.length > 0) {
      query = query.where('form.city_id IN (:...cityIds)', { cityIds });
    }

    if (dateRange) {
      if (cityIds && cityIds.length > 0) {
        query = query.andWhere(
          'form.interview_date BETWEEN :startDate AND :endDate',
          {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        );
      } else {
        query = query.where(
          'form.interview_date BETWEEN :startDate AND :endDate',
          {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        );
      }
    }

    const results = await query.getRawMany();
    return results.length;
  }

  async findAllWithPagination({
    page = 1,
    limit = 10,
    cityIds,
    userId,
    dateRange,
  }: {
    page?: number;
    limit?: number;
    cityIds?: string[];
    userId?: string;
    dateRange?: { startDate: Date; endDate: Date };
  }): Promise<{ forms: Form[]; total: number }> {
    let query = this.createQueryBuilder('form')
      .leftJoinAndSelect('form.user', 'user')
      .leftJoinAndSelect('form.city', 'city');

    // Apply role-based filtering
    if (userId) {
      // Researchers only see forms created by them
      query = query.where('form.user_id = :userId', { userId });
    }

    if (cityIds && cityIds.length > 0) {
      // Managers and clients only see forms from their accessible cities
      query = query.andWhere('form.city_id IN (:...cityIds)', { cityIds });
    }

    // Apply date range filter
    if (dateRange) {
      query = query.andWhere(
        'form.interview_date BETWEEN :startDate AND :endDate',
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      );
    }

    // Count total items
    const total = await query.getCount();

    // Apply pagination and get results
    const forms = await query
      .orderBy('form.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { forms, total };
  }

  async getFormsWithAllRelationsForExport({
    cityIds,
    userId,
    dateRange,
  }: {
    cityIds?: string[];
    userId?: string;
    dateRange?: { startDate: Date; endDate: Date };
  }): Promise<Form[]> {
    let query = this.createQueryBuilder('form')
      .leftJoinAndSelect('form.user', 'user')
      .leftJoinAndSelect('form.city', 'city')
      .leftJoinAndSelect('form.currentAnimals', 'currentAnimals')
      .leftJoinAndSelect('form.previousAnimals', 'previousAnimals')
      .leftJoinAndSelect('form.puppiesKittens', 'puppiesKittens')
      .leftJoinAndSelect('form.animalAbsence', 'animalAbsence')
      .leftJoinAndSelect('form.questionResponses', 'questionResponses')
      .leftJoinAndSelect('questionResponses.question', 'question');

    // Apply role-based filtering
    if (userId) {
      // Researchers only see forms created by them
      query = query.where('form.user_id = :userId', { userId });
    }

    if (cityIds && cityIds.length > 0) {
      // Managers and clients only see forms from their accessible cities
      if (userId) {
        query = query.andWhere('form.city_id IN (:...cityIds)', { cityIds });
      } else {
        query = query.where('form.city_id IN (:...cityIds)', { cityIds });
      }
    }

    // Apply date range filter
    if (dateRange) {
      query = query.andWhere(
        'form.interview_date BETWEEN :startDate AND :endDate',
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      );
    }

    // Order by creation date for consistent export
    return query.orderBy('form.createdAt', 'DESC').getMany();
  }
}
