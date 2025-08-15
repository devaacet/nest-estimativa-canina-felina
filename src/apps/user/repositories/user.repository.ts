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
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cities', 'user_cities'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['cities'],
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

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { last_login_at: new Date() });
  }

  async findUsersWithCityAccess(cityId: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.user_cities', 'uc')
      .where('uc.city_id = :cityId', { cityId })
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
