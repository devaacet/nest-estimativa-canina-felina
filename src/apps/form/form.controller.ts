import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FormService } from './forms.service';
import { CreateFormDto, CreateFormResponseDto, UpdateFormDto } from './dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create(createFormDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('cityId') cityId?: string) {
    if (userId && cityId) {
      return this.formService.findByUserAndCity(userId, cityId);
    }
    if (userId) {
      return this.formService.findByUser(userId);
    }
    if (cityId) {
      return this.formService.findByCity(cityId);
    }
    return this.formService.findAll();
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

  @Patch(':id/update-animal-count')
  updateAnimalCount(@Param('id', ParseUUIDPipe) formId: string) {
    return this.formService.updateAnimalCount(formId);
  }
}
