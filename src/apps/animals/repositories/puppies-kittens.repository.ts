import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuppiesKittens } from '../entities/puppies-kittens.entity';

@Injectable()
export class PuppiesKittensRepository {
  constructor(
    @InjectRepository(PuppiesKittens)
    private readonly puppiesRepository: Repository<PuppiesKittens>,
  ) {}

  async findAll(): Promise<PuppiesKittens[]> {
    return this.puppiesRepository.find({
      relations: ['form'],
      order: { registration_order: 'ASC' },
    });
  }

  async findById(id: string): Promise<PuppiesKittens | null> {
    return this.puppiesRepository.findOne({
      where: { id },
      relations: ['form'],
    });
  }

  async findByFormId(formId: string): Promise<PuppiesKittens[]> {
    return this.puppiesRepository.find({
      where: { form_id: formId },
      order: { registration_order: 'ASC' },
    });
  }

  async findWithPuppies(): Promise<PuppiesKittens[]> {
    return this.puppiesRepository.find({
      where: { had_puppies_last_12_months: true },
      relations: ['form'],
      order: { created_at: 'DESC' },
    });
  }

  async getNextRegistrationOrder(formId: string): Promise<number> {
    const result = await this.puppiesRepository
      .createQueryBuilder('puppies')
      .select('COALESCE(MAX(puppies.registration_order), 0) + 1', 'nextOrder')
      .where('puppies.form_id = :formId', { formId })
      .getRawOne();

    return parseInt(result.nextOrder, 10);
  }

  async create(puppiesData: Partial<PuppiesKittens>): Promise<PuppiesKittens> {
    if (!puppiesData.registration_order && puppiesData.form_id) {
      puppiesData.registration_order = await this.getNextRegistrationOrder(
        puppiesData.form_id,
      );
    }

    const puppies = this.puppiesRepository.create(puppiesData);
    return this.puppiesRepository.save(puppies);
  }

  async update(
    id: string,
    puppiesData: Partial<PuppiesKittens>,
  ): Promise<PuppiesKittens> {
    await this.puppiesRepository.update(id, puppiesData);
    const updated = await this.findById(id);
    if (!updated)
      throw new Error('Puppies/kittens record not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.puppiesRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.puppiesRepository.count();
  }

  async countByFormId(formId: string): Promise<number> {
    return this.puppiesRepository.count({ where: { form_id: formId } });
  }

  async getTotalPuppyCount(): Promise<number> {
    const result = await this.puppiesRepository
      .createQueryBuilder('puppies')
      .select('SUM(puppies.puppy_count)', 'total')
      .where('puppies.had_puppies_last_12_months = true')
      .getRawOne();

    return parseInt(result?.total || '0', 10);
  }
}
