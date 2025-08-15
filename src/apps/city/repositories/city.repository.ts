import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async findAll(): Promise<City[]> {
    return this.cityRepository.find({
      where: { active: true },
      relations: ['city_questions'],
      order: { name: 'ASC', year: 'DESC' },
    });
  }

  async findById(id: string): Promise<City | null> {
    return this.cityRepository.findOne({
      where: { id },
      relations: ['city_questions', 'user_cities', 'users'],
    });
  }

  async findByName(name: string): Promise<City[]> {
    return this.cityRepository.find({
      where: { name, active: true },
      relations: ['city_questions'],
      order: { year: 'DESC' },
    });
  }

  async findByYear(year: number): Promise<City[]> {
    return this.cityRepository.find({
      where: { year, active: true },
      relations: ['city_questions'],
      order: { name: 'ASC' },
    });
  }

  async findByNameAndYear(name: string, year: number): Promise<City | null> {
    return this.cityRepository.findOne({
      where: { name, year, active: true },
      relations: ['city_questions'],
    });
  }

  async findActiveCities(): Promise<City[]> {
    return this.cityRepository.find({
      where: { active: true },
      relations: ['city_questions'],
      order: { name: 'ASC', year: 'DESC' },
    });
  }

  async findCitiesForUser(userId: string): Promise<City[]> {
    return this.cityRepository
      .createQueryBuilder('city')
      .innerJoin('city.user_cities', 'uc')
      .where('uc.user_id = :userId', { userId })
      .andWhere('city.active = true')
      .orderBy('city.name', 'ASC')
      .addOrderBy('city.year', 'DESC')
      .getMany();
  }

  async findCitiesWithQuestions(): Promise<City[]> {
    return this.cityRepository.find({
      where: { active: true },
      relations: ['city_questions'],
      order: { name: 'ASC', year: 'DESC' },
    });
  }

  async create(cityData: Partial<City>): Promise<City> {
    const city = this.cityRepository.create(cityData);
    return this.cityRepository.save(city);
  }

  async update(id: string, cityData: Partial<City>): Promise<City> {
    await this.cityRepository.update(id, cityData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('City not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.cityRepository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.cityRepository.update(id, { active: false });
  }

  async count(): Promise<number> {
    return this.cityRepository.count({ where: { active: true } });
  }

  async countByYear(year: number): Promise<number> {
    return this.cityRepository.count({ where: { year, active: true } });
  }

  async getYears(): Promise<number[]> {
    const years = await this.cityRepository
      .createQueryBuilder('city')
      .select('DISTINCT city.year', 'year')
      .where('city.active = true')
      .orderBy('city.year', 'DESC')
      .getRawMany();

    return years.map((item) => item.year);
  }

  async search(searchTerm: string): Promise<City[]> {
    return this.cityRepository
      .createQueryBuilder('city')
      .where('city.active = true')
      .andWhere('LOWER(city.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('city.name', 'ASC')
      .addOrderBy('city.year', 'DESC')
      .getMany();
  }
}
