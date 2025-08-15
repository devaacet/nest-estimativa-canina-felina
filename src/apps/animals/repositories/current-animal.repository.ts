import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentAnimal } from '../entities/current-animal.entity';
import { AnimalSpecies, CastrationStatus } from '../../../shared/enums';

@Injectable()
export class CurrentAnimalRepository {
  constructor(
    @InjectRepository(CurrentAnimal)
    private readonly animalRepository: Repository<CurrentAnimal>,
  ) {}

  async findAll(): Promise<CurrentAnimal[]> {
    return this.animalRepository.find({
      relations: ['form'],
      order: { registration_order: 'ASC' },
    });
  }

  async findById(id: string): Promise<CurrentAnimal | null> {
    return this.animalRepository.findOne({
      where: { id },
      relations: ['form'],
    });
  }

  async findByFormId(formId: string): Promise<CurrentAnimal[]> {
    return this.animalRepository.find({
      where: { form_id: formId },
      order: { registration_order: 'ASC' },
    });
  }

  async findBySpecies(species: AnimalSpecies): Promise<CurrentAnimal[]> {
    return this.animalRepository.find({
      where: { animal_species: species },
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async findCastratedAnimals(): Promise<CurrentAnimal[]> {
    return this.animalRepository
      .createQueryBuilder('animal')
      .leftJoinAndSelect('animal.form', 'form')
      .where('animal.castration_status != :no', { no: 'no' })
      .orderBy('animal.created_at', 'DESC')
      .getMany();
  }

  async findVaccinatedAnimals(): Promise<CurrentAnimal[]> {
    return this.animalRepository.find({
      where: { is_vaccinated: true },
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async findWithMicrochip(): Promise<CurrentAnimal[]> {
    return this.animalRepository.find({
      where: { has_microchip: true },
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async getNextRegistrationOrder(formId: string): Promise<number> {
    const result = await this.animalRepository
      .createQueryBuilder('animal')
      .select('COALESCE(MAX(animal.registration_order), 0) + 1', 'nextOrder')
      .where('animal.form_id = :formId', { formId })
      .getRawOne();

    return parseInt(result.nextOrder, 10);
  }

  async create(animalData: Partial<CurrentAnimal>): Promise<CurrentAnimal> {
    if (!animalData.registration_order && animalData.form_id) {
      animalData.registration_order = await this.getNextRegistrationOrder(
        animalData.form_id,
      );
    }

    const animal = this.animalRepository.create(animalData);
    return this.animalRepository.save(animal);
  }

  async update(
    id: string,
    animalData: Partial<CurrentAnimal>,
  ): Promise<CurrentAnimal> {
    await this.animalRepository.update(id, animalData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Animal not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.animalRepository.delete(id);
  }

  async deleteByFormId(formId: string): Promise<void> {
    await this.animalRepository.delete({ form_id: formId });
  }

  async count(): Promise<number> {
    return this.animalRepository.count();
  }

  async countByFormId(formId: string): Promise<number> {
    return this.animalRepository.count({ where: { form_id: formId } });
  }

  async countBySpecies(species: AnimalSpecies): Promise<number> {
    return this.animalRepository.count({ where: { animal_species: species } });
  }

  async getAnimalStatistics(): Promise<{
    total: number;
    dogs: number;
    cats: number;
    others: number;
    castrated: number;
    vaccinated: number;
    withMicrochip: number;
    averageAge: number;
  }> {
    const total = await this.count();
    const dogs = await this.countBySpecies(AnimalSpecies.DOG);
    const cats = await this.countBySpecies(AnimalSpecies.CAT);
    const others = total - dogs - cats;

    const castrated = await this.animalRepository.count({
      where: [
        { castration_status: CastrationStatus.YES },
        { castration_status: CastrationStatus.YES_MORE_THAN_YEAR },
        { castration_status: CastrationStatus.YES_LESS_THAN_YEAR },
      ],
    });

    const vaccinated = await this.animalRepository.count({
      where: { is_vaccinated: true },
    });

    const withMicrochip = await this.animalRepository.count({
      where: { has_microchip: true },
    });

    // Calculate average age (convert months to years for animals < 1 year)
    const ageResult = await this.animalRepository
      .createQueryBuilder('animal')
      .select(
        'AVG(CASE WHEN age_years IS NOT NULL THEN age_years ELSE age_months / 12.0 END)',
        'average',
      )
      .getRawOne();

    return {
      total,
      dogs,
      cats,
      others,
      castrated,
      vaccinated,
      withMicrochip,
      averageAge: parseFloat(ageResult?.average || '0'),
    };
  }

  async reorderAnimals(
    formId: string,
    animalOrders: { id: string; order: number }[],
  ): Promise<void> {
    const queryRunner =
      this.animalRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const { id, order } of animalOrders) {
        await queryRunner.manager.update(CurrentAnimal, id, {
          registration_order: order,
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

  async bulkCreate(
    formId: string,
    animalsData: Partial<CurrentAnimal>[],
  ): Promise<CurrentAnimal[]> {
    const queryRunner =
      this.animalRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdAnimals: CurrentAnimal[] = [];
      let currentOrder = await this.getNextRegistrationOrder(formId);

      for (const animalData of animalsData) {
        const animal = this.animalRepository.create({
          ...animalData,
          form_id: formId,
          registration_order: currentOrder,
        });
        const saved = await queryRunner.manager.save(animal);
        createdAnimals.push(saved);
        currentOrder++;
      }

      await queryRunner.commitTransaction();
      return createdAnimals;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByAge(minAge?: number, maxAge?: number): Promise<CurrentAnimal[]> {
    const queryBuilder = this.animalRepository
      .createQueryBuilder('animal')
      .leftJoinAndSelect('animal.form', 'form');

    if (minAge !== undefined) {
      queryBuilder.andWhere(
        '(animal.age_years IS NOT NULL AND animal.age_years >= :minAge) OR ' +
          '(animal.age_months IS NOT NULL AND animal.age_months >= :minAgeMonths)',
        { minAge, minAgeMonths: minAge * 12 },
      );
    }

    if (maxAge !== undefined) {
      queryBuilder.andWhere(
        '(animal.age_years IS NOT NULL AND animal.age_years <= :maxAge) OR ' +
          '(animal.age_months IS NOT NULL AND animal.age_months <= :maxAgeMonths)',
        { maxAge, maxAgeMonths: maxAge * 12 },
      );
    }

    return queryBuilder.orderBy('animal.created_at', 'DESC').getMany();
  }

  async toggleCardMinimized(id: string): Promise<CurrentAnimal> {
    const animal = await this.findById(id);
    if (!animal) {
      throw new Error('Animal not found');
    }
    return this.update(id, { card_minimized: !animal.card_minimized });
  }
}
