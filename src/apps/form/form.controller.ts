import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormService } from './forms.service';
import { CreateFormDto, FormListResponseDto } from './dto';
import { CurrentUser, Roles, UserRole } from '../../shared';
import type { CurrentUserDto, PaginatedDataDto } from '../../shared';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('Formulários')
@Controller('form')
@UseGuards(JwtAuthGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.RESEARCHER)
  @Put(':id')
  @ApiOperation({
    summary: 'Criar ou atualizar um formulário (operação idempotente)',
    description:
      'Cria um novo formulário ou atualiza um existente. Usado para operações de salvamento automático e envio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Formulário criado ou atualizado com sucesso',
  })
  createOrUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createFormDto: CreateFormDto,
  ) {
    return this.formService.createOrUpdate(id, createFormDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Listar formulários com paginação e controle de acesso baseado em função',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'cityIds',
    required: false,
    type: String,
    description:
      'IDs de cidades separados por vírgula para filtrar (intersectados com cidades acessíveis ao usuário)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data de início para filtrar formulários (formato YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data de fim para filtrar formulários (formato YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Formulários recuperados com sucesso',
  })
  async findAll(
    @CurrentUser() user: CurrentUserDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('cityIds') cityIds?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PaginatedDataDto<FormListResponseDto>> {
    const cityIdsArray = cityIds
      ? cityIds.split(',').filter((id) => id.trim())
      : undefined;

    const dateRange =
      startDate && endDate
        ? { startDate: new Date(startDate), endDate: new Date(endDate) }
        : undefined;

    return await this.formService.findAllWithPagination({
      user,
      page,
      limit,
      cityIds: cityIdsArray,
      dateRange,
    });
  }

  @Get('date-range')
  @ApiOperation({
    summary: 'Buscar formulários por faixa de datas',
    description: 'Recupera formulários dentro de uma faixa de datas específica',
  })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.formService.getFormsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @ApiQuery({
    name: 'cityIds',
    required: false,
    type: String,
    description:
      'IDs de cidades separados por vírgula para filtrar (intersectados com cidades acessíveis ao usuário)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data de início para filtrar formulários (formato YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data de fim para filtrar formulários (formato YYYY-MM-DD)',
  })
  @Get('dashboard')
  @ApiOperation({
    summary: 'Obter dados do dashboard',
    description: 'Recupera estatísticas e dados agregados para o dashboard',
  })
  getDashboard(
    @CurrentUser() user: CurrentUserDto,
    @Query('cityIds') cityIds?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const cityIdsArray = cityIds ? cityIds.split(',') : undefined;
    const dateRange =
      startDate && endDate
        ? {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          }
        : undefined;

    return this.formService.getDashboardData(user, cityIdsArray, dateRange);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter formulário por ID',
    description: 'Recupera um formulário específico pelo seu ID',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.findOne(id);
  }

  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar formulário',
    description: 'Remove um formulário do sistema',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.remove(id);
  }

  @Get('export/excel')
  @ApiOperation({
    summary:
      'Exportar formulários para arquivo Excel com controle de acesso baseado em função',
  })
  @ApiQuery({
    name: 'cityIds',
    required: false,
    type: String,
    description:
      'IDs de cidades separados por vírgula para filtrar (intersectados com cidades acessíveis ao usuário)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data de início para filtrar formulários (formato YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data de fim para filtrar formulários (formato YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo Excel gerado e baixado com sucesso',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async exportToExcel(
    @CurrentUser() user: CurrentUserDto,
    @Res() res: Response,
    @Query('cityIds') cityIds?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<void> {
    const cityIdsArray = cityIds
      ? cityIds.split(',').filter((id) => id.trim())
      : undefined;

    const dateRange =
      startDate && endDate
        ? { startDate: new Date(startDate), endDate: new Date(endDate) }
        : undefined;

    // Use the same logic as findAll to get forms with proper access control
    const formsData = await this.formService.getFormsForExcelExport({
      user,
      cityIds: cityIdsArray,
      dateRange,
    });

    // Generate Excel buffer
    const excelBuffer = await this.formService.generateExcelExport(formsData);

    // Set response headers for file download
    const filename = `forms-export-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': excelBuffer.length.toString(),
    });

    // Send the buffer
    res.end(excelBuffer);
  }
}
