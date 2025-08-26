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

  async getKpisData(
    cityIds?: string[],
    dateRange?: { startDate: Date; endDate: Date },
  ): Promise<{
    totalForms: number;
    completedForms: number;
    submittedForms: number;
    averageCompletionTime: string;
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
      query = query.where('form.cityId IN (:...cityIds)', { cityIds });
    }

    if (dateRange) {
      if (cityIds && cityIds.length > 0) {
        query = query.andWhere('form.formDate BETWEEN :startDate AND :endDate', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
      } else {
        query = query.where('form.formDate BETWEEN :startDate AND :endDate', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
      }
    }

    const forms = await query.getMany();

    // Calcular KPIs
    const totalForms = forms.length;
    const completedForms = forms.filter(f => f.status === FormStatus.COMPLETED || f.status === FormStatus.SUBMITTED).length;
    const submittedForms = forms.filter(f => f.status === FormStatus.SUBMITTED).length;
    
    // Calcular tempo médio de conclusão (placeholder - precisa implementar no banco)
    const averageCompletionTime = "45.3 minutes";

    // Contagem de animais
    const formsWithAnimals = await this.createQueryBuilder('form')
      .leftJoinAndSelect('form.currentAnimals', 'ca')
      .where(cityIds && cityIds.length > 0 ? 'form.cityId IN (:...cityIds)' : '1=1', { cityIds })
      .andWhere(dateRange ? 'form.formDate BETWEEN :startDate AND :endDate' : '1=1', dateRange)
      .getMany();

    let totalAnimalsRegistered = 0;
    let householdsWithPets = 0;
    let castratedAnimals = 0;
    let vaccinatedAnimals = 0;

    formsWithAnimals.forEach(form => {
      if (form.currentAnimals && form.currentAnimals.length > 0) {
        householdsWithPets++;
        totalAnimalsRegistered += form.currentAnimals.length;
        
        form.currentAnimals.forEach(animal => {
          if (animal.castration_status === 'yes' || animal.castration_status === 'yes_less_than_year') {
            castratedAnimals++;
          }
          if (animal.is_vaccinated === true) {
            vaccinatedAnimals++;
          }
        });
      }
    });

    return {
      totalForms,
      completedForms,
      submittedForms,
      averageCompletionTime,
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
    let dateFormat = 'YYYY-MM-DD';
    let dateGrouping = 'DATE(form.formDate)';
    
    switch (groupBy) {
      case 'week':
        dateFormat = 'YYYY-WW';
        dateGrouping = "DATE_FORMAT(form.formDate, '%Y-%u')";
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        dateGrouping = "DATE_FORMAT(form.formDate, '%Y-%m')";
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
        dateGrouping = 'DATE(form.formDate)';
    }

    let query = this.createQueryBuilder('form')
      .select(dateGrouping, 'date')
      .addSelect('COUNT(form.id)', 'completedForms')
      .where('form.status IN (:...statuses)', { 
        statuses: [FormStatus.COMPLETED, FormStatus.SUBMITTED] 
      });

    if (cityIds && cityIds.length > 0) {
      query = query.andWhere('form.cityId IN (:...cityIds)', { cityIds });
    }

    if (dateRange) {
      query = query.andWhere('form.formDate BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }

    const results = await query
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map(result => ({
      date: result.date,
      completedForms: parseInt(result.completedForms, 10),
    }));
  }

  async getActiveCitiesCount(
    cityIds?: string[],
    dateRange?: { startDate: Date; endDate: Date },
  ): Promise<number> {
    let query = this.createQueryBuilder('form')
      .select('DISTINCT form.cityId', 'cityId');

    if (cityIds && cityIds.length > 0) {
      query = query.where('form.cityId IN (:...cityIds)', { cityIds });
    }

    if (dateRange) {
      if (cityIds && cityIds.length > 0) {
        query = query.andWhere('form.formDate BETWEEN :startDate AND :endDate', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
      } else {
        query = query.where('form.formDate BETWEEN :startDate AND :endDate', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
      }
    }

    const results = await query.getRawMany();
    return results.length;
  }
}
