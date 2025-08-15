import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreviousAnimal } from '../entities/previous-animal.entity';
import { AnimalDestiny } from '../../../shared/enums';

@Injectable()
export class PreviousAnimalRepository {
  constructor(
    @InjectRepository(PreviousAnimal)
    private readonly animalRepository: Repository<PreviousAnimal>,
  ) {}

  async findAll(): Promise<PreviousAnimal[]> {
    return this.animalRepository.find({
      relations: ['form'],
      order: { registration_order: 'ASC' },
    });
  }

  async findById(id: string): Promise<PreviousAnimal | null> {
    return this.animalRepository.findOne({
      where: { id },
      relations: ['form'],
    });
  }

  async findByFormId(formId: string): Promise<PreviousAnimal[]> {
    return this.animalRepository.find({
      where: { form_id: formId },
      order: { registration_order: 'ASC' },
    });
  }

  async findByDestiny(destiny: AnimalDestiny): Promise<PreviousAnimal[]> {
    return this.animalRepository.find({
      where: { animal_destiny: destiny },
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

  async create(animalData: Partial<PreviousAnimal>): Promise<PreviousAnimal> {
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
    animalData: Partial<PreviousAnimal>,
  ): Promise<PreviousAnimal> {
    await this.animalRepository.update(id, animalData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Previous animal not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.animalRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.animalRepository.count();
  }

  async countByFormId(formId: string): Promise<number> {
    return this.animalRepository.count({ where: { form_id: formId } });
  }
}
