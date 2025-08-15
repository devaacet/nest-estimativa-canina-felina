import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../../../shared/enums';

@Injectable()
export class AuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(options?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: AuditAction;
    tableName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (options?.userId) {
      queryBuilder.andWhere('log.user_id = :userId', {
        userId: options.userId,
      });
    }

    if (options?.action) {
      queryBuilder.andWhere('log.action = :action', { action: options.action });
    }

    if (options?.tableName) {
      queryBuilder.andWhere('log.table_name = :tableName', {
        tableName: options.tableName,
      });
    }

    if (options?.startDate) {
      queryBuilder.andWhere('log.timestamp >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options?.endDate) {
      queryBuilder.andWhere('log.timestamp <= :endDate', {
        endDate: options.endDate,
      });
    }

    const total = await queryBuilder.getCount();

    if (options?.page && options?.limit) {
      queryBuilder.skip((options.page - 1) * options.limit).take(options.limit);
    }

    const logs = await queryBuilder.orderBy('log.timestamp', 'DESC').getMany();

    return { logs, total };
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByTableName(tableName: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { table_name: tableName },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByRecordId(
    tableName: string,
    recordId: string,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { table_name: tableName, record_id: recordId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findRecentLogs(days: number = 7): Promise<AuditLog[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.auditLogRepository.find({
      where: {
        timestamp: MoreThan(cutoffDate),
      },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async create(logData: Partial<AuditLog>): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      ...logData,
      timestamp: new Date(),
    });
    return this.auditLogRepository.save(auditLog);
  }

  async logAction(
    action: AuditAction,
    tableName: string,
    recordId?: string,
    userId?: string,
    oldData?: any,
    newData?: any,
    metadata?: {
      ip_address?: string;
      user_agent?: string;
      session_id?: string;
    },
  ): Promise<AuditLog> {
    return this.create({
      action,
      table_name: tableName,
      record_id: recordId,
      user_id: userId,
      old_data: oldData,
      new_data: newData,
      ip_address: metadata?.ip_address,
      user_agent: metadata?.user_agent,
      session_id: metadata?.session_id,
    });
  }

  async delete(id: string): Promise<void> {
    await this.auditLogRepository.delete(id);
  }

  async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.auditLogRepository
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  async count(): Promise<number> {
    return this.auditLogRepository.count();
  }

  async countByAction(action: AuditAction): Promise<number> {
    return this.auditLogRepository.count({ where: { action } });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.auditLogRepository.count({ where: { user_id: userId } });
  }

  async getAuditStatistics(): Promise<{
    total: number;
    byAction: Record<string, number>;
    recentActivity: number;
    topUsers: { userId: string; userName: string; count: number }[];
  }> {
    const total = await this.count();

    // Count by action
    const byAction: Record<string, number> = {};
    for (const action of Object.values(AuditAction)) {
      byAction[action] = await this.countByAction(action);
    }

    // Recent activity (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentActivity = await this.auditLogRepository.count({
      where: {
        timestamp: MoreThan(yesterday),
      },
    });

    // Top users by activity
    const topUsersResult = await this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoin('log.user', 'user')
      .select('log.user_id', 'userId')
      .addSelect('user.name', 'userName')
      .addSelect('COUNT(log.id)', 'count')
      .where('log.user_id IS NOT NULL')
      .groupBy('log.user_id')
      .addGroupBy('user.name')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const topUsers = topUsersResult.map((row) => ({
      userId: row.userId,
      userName: row.userName,
      count: parseInt(row.count, 10),
    }));

    return {
      total,
      byAction,
      recentActivity,
      topUsers,
    };
  }

  async search(searchTerm: string): Promise<AuditLog[]> {
    return this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .where('LOWER(log.table_name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('LOWER(user.name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('log.record_id = :searchTerm', { searchTerm })
      .orderBy('log.timestamp', 'DESC')
      .getMany();
  }
}
