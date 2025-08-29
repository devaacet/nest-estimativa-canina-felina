import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FormRepository } from './repositories/form.repository';
import { FormQuestionResponseRepository } from './repositories/form-question-response.repository';
import { Form } from './entities/form.entity';
import { FormQuestionResponse } from './entities/form-question-response.entity';
import {
  CreateFormDto,
  CreateFormResponseDto,
  FormListResponseDto,
  UpdateFormDto,
} from './dto';
import { FormStatus } from '../../shared/enums';
import { CurrentUserDto, PaginatedDataDto, UserRole } from '../../shared';
import { CityService } from '../city/city.service';

@Injectable()
export class FormService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly formQuestionResponseRepository: FormQuestionResponseRepository,
    private readonly cityService: CityService,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create({
      ...createFormDto,
      status: FormStatus.DRAFT,
      currentStep: 1,
    });

    return this.formRepository.save(form);
  }

  async findAll(): Promise<Form[]> {
    return this.formRepository.find({
      relations: ['user', 'city'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formRepository.getFormWithAllRelations(id);
    if (!form) {
      throw new NotFoundException(`Form with ID "${id}" not found`);
    }
    return form;
  }

  async findByUser(userId: string): Promise<Form[]> {
    return this.formRepository.findByUserId(userId);
  }

  async findByCity(cityId: string): Promise<Form[]> {
    return this.formRepository.findByCityId(cityId);
  }

  async findByUserAndCity(userId: string, cityId: string): Promise<Form[]> {
    return this.formRepository.findByUserAndCity(userId, cityId);
  }

  async findDraftsByUser(userId: string): Promise<Form[]> {
    return this.formRepository.findDraftsByUser(userId);
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.findOne(id);

    Object.assign(form, updateFormDto);

    return this.formRepository.save(form);
  }

  async updateStep(id: string, step: number): Promise<Form> {
    if (step < 1 || step > 8) {
      throw new BadRequestException('Step must be between 1 and 8');
    }

    const form = await this.findOne(id);

    // Validate step progression logic
    if (step === 4 && form.hasDogsCats === false) {
      throw new BadRequestException(
        'Cannot go to current animals step when household has no pets',
      );
    }

    if ((step === 5 || step === 6) && form.hasDogsCats === false) {
      throw new BadRequestException(
        'Cannot go to previous animals or puppies step when household has no pets',
      );
    }

    if (step === 7 && form.hasDogsCats === true) {
      throw new BadRequestException(
        'Cannot go to animal absence step when household has pets',
      );
    }

    await this.formRepository.updateCurrentStep(id, step);

    return this.findOne(id);
  }

  async markAsCompleted(id: string): Promise<Form> {
    const form = await this.findOne(id);

    // Validate if form can be completed
    if (form.currentStep < 8) {
      throw new BadRequestException(
        'Form must be at step 8 to be marked as completed',
      );
    }

    await this.formRepository.markAsCompleted(id);

    return this.findOne(id);
  }

  async markAsSubmitted(id: string): Promise<Form> {
    const form = await this.findOne(id);

    if (form.status !== FormStatus.COMPLETED) {
      throw new BadRequestException('Form must be completed before submission');
    }

    await this.formRepository.markAsSubmitted(id);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const form = await this.findOne(id);
    await this.formRepository.remove(form);
  }

  // Form Question Response methods
  async addQuestionResponse(
    formId: string,
    createResponseDto: CreateFormResponseDto,
  ): Promise<FormQuestionResponse> {
    await this.findOne(formId);

    return this.formQuestionResponseRepository.upsertResponse(
      formId,
      createResponseDto.questionId,
      createResponseDto.responseText || '',
    );
  }

  async getFormResponses(formId: string): Promise<FormQuestionResponse[]> {
    return this.formQuestionResponseRepository.findByFormId(formId);
  }

  async updateQuestionResponse(
    formId: string,
    questionId: string,
    responseText: string,
  ): Promise<FormQuestionResponse> {
    return this.formQuestionResponseRepository.upsertResponse(
      formId,
      questionId,
      responseText,
    );
  }

  async deleteQuestionResponse(
    formId: string,
    questionId: string,
  ): Promise<void> {
    await this.formQuestionResponseRepository.deleteByFormAndQuestion(
      formId,
      questionId,
    );
  }

  async validateFormCompletion(
    id: string,
  ): Promise<{ isValid: boolean; missingRequiredFields: string[] }> {
    const form = await this.findOne(id);
    const missingFields: string[] = [];

    // Step 1 validation
    if (!form.interviewerName) missingFields.push('interviewerName');
    if (!form.interviewDate) missingFields.push('interviewDate');
    if (!form.interviewStatus) missingFields.push('interviewStatus');

    // Step 2 validation
    if (!form.educationLevel) missingFields.push('educationLevel');
    if (!form.housingType) missingFields.push('housingType');

    // Step 3 validation
    if (form.hasDogsCats === null || form.hasDogsCats === undefined) {
      missingFields.push('hasDogsCats');
    }

    // Check required question responses
    const unansweredRequired =
      await this.formQuestionResponseRepository.findRequiredUnansweredByForm(
        id,
      );
    unansweredRequired.forEach((response) => {
      missingFields.push(`question_${response.questionId}`);
    });

    return {
      isValid: missingFields.length === 0,
      missingRequiredFields: missingFields,
    };
  }

  async getFormsByDateRange(startDate: Date, endDate: Date): Promise<Form[]> {
    return this.formRepository.findSubmittedByDateRange(startDate, endDate);
  }

  async getAnimalCount(formId: string): Promise<number> {
    return this.formRepository.getAnimalCount(formId);
  }

  async getDashboardData(
    user: CurrentUserDto,
    cityIds?: string[],
    dateRange?: { startDate: Date; endDate: Date },
  ): Promise<{
    totalInterviews: number;
    completedForms: number;
    activeCities: number;
    totalAnimals: number;
    chart: {
      completedFormsTimeline: Array<{
        date: string;
        completedForms: number;
      }>;
    };
  }> {
    // Determinar período padrão se não fornecido (últimos 30 dias)
    const endDate = dateRange?.endDate || new Date();
    const startDate =
      dateRange?.startDate || new Date(Date.now() - 700 * 24 * 60 * 60 * 1000);

    // Buscar cidades que o usuário tem acesso
    let userCityIds: string[] = [];

    if (user.role === UserRole.ADMINISTRATOR) {
      userCityIds = cityIds ?? [];
    } else {
      // Para usuários não-admin, sempre validar acesso
      const userAccessibleCities =
        await this.cityService.findCitiesForUser(user);
      const userAccessibleCityIds = userAccessibleCities.map((city) => city.id);

      if (cityIds && cityIds.length > 0) {
        // Filtrar apenas as cidades que o usuário tem acesso
        userCityIds = cityIds.filter((cityId) =>
          userAccessibleCityIds.includes(cityId),
        );

        // Se nenhuma cidade válida foi fornecida, usar todas as cidades do usuário
        if (userCityIds.length === 0) {
          userCityIds = userAccessibleCityIds;
        }
      } else {
        // Se não foi fornecido cityIds, usar todas as cidades que o usuário tem acesso
        userCityIds = userAccessibleCityIds;
      }
    }

    // Calcular diferença para agrupamento
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const weeksDiff = Math.ceil(daysDiff / 7);

    let groupBy: 'day' | 'week' | 'month' = 'day';
    if (daysDiff > 14) groupBy = 'week';
    if (weeksDiff > 8) groupBy = 'month';

    // Buscar dados do repositório
    const kpisData = await this.formRepository.getKpisData(userCityIds, {
      startDate,
      endDate,
    });
    const timelineData = await this.formRepository.getCompletedFormsTimeline(
      userCityIds,
      { startDate, endDate },
      groupBy,
    );

    // Contar cidades ativas (que têm formulários no período)
    const activeCities = await this.formRepository.getActiveCitiesCount(
      userCityIds,
      { startDate, endDate },
    );

    return {
      totalInterviews: kpisData.totalForms,
      completedForms: kpisData.completedForms,
      activeCities: activeCities,
      totalAnimals: kpisData.totalAnimalsRegistered,
      chart: {
        completedFormsTimeline: timelineData,
      },
    };
  }

  private transformToListResponse(this: void, form: Form): FormListResponseDto {
    const progress = (form.currentStep / 8) * 100;

    return {
      id: form.id,
      status: form.status,
      progress: Math.round(progress * 100) / 100, // Round to 2 decimal places
      interviewerName: form.interviewerName || form.user.name,
      interviewDate: form.interviewDate.toString(),
      censusSectorCode: form.censusSectorCode,
      cityName: form.city.name,
      address: form.addressStreet,
      number: form.addressNumber,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    };
  }

  async findAllWithPagination({
    user,
    page = 1,
    limit = 10,
    cityIds,
    dateRange,
  }: {
    user: CurrentUserDto;
    page?: number;
    limit?: number;
    cityIds?: string[];
    dateRange?: { startDate: Date; endDate: Date };
  }): Promise<PaginatedDataDto<FormListResponseDto>> {
    let accessibleCityIds: string[] = [];

    if (user.role === UserRole.ADMINISTRATOR) {
      accessibleCityIds = cityIds || [];
    } else {
      const userCities = await this.cityService.findCitiesForUser(user);
      accessibleCityIds = userCities.map((city) => city.id);

      // If cityIds filter is provided, intersect with user's accessible cities
      if (cityIds && cityIds.length > 0) {
        accessibleCityIds = cityIds.filter((cityId) =>
          accessibleCityIds.includes(cityId),
        );
      }
    }

    // Get paginated forms from repository
    const { forms, total } = await this.formRepository.findAllWithPagination({
      page,
      limit,
      cityIds: accessibleCityIds,
      userId: user.role === UserRole.RESEARCHER ? user.id : undefined,
      dateRange,
    });

    // Transform forms to list response DTOs
    return new PaginatedDataDto(
      forms.map(this.transformToListResponse),
      total,
      limit,
      page,
    );
  }
}
