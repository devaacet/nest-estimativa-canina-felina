import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../shared/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['cities'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithPagination({
    active,
    cityIds,
    limit = 10,
    page = 1,
    role,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    active?: boolean;
    cityIds?: string[];
  }): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .addSelect('cities.name')
      .leftJoin('user.cities', 'cities')
      .orderBy('user.createdAt', 'DESC');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.institution ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('user.active = :active', { active });
    }

    if (cityIds && cityIds.length > 0) {
      queryBuilder.andWhere('cities.id IN (:...cityIds)', { cityIds });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cities'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['cities'],
    });
  }

  async findByEmailWithPasswordHash(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['cities'],
      select: [
        'id',
        'name',
        'role',
        'active',
        'email',
        'passwordHash',
        'cities',
      ],
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role, active: true },
      relations: ['cities'],
      order: { name: 'ASC' },
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { active: true },
      relations: ['cities'],
      order: { name: 'ASC' },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<void> {
    await this.userRepository.save({
      id,
      ...userData,
    });

    return;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async findUsersWithCityAccess(cityId: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.cities', 'city')
      .where('city.id = :cityId', { cityId })
      .andWhere('user.active = true')
      .getMany();
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.userRepository.count({ where: { role, active: true } });
  }
}
