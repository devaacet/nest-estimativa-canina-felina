import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormService } from './forms.service';
import {
  CreateFormDto,
  CreateFormResponseDto,
  FormListResponseDto,
  UpdateFormDto,
} from './dto';
import { CurrentUser } from '../../shared';
import type { CurrentUserDto, PaginatedDataDto } from '../../shared';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('Form')
@Controller('form')
@UseGuards(JwtAuthGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create(createFormDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Create or update a form (idempotent operation)',
    description:
      'Creates a new form or updates existing one. Used for auto-save and submit operations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Form created or updated successfully',
  })
  createOrUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createFormDto: CreateFormDto,
  ) {
    return this.formService.createOrUpdate(id, createFormDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List forms with pagination and role-based access control',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'cityIds',
    required: false,
    type: String,
    description:
      'Comma-separated city IDs to filter (intersected with user accessible cities)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for filtering forms (YYYY-MM-DD format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for filtering forms (YYYY-MM-DD format)',
  })
  @ApiResponse({ status: 200, description: 'Forms retrieved successfully' })
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

  @Get('drafts')
  findDrafts(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.formService.findDraftsByUser(userId);
  }

  @Get('date-range')
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
      'Comma-separated city IDs to filter (intersected with user accessible cities)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for filtering forms (YYYY-MM-DD format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for filtering forms (YYYY-MM-DD format)',
  })
  @Get('dashboard')
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formService.update(id, updateFormDto);
  }

  @Patch(':id/step')
  updateStep(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('step', ParseIntPipe) step: number,
  ) {
    return this.formService.updateStep(id, step);
  }

  @Patch(':id/complete')
  markAsCompleted(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.markAsCompleted(id);
  }

  @Patch(':id/submit')
  markAsSubmitted(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.markAsSubmitted(id);
  }

  @Post(':id/validate')
  validateCompletion(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.validateFormCompletion(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.formService.remove(id);
  }

  // Form Question Response endpoints
  @Post(':id/responses')
  addQuestionResponse(
    @Param('id', ParseUUIDPipe) formId: string,
    @Body() createResponseDto: CreateFormResponseDto,
  ) {
    return this.formService.addQuestionResponse(formId, createResponseDto);
  }

  @Get(':id/responses')
  getFormResponses(@Param('id', ParseUUIDPipe) formId: string) {
    return this.formService.getFormResponses(formId);
  }

  @Patch(':id/responses/:questionId')
  updateQuestionResponse(
    @Param('id', ParseUUIDPipe) formId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body('responseText') responseText: string,
  ) {
    return this.formService.updateQuestionResponse(
      formId,
      questionId,
      responseText,
    );
  }

  @Delete(':id/responses/:questionId')
  deleteQuestionResponse(
    @Param('id', ParseUUIDPipe) formId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.formService.deleteQuestionResponse(formId, questionId);
  }

  @Get(':id/animal-count')
  getAnimalCount(@Param('id', ParseUUIDPipe) formId: string) {
    return this.formService.getAnimalCount(formId);
  }

  @Get('export/excel')
  @ApiOperation({
    summary: 'Export forms to Excel file with role-based access control',
  })
  @ApiQuery({
    name: 'cityIds',
    required: false,
    type: String,
    description:
      'Comma-separated city IDs to filter (intersected with user accessible cities)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for filtering forms (YYYY-MM-DD format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for filtering forms (YYYY-MM-DD format)',
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated and downloaded successfully',
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
