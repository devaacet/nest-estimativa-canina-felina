import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ExportRequest } from '../entities/export-request.entity';

@Injectable()
export class ExportRequestRepository {
  constructor(
    @InjectRepository(ExportRequest)
    private readonly exportRequestRepository: Repository<ExportRequest>,
  ) {}

  async findAll(): Promise<ExportRequest[]> {
    return this.exportRequestRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<ExportRequest | null> {
    return this.exportRequestRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<ExportRequest[]> {
    return this.exportRequestRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<ExportRequest[]> {
    return this.exportRequestRepository.find({
      where: { status },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findPendingRequests(): Promise<ExportRequest[]> {
    return this.findByStatus('pending');
  }

  async findProcessingRequests(): Promise<ExportRequest[]> {
    return this.findByStatus('processing');
  }

  async findExpiredRequests(): Promise<ExportRequest[]> {
    const now = new Date();
    return this.exportRequestRepository.find({
      where: [{ status: 'completed', expires_at: MoreThan(now) }],
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async create(requestData: Partial<ExportRequest>): Promise<ExportRequest> {
    const exportRequest = this.exportRequestRepository.create(requestData);
    return this.exportRequestRepository.save(exportRequest);
  }

  async update(
    id: string,
    requestData: Partial<ExportRequest>,
  ): Promise<ExportRequest> {
    await this.exportRequestRepository.update(id, requestData);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Export request not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.exportRequestRepository.delete(id);
  }

  async updateStatus(
    id: string,
    status: string,
    metadata?: any,
  ): Promise<ExportRequest> {
    const updateData: Partial<ExportRequest> = { status };

    if (status === 'processing') {
      updateData.started_at = new Date();
    } else if (status === 'completed') {
      updateData.completed_at = new Date();
      // Set expiration date (e.g., 7 days from completion)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      updateData.expires_at = expirationDate;
    }

    if (metadata) {
      Object.assign(updateData, metadata);
    }

    return this.update(id, updateData);
  }

  async markAsDownloaded(id: string): Promise<ExportRequest> {
    return this.update(id, { downloaded_at: new Date() });
  }

  async cleanupExpiredRequests(): Promise<number> {
    const now = new Date();
    const result = await this.exportRequestRepository
      .createQueryBuilder()
      .delete()
      .where('status = :status AND expires_at < :now', {
        status: 'completed',
        now,
      })
      .execute();

    return result.affected || 0;
  }

  async count(): Promise<number> {
    return this.exportRequestRepository.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.exportRequestRepository.count({ where: { status } });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.exportRequestRepository.count({ where: { user_id: userId } });
  }

  async getExportStatistics(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    expired: number;
    averageProcessingTime: number;
    totalFilesSize: number;
  }> {
    const total = await this.count();
    const pending = await this.countByStatus('pending');
    const processing = await this.countByStatus('processing');
    const completed = await this.countByStatus('completed');
    const failed = await this.countByStatus('failed');
    const expired = await this.countByStatus('expired');

    // Calculate average processing time
    const processingTimeResult = await this.exportRequestRepository
      .createQueryBuilder('request')
      .select('AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))', 'avgTime')
      .where('status = :status', { status: 'completed' })
      .andWhere('started_at IS NOT NULL')
      .andWhere('completed_at IS NOT NULL')
      .getRawOne();

    const averageProcessingTime = parseFloat(
      processingTimeResult?.avgTime || '0',
    );

    // Calculate total files size
    const fileSizeResult = await this.exportRequestRepository
      .createQueryBuilder('request')
      .select('SUM(file_size)', 'totalSize')
      .where('file_size IS NOT NULL')
      .getRawOne();

    const totalFilesSize = parseInt(fileSizeResult?.totalSize || '0', 10);

    return {
      total,
      pending,
      processing,
      completed,
      failed,
      expired,
      averageProcessingTime,
      totalFilesSize,
    };
  }

  async findUserRecentRequests(
    userId: string,
    days: number = 30,
  ): Promise<ExportRequest[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.exportRequestRepository.find({
      where: {
        user_id: userId,
        created_at: MoreThan(cutoffDate),
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}
