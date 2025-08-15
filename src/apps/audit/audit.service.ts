import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { ExportRequestRepository } from './repositories/export-request.repository';
import { AuditLog } from './entities/audit-log.entity';
import { ExportRequest } from './entities/export-request.entity';
import { AuditAction } from '../../shared/enums';

@Injectable()
export class AuditService {
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly exportRequestRepository: ExportRequestRepository,
  ) {}

  // Audit Log operations
  async findAllAuditLogs(options?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: AuditAction;
    tableName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    return this.auditLogRepository.findAll(options);
  }

  async findAuditLogById(id: string): Promise<AuditLog> {
    const log = await this.auditLogRepository.findById(id);
    if (!log) {
      throw new NotFoundException('Log de auditoria não encontrado');
    }
    return log;
  }

  async findAuditLogsByUserId(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId);
  }

  async findAuditLogsByAction(action: AuditAction): Promise<AuditLog[]> {
    return this.auditLogRepository.findByAction(action);
  }

  async findAuditLogsByTable(tableName: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByTableName(tableName);
  }

  async findAuditLogsByRecord(
    tableName: string,
    recordId: string,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.findByRecordId(tableName, recordId);
  }

  async findRecentAuditLogs(days: number = 7): Promise<AuditLog[]> {
    return this.auditLogRepository.findRecentLogs(days);
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
    return this.auditLogRepository.logAction(
      action,
      tableName,
      recordId,
      userId,
      oldData,
      newData,
      metadata,
    );
  }

  async searchAuditLogs(searchTerm: string): Promise<AuditLog[]> {
    return this.auditLogRepository.search(searchTerm);
  }

  async getAuditStatistics(): Promise<any> {
    return this.auditLogRepository.getAuditStatistics();
  }

  async cleanupOldAuditLogs(daysToKeep: number = 90): Promise<number> {
    return this.auditLogRepository.deleteOldLogs(daysToKeep);
  }

  // Export Request operations
  async findAllExportRequests(): Promise<ExportRequest[]> {
    return this.exportRequestRepository.findAll();
  }

  async findExportRequestById(id: string): Promise<ExportRequest> {
    const request = await this.exportRequestRepository.findById(id);
    if (!request) {
      throw new NotFoundException('Solicitação de exportação não encontrada');
    }
    return request;
  }

  async findExportRequestsByUserId(userId: string): Promise<ExportRequest[]> {
    return this.exportRequestRepository.findByUserId(userId);
  }

  async findExportRequestsByStatus(status: string): Promise<ExportRequest[]> {
    return this.exportRequestRepository.findByStatus(status);
  }

  async findPendingExportRequests(): Promise<ExportRequest[]> {
    return this.exportRequestRepository.findPendingRequests();
  }

  async findProcessingExportRequests(): Promise<ExportRequest[]> {
    return this.exportRequestRepository.findProcessingRequests();
  }

  async createExportRequest(
    requestData: Partial<ExportRequest>,
  ): Promise<ExportRequest> {
    const request = await this.exportRequestRepository.create({
      ...requestData,
      status: 'pending',
    });

    // Log the export request creation
    await this.logAction(
      AuditAction.CREATE,
      'export_requests',
      request.id,
      requestData.user_id,
      null,
      { request_params: requestData.request_params },
    );

    return request;
  }

  async updateExportRequest(
    id: string,
    requestData: Partial<ExportRequest>,
  ): Promise<ExportRequest> {
    const existingRequest = await this.findExportRequestById(id);
    const updatedRequest = await this.exportRequestRepository.update(
      id,
      requestData,
    );

    // Log the export request update
    await this.logAction(
      AuditAction.UPDATE,
      'export_requests',
      id,
      existingRequest.user_id,
      { status: existingRequest.status },
      { status: updatedRequest.status },
    );

    return updatedRequest;
  }

  async updateExportRequestStatus(
    id: string,
    status: string,
    metadata?: {
      file_path?: string;
      file_size?: number;
      record_count?: number;
      error_message?: string;
    },
  ): Promise<ExportRequest> {
    const existingRequest = await this.findExportRequestById(id);
    const updatedRequest = await this.exportRequestRepository.updateStatus(
      id,
      status,
      metadata,
    );

    // Log the status change
    await this.logAction(
      AuditAction.UPDATE,
      'export_requests',
      id,
      existingRequest.user_id,
      { status: existingRequest.status },
      { status, ...metadata },
    );

    return updatedRequest;
  }

  async markExportRequestAsDownloaded(id: string): Promise<ExportRequest> {
    const request = await this.findExportRequestById(id);
    const updatedRequest =
      await this.exportRequestRepository.markAsDownloaded(id);

    // Log the download
    await this.logAction(
      AuditAction.UPDATE,
      'export_requests',
      id,
      request.user_id,
      null,
      { downloaded_at: updatedRequest.downloaded_at },
    );

    return updatedRequest;
  }

  async deleteExportRequest(id: string): Promise<void> {
    const request = await this.findExportRequestById(id);
    await this.exportRequestRepository.delete(id);

    // Log the deletion
    await this.logAction(
      AuditAction.DELETE,
      'export_requests',
      id,
      request.user_id,
      { status: request.status, file_path: request.file_path },
      null,
    );
  }

  async cleanupExpiredExportRequests(): Promise<number> {
    const deletedCount =
      await this.exportRequestRepository.cleanupExpiredRequests();

    if (deletedCount > 0) {
      // Log the cleanup operation
      await this.logAction(
        AuditAction.DELETE,
        'export_requests',
        undefined,
        undefined,
        null,
        { cleanup_count: deletedCount, reason: 'expired_files' },
      );
    }

    return deletedCount;
  }

  async getExportStatistics(): Promise<any> {
    return this.exportRequestRepository.getExportStatistics();
  }

  async findUserRecentExportRequests(
    userId: string,
    days: number = 30,
  ): Promise<ExportRequest[]> {
    return this.exportRequestRepository.findUserRecentRequests(userId, days);
  }

  // Combined statistics
  async getDashboardStatistics(): Promise<{
    auditStatistics: any;
    exportStatistics: any;
    systemActivity: {
      totalAuditLogs: number;
      recentActivity: number;
      activeExportRequests: number;
      totalExportRequests: number;
    };
  }> {
    const [auditStats, exportStats] = await Promise.all([
      this.getAuditStatistics(),
      this.getExportStatistics(),
    ]);

    const systemActivity = {
      totalAuditLogs: auditStats.total,
      recentActivity: auditStats.recentActivity,
      activeExportRequests: exportStats.processing,
      totalExportRequests: exportStats.total,
    };

    return {
      auditStatistics: auditStats,
      exportStatistics: exportStats,
      systemActivity,
    };
  }

  // Utility methods for common audit scenarios
  async logUserLogin(userId: string, metadata?: any): Promise<AuditLog> {
    return this.logAction(
      AuditAction.LOGIN,
      'users',
      userId,
      userId,
      null,
      null,
      metadata,
    );
  }

  async logUserLogout(userId: string, metadata?: any): Promise<AuditLog> {
    return this.logAction(
      AuditAction.LOGOUT,
      'users',
      userId,
      userId,
      null,
      null,
      metadata,
    );
  }

  async logFormCreation(
    formId: string,
    userId: string,
    formData: any,
  ): Promise<AuditLog> {
    return this.logAction(
      AuditAction.CREATE,
      'forms',
      formId,
      userId,
      null,
      formData,
    );
  }

  async logFormUpdate(
    formId: string,
    userId: string,
    oldData: any,
    newData: any,
  ): Promise<AuditLog> {
    return this.logAction(
      AuditAction.UPDATE,
      'forms',
      formId,
      userId,
      oldData,
      newData,
    );
  }

  async logFormDeletion(
    formId: string,
    userId: string,
    formData: any,
  ): Promise<AuditLog> {
    return this.logAction(
      AuditAction.DELETE,
      'forms',
      formId,
      userId,
      formData,
      null,
    );
  }
}
