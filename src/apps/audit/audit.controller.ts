import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditAction } from '../../shared/enums';
import {
  CreateExportRequestDto,
  UpdateExportRequestDto,
  UpdateExportStatusDto,
} from './dto/in';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // Audit Logs endpoints
  @Get('logs')
  @ApiOperation({ summary: 'Get audit logs with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, enum: AuditAction })
  @ApiQuery({ name: 'tableName', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
  })
  async findAllAuditLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
    @Query('tableName') tableName?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const result = await this.auditService.findAllAuditLogs({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      userId,
      action,
      tableName,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return {
      success: true,
      data: {
        logs: result.logs,
      },
      pagination: {
        page: page || 1,
        limit: limit || 50,
        total: result.total,
        pages: Math.ceil(result.total / (limit || 50)),
        hasNext: (page || 1) < Math.ceil(result.total / (limit || 50)),
        hasPrev: (page || 1) > 1,
      },
    };
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  async findAuditLogById(@Param('id') id: string) {
    const log = await this.auditService.findAuditLogById(id);

    return {
      success: true,
      data: { log },
    };
  }

  @Get('logs/user/:userId')
  @ApiOperation({ summary: 'Get audit logs by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User audit logs retrieved successfully',
  })
  async findAuditLogsByUserId(@Param('userId') userId: string) {
    const logs = await this.auditService.findAuditLogsByUserId(userId);

    return {
      success: true,
      data: { logs },
    };
  }

  @Get('logs/action/:action')
  @ApiOperation({ summary: 'Get audit logs by action' })
  @ApiResponse({
    status: 200,
    description: 'Action audit logs retrieved successfully',
  })
  async findAuditLogsByAction(@Param('action') action: AuditAction) {
    const logs = await this.auditService.findAuditLogsByAction(action);

    return {
      success: true,
      data: { logs },
    };
  }

  @Get('logs/table/:tableName')
  @ApiOperation({ summary: 'Get audit logs by table name' })
  @ApiResponse({
    status: 200,
    description: 'Table audit logs retrieved successfully',
  })
  async findAuditLogsByTable(@Param('tableName') tableName: string) {
    const logs = await this.auditService.findAuditLogsByTable(tableName);

    return {
      success: true,
      data: { logs },
    };
  }

  @Get('logs/record/:tableName/:recordId')
  @ApiOperation({ summary: 'Get audit logs for a specific record' })
  @ApiResponse({
    status: 200,
    description: 'Record audit logs retrieved successfully',
  })
  async findAuditLogsByRecord(
    @Param('tableName') tableName: string,
    @Param('recordId') recordId: string,
  ) {
    const logs = await this.auditService.findAuditLogsByRecord(
      tableName,
      recordId,
    );

    return {
      success: true,
      data: { logs },
    };
  }

  @Get('logs/recent/:days')
  @ApiOperation({ summary: 'Get recent audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Recent audit logs retrieved successfully',
  })
  async findRecentAuditLogs(@Param('days') days: number) {
    const logs = await this.auditService.findRecentAuditLogs(+days);

    return {
      success: true,
      data: { logs },
    };
  }

  @Get('logs/search/:term')
  @ApiOperation({ summary: 'Search audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchAuditLogs(@Param('term') searchTerm: string) {
    const logs = await this.auditService.searchAuditLogs(searchTerm);

    return {
      success: true,
      data: { logs },
    };
  }

  @Get('logs/statistics/overview')
  @ApiOperation({ summary: 'Get audit logs statistics' })
  @ApiResponse({
    status: 200,
    description: 'Audit statistics retrieved successfully',
  })
  async getAuditStatistics() {
    const statistics = await this.auditService.getAuditStatistics();

    return {
      success: true,
      data: { statistics },
    };
  }

  @Delete('logs/cleanup/:days')
  @ApiOperation({ summary: 'Clean up old audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Audit logs cleaned up successfully',
  })
  async cleanupOldAuditLogs(@Param('days') days: number) {
    const deletedCount = await this.auditService.cleanupOldAuditLogs(+days);

    return {
      success: true,
      data: {
        deletedCount,
        message: `${deletedCount} logs antigos foram removidos`,
      },
    };
  }

  // Export Requests endpoints
  @Get('exports')
  @ApiOperation({ summary: 'Get all export requests' })
  @ApiResponse({
    status: 200,
    description: 'Export requests retrieved successfully',
  })
  async findAllExportRequests() {
    const requests = await this.auditService.findAllExportRequests();

    return {
      success: true,
      data: { requests },
    };
  }

  @Get('exports/:id')
  @ApiOperation({ summary: 'Get export request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Export request retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Export request not found' })
  async findExportRequestById(@Param('id') id: string) {
    const request = await this.auditService.findExportRequestById(id);

    return {
      success: true,
      data: { request },
    };
  }

  @Get('exports/user/:userId')
  @ApiOperation({ summary: 'Get export requests by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User export requests retrieved successfully',
  })
  async findExportRequestsByUserId(@Param('userId') userId: string) {
    const requests = await this.auditService.findExportRequestsByUserId(userId);

    return {
      success: true,
      data: { requests },
    };
  }

  @Get('exports/status/:status')
  @ApiOperation({ summary: 'Get export requests by status' })
  @ApiResponse({
    status: 200,
    description: 'Export requests by status retrieved successfully',
  })
  async findExportRequestsByStatus(@Param('status') status: string) {
    const requests = await this.auditService.findExportRequestsByStatus(status);

    return {
      success: true,
      data: { requests },
    };
  }

  @Get('exports/filter/pending')
  @ApiOperation({ summary: 'Get pending export requests' })
  @ApiResponse({
    status: 200,
    description: 'Pending export requests retrieved successfully',
  })
  async findPendingExportRequests() {
    const requests = await this.auditService.findPendingExportRequests();

    return {
      success: true,
      data: { requests },
    };
  }

  @Get('exports/filter/processing')
  @ApiOperation({ summary: 'Get processing export requests' })
  @ApiResponse({
    status: 200,
    description: 'Processing export requests retrieved successfully',
  })
  async findProcessingExportRequests() {
    const requests = await this.auditService.findProcessingExportRequests();

    return {
      success: true,
      data: { requests },
    };
  }

  @Post('exports')
  @ApiOperation({ summary: 'Create export request' })
  @ApiResponse({
    status: 201,
    description: 'Export request created successfully',
  })
  async createExportRequest(@Body() requestData: CreateExportRequestDto) {
    const request = await this.auditService.createExportRequest(requestData);

    return {
      success: true,
      data: { request },
    };
  }

  @Put('exports/:id')
  @ApiOperation({ summary: 'Update export request' })
  @ApiResponse({
    status: 200,
    description: 'Export request updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Export request not found' })
  async updateExportRequest(
    @Param('id') id: string,
    @Body() requestData: UpdateExportRequestDto,
  ) {
    const request = await this.auditService.updateExportRequest(
      id,
      requestData,
    );

    return {
      success: true,
      data: { request },
    };
  }

  @Put('exports/:id/status')
  @ApiOperation({ summary: 'Update export request status' })
  @ApiResponse({
    status: 200,
    description: 'Export request status updated successfully',
  })
  async updateExportRequestStatus(
    @Param('id') id: string,
    @Body() statusData: UpdateExportStatusDto,
  ) {
    const request = await this.auditService.updateExportRequestStatus(
      id,
      statusData.status,
      statusData.metadata,
    );

    return {
      success: true,
      data: { request },
    };
  }

  @Put('exports/:id/downloaded')
  @ApiOperation({ summary: 'Mark export request as downloaded' })
  @ApiResponse({
    status: 200,
    description: 'Export request marked as downloaded successfully',
  })
  async markExportRequestAsDownloaded(@Param('id') id: string) {
    const request = await this.auditService.markExportRequestAsDownloaded(id);

    return {
      success: true,
      data: { request },
    };
  }

  @Delete('exports/:id')
  @ApiOperation({ summary: 'Delete export request' })
  @ApiResponse({
    status: 200,
    description: 'Export request deleted successfully',
  })
  async deleteExportRequest(@Param('id') id: string) {
    await this.auditService.deleteExportRequest(id);

    return {
      success: true,
      data: { message: 'Solicitação de exportação excluída com sucesso' },
    };
  }

  @Delete('exports/cleanup/expired')
  @ApiOperation({ summary: 'Clean up expired export requests' })
  @ApiResponse({
    status: 200,
    description: 'Expired export requests cleaned up successfully',
  })
  async cleanupExpiredExportRequests() {
    const deletedCount = await this.auditService.cleanupExpiredExportRequests();

    return {
      success: true,
      data: {
        deletedCount,
        message: `${deletedCount} solicitações expiradas foram removidas`,
      },
    };
  }

  @Get('exports/statistics/overview')
  @ApiOperation({ summary: 'Get export requests statistics' })
  @ApiResponse({
    status: 200,
    description: 'Export statistics retrieved successfully',
  })
  async getExportStatistics() {
    const statistics = await this.auditService.getExportStatistics();

    return {
      success: true,
      data: { statistics },
    };
  }

  @Get('exports/user/:userId/recent/:days')
  @ApiOperation({ summary: 'Get user recent export requests' })
  @ApiResponse({
    status: 200,
    description: 'Recent user export requests retrieved successfully',
  })
  async findUserRecentExportRequests(
    @Param('userId') userId: string,
    @Param('days') days: number,
  ) {
    const requests = await this.auditService.findUserRecentExportRequests(
      userId,
      +days,
    );

    return {
      success: true,
      data: { requests },
    };
  }

  // Dashboard statistics
  @Get('dashboard/statistics')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
  })
  async getDashboardStatistics() {
    const statistics = await this.auditService.getDashboardStatistics();

    return {
      success: true,
      data: { statistics },
    };
  }
}
