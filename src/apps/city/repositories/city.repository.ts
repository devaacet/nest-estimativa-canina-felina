import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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
      relations: ['cityQuestions'],
      order: { name: 'ASC', year: 'DESC' },
    });
  }

  async findAllWithPagination({
    page = 1,
    limit = 10,
    search,
    year,
    active,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    year?: number;
    active?: boolean;
  }): Promise<{ cities: City[]; total: number }> {
    const queryBuilder = this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.cityQuestions', 'cityQuestions');

    // Filter by active status if provided
    if (active !== undefined) {
      queryBuilder.andWhere('city.active = :active', { active });
    } else {
      // Default to active only
      queryBuilder.andWhere('city.active = true');
    }

    // Filter by year if provided
    if (year) {
      queryBuilder.andWhere('city.year = :year', { year });
    }

    // Filter by search term if provided
    if (search) {
      queryBuilder.andWhere('LOWER(city.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Order by name and year
    queryBuilder.orderBy('city.name', 'ASC').addOrderBy('city.year', 'DESC');

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [cities, total] = await queryBuilder.getManyAndCount();

    return { cities, total };
  }

  async findById(id: string): Promise<City | null> {
    return this.cityRepository.findOne({
      where: { id },
      relations: ['cityQuestions', 'users'],
    });
  }

  async findByUserId(userId: string): Promise<City[]> {
    return this.cityRepository.find({
      where: { users: { id: userId }, active: true },
    });
  }

  async findByName(name: string): Promise<City[]> {
    return this.cityRepository.find({
      where: { name, active: true },
      relations: ['cityQuestions'],
      order: { year: 'DESC' },
    });
  }

  async findByYear(year: number): Promise<City[]> {
    return this.cityRepository.find({
      where: { year, active: true },
      relations: ['cityQuestions'],
      order: { name: 'ASC' },
    });
  }

  async findByNameAndYear(name: string, year: number): Promise<City | null> {
    return this.cityRepository.findOne({
      where: { name, year, active: true },
      relations: ['cityQuestions'],
    });
  }

  async findActiveCities(search?: string): Promise<City[]> {
    return this.cityRepository.find({
      select: ['year', 'name', 'id'],
      where: { active: true, name: ILike(`%${search}%`) },
      order: { name: 'ASC', year: 'DESC' },
    });
  }

  async findCitiesForUser(userId: string, search?: string): Promise<City[]> {
    const qb = this.cityRepository
      .createQueryBuilder('city')
      .select(['year', 'name', 'id'])
      .innerJoin('city.users', 'users')
      .where('users.id = :userId', { userId })
      .andWhere('city.active = true');

    if (search) qb.andWhere('name ILIKE :search', { search: `%${search}%` });

    return qb
      .orderBy('city.name', 'ASC')
      .addOrderBy('city.year', 'DESC')
      .getMany();
  }

  async findCitiesWithQuestions(): Promise<City[]> {
    return this.cityRepository.find({
      where: { active: true },
      relations: ['cityQuestions'],
      order: { name: 'ASC', year: 'DESC' },
    });
  }

  async create(cityData: City): Promise<City> {
    const city = this.cityRepository.create(cityData);
    return this.cityRepository.save(city);
  }

  async save(dto: City): Promise<void> {
    await this.cityRepository.save(dto);
  }

  async update(id: string, cityData: Partial<City>): Promise<City> {
    await this.cityRepository.update(id, cityData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('City not found after update');
    }
    return updated;
  }

  async remove(city: City): Promise<void> {
    await this.cityRepository.remove(city);
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
      .getRawMany<{ year: number }>();

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
