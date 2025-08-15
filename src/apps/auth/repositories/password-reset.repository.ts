import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from '../entities/password-reset.entity';

@Injectable()
export class PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
  ) {}

  async findByToken(token: string): Promise<PasswordReset | null> {
    return this.passwordResetRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async findValidByToken(token: string): Promise<PasswordReset | null> {
    return this.passwordResetRepository
      .createQueryBuilder('reset')
      .leftJoinAndSelect('reset.user', 'user')
      .where('reset.token = :token', { token })
      .andWhere('reset.expires_at > :now', { now: new Date() })
      .andWhere('user.active = true')
      .getOne();
  }

  async create(resetData: Partial<PasswordReset>): Promise<PasswordReset> {
    const passwordReset = this.passwordResetRepository.create(resetData);
    return this.passwordResetRepository.save(passwordReset);
  }

  async delete(id: string): Promise<void> {
    await this.passwordResetRepository.delete(id);
  }

  async deleteExpired(): Promise<number> {
    const result = await this.passwordResetRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .orWhere('used_at IS NOT NULL')
      .execute();

    return result.affected || 0;
  }
}
