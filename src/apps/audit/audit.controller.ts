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

@ApiTags('Auditoria')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // Audit Logs endpoints
  @Get('logs')
  @ApiOperation({
    summary: 'Obter logs de auditoria com filtragem e paginação',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de itens por página',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'ID do usuário para filtrar',
  })
  @ApiQuery({
    name: 'action',
    required: false,
    enum: AuditAction,
    description: 'Ação para filtrar',
  })
  @ApiQuery({
    name: 'tableName',
    required: false,
    type: String,
    description: 'Nome da tabela para filtrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs de auditoria recuperados com sucesso',
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
  @ApiOperation({ summary: 'Obter log de auditoria por ID' })
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
  @ApiOperation({ summary: 'Obter logs de auditoria por ID do usuário' })
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
  @ApiOperation({ summary: 'Obter logs de auditoria por ação' })
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
  @ApiOperation({ summary: 'Obter logs de auditoria por nome da tabela' })
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
  @ApiOperation({
    summary: 'Obter logs de auditoria para um registro específico',
  })
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
  @ApiOperation({ summary: 'Obter logs de auditoria recentes' })
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
  @ApiOperation({ summary: 'Buscar logs de auditoria' })
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
  @ApiOperation({ summary: 'Obter estatísticas de logs de auditoria' })
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
  @ApiOperation({ summary: 'Limpar logs de auditoria antigos' })
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
  @ApiOperation({ summary: 'Obter todas as solicitações de exportação' })
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
  @ApiOperation({ summary: 'Obter solicitação de exportação por ID' })
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
  @ApiOperation({
    summary: 'Obter solicitações de exportação por ID do usuário',
  })
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
  @ApiOperation({ summary: 'Obter solicitações de exportação por status' })
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
  @ApiOperation({ summary: 'Obter solicitações de exportação pendentes' })
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
  @ApiOperation({
    summary: 'Obter solicitações de exportação em processamento',
  })
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
  @ApiOperation({ summary: 'Criar solicitação de exportação' })
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
  @ApiOperation({ summary: 'Atualizar solicitação de exportação' })
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
  @ApiOperation({ summary: 'Atualizar status da solicitação de exportação' })
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
  @ApiOperation({ summary: 'Marcar solicitação de exportação como baixada' })
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
  @ApiOperation({ summary: 'Deletar solicitação de exportação' })
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
  @ApiOperation({ summary: 'Limpar solicitações de exportação expiradas' })
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
  @ApiOperation({ summary: 'Obter estatísticas de solicitações de exportação' })
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
  @ApiOperation({
    summary: 'Obter solicitações de exportação recentes do usuário',
  })
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
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
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
