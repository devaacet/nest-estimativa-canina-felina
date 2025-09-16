import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FormRepository } from './repositories/form.repository';
import { FormQuestionResponseRepository } from './repositories/form-question-response.repository';
import { Form } from './entities/form.entity';
import { FormQuestionResponse } from './entities/form-question-response.entity';
import { CurrentAnimalForm } from './entities/current-animal-form.entity';
import { PreviousAnimalForm } from './entities/previous-animal-form.entity';
import { PuppiesKittensForm } from './entities/puppies-kittens-form.entity';
import { AnimalAbsenceForm } from './entities/animal-absence-form.entity';
import { ExcelExportService } from './services/excel-export.service';
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
    private readonly excelExportService: ExcelExportService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create({
      ...createFormDto,
      status: FormStatus.DRAFT,
      currentStep: 1,
    });

    return this.formRepository.save(form);
  }

  async createOrUpdate(
    id: string,
    createFormDto: CreateFormDto,
  ): Promise<Form> {
    return this.dataSource.transaction(async (manager) => {
      let form = await manager.findOne(Form, {
        where: { id },
        relations: [
          'currentAnimals',
          'previousAnimals',
          'puppiesKittens',
          'animalAbsence',
        ],
      });

      if (form) {
        // Update existing form
        const {
          currentAnimals,
          previousAnimals,
          puppiesKittens,
          animalAbsence,
          cityQuestions,
          ...formData
        } = createFormDto;

        // Update form fields
        Object.assign(form, formData);
        form = await manager.save(Form, {
          ...form,
          city: {
            id: formData.cityId,
          },
          user: {
            id: formData.userId,
          },
        });

        // Handle current animals
        if (currentAnimals) {
          // Remove existing animals
          await manager.delete(CurrentAnimalForm, { formId: id });

          // Create new animals
          for (let i = 0; i < currentAnimals.length; i++) {
            const animal = manager.create(CurrentAnimalForm, {
              ...currentAnimals[i],
              formId: id,
              registrationOrder: i + 1,
            });
            await manager.save(CurrentAnimalForm, animal);
          }
        }

        // Handle previous animals
        if (previousAnimals) {
          await manager.delete(PreviousAnimalForm, { formId: id });

          for (let i = 0; i < previousAnimals.length; i++) {
            const animal = manager.create(PreviousAnimalForm, {
              ...previousAnimals[i],
              formId: id,
              registrationOrder: i + 1,
            });
            await manager.save(PreviousAnimalForm, animal);
          }
        }

        // Handle puppies and kittens - single object
        if (puppiesKittens) {
          await manager.delete(PuppiesKittensForm, { formId: id });

          const puppies = manager.create(PuppiesKittensForm, {
            ...puppiesKittens,
            formId: id,
            registrationOrder: 1,
          });
          await manager.save(PuppiesKittensForm, puppies);
        }

        // Handle animal absence - single object
        if (animalAbsence) {
          await manager.delete(AnimalAbsenceForm, { formId: id });

          const absenceEntity = manager.create(AnimalAbsenceForm, {
            castrationDecision: animalAbsence.castrationDecision,
            castrationReason: animalAbsence.castrationReason,
            hypotheticalAcquisition: animalAbsence.hypotheticalAcquisition,
            noAnimalsReasons: animalAbsence.noAnimalsReasons,
            formId: id,
          });
          await manager.save(AnimalAbsenceForm, absenceEntity);
        }

        // Handle city question responses
        if (cityQuestions) {
          // Remove existing responses
          await manager.delete(FormQuestionResponse, { formId: id });

          // Create new responses
          for (const response of cityQuestions) {
            const questionResponse = manager.create(FormQuestionResponse, {
              formId: id,
              questionId: response.questionId,
              responseText: response.responseText,
            });
            await manager.save(FormQuestionResponse, questionResponse);
          }
        }
      } else {
        // Create new form
        const {
          currentAnimals,
          previousAnimals,
          puppiesKittens,
          animalAbsence,
          cityQuestions,
          ...formData
        } = createFormDto;

        form = manager.create(Form, {
          id,
          ...formData,
          status: formData.status || FormStatus.DRAFT,
          currentStep: formData.currentStep || 1,
          city: {
            id: formData.cityId,
          },
          user: {
            id: formData.userId,
          },
        });
        form = await manager.save(Form, form);

        // Create related animals
        if (currentAnimals) {
          for (let i = 0; i < currentAnimals.length; i++) {
            const animal = manager.create(CurrentAnimalForm, {
              ...currentAnimals[i],
              formId: id,
              registrationOrder: i + 1,
            });
            await manager.save(CurrentAnimalForm, animal);
          }
        }

        if (previousAnimals) {
          for (let i = 0; i < previousAnimals.length; i++) {
            const animal = manager.create(PreviousAnimalForm, {
              ...previousAnimals[i],
              formId: id,
              registrationOrder: i + 1,
            });
            await manager.save(PreviousAnimalForm, animal);
          }
        }

        if (puppiesKittens) {
          const puppies = manager.create(PuppiesKittensForm, {
            ...puppiesKittens,
            formId: id,
            registrationOrder: 1,
          });
          await manager.save(PuppiesKittensForm, puppies);
        }

        if (animalAbsence) {
          const absenceEntity = manager.create(AnimalAbsenceForm, {
            castrationDecision: animalAbsence.castrationDecision,
            castrationReason: animalAbsence.castrationReason,
            hypotheticalAcquisition: animalAbsence.hypotheticalAcquisition,
            noAnimalsReasons: animalAbsence.noAnimalsReasons,
            formId: id,
          });
          await manager.save(AnimalAbsenceForm, absenceEntity);
        }

        // Handle city question responses for new form
        if (cityQuestions) {
          for (const response of cityQuestions) {
            const questionResponse = manager.create(FormQuestionResponse, {
              formId: id,
              questionId: response.questionId,
              responseText: response.responseText,
            });
            await manager.save(FormQuestionResponse, questionResponse);
          }
        }
      }

      // Return form with all relations
      const formWithRelations = await manager.findOne(Form, {
        where: { id },
        relations: [
          'user',
          'city',
          'currentAnimals',
          'previousAnimals',
          'puppiesKittens',
          'animalAbsence',
          'questionResponses',
        ],
      });

      if (!formWithRelations) {
        throw new NotFoundException(
          `Form with ID "${id}" not found after creation/update`,
        );
      }

      return formWithRelations;
    });
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

    if (form.status !== FormStatus.DRAFT) form.currentStep = 1;
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
    await this.formRepository.softRemove(form);
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
    const endDate = dateRange?.endDate || new Date();
    const startDate =
      dateRange?.startDate || new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);

    const accessibleCityIds = await this.getCityIdsFilter(user, cityIds);

    // Calcular diferença para agrupamento
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (7 * 60 * 60 * 24),
    );
    const weeksDiff = Math.ceil(daysDiff / 7);

    let groupBy: 'day' | 'week' | 'month' = 'day';
    if (daysDiff > 30) groupBy = 'week';
    if (weeksDiff > 8) groupBy = 'month';

    // Buscar dados do repositório
    const kpisData = await this.formRepository.getKpisData(accessibleCityIds, {
      startDate,
      endDate,
    });
    const timelineData = await this.formRepository.getCompletedFormsTimeline(
      accessibleCityIds,
      { startDate, endDate },
      groupBy,
    );

    // Contar cidades ativas (que têm formulários no período)
    const activeCities = await this.formRepository.getActiveCitiesCount(
      accessibleCityIds,
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
    let progress = (form.currentStep / 8) * 100;

    if (form.status !== FormStatus.DRAFT) {
      progress = 100;
    }

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

  private async getCityIdsFilter(user: CurrentUserDto, cityIds?: string[]) {
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

    return accessibleCityIds;
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
    const accessibleCityIds = await this.getCityIdsFilter(user, cityIds);

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

  async getFormsForExcelExport({
    user,
    cityIds,
    dateRange,
  }: {
    user: CurrentUserDto;
    cityIds?: string[];
    dateRange?: { startDate: Date; endDate: Date };
  }): Promise<Form[]> {
    const accessibleCityIds = await this.getCityIdsFilter(user, cityIds);

    // Get forms with all relations for Excel export
    return this.formRepository.getFormsWithAllRelationsForExport({
      cityIds: accessibleCityIds,
      userId: user.role === UserRole.RESEARCHER ? user.id : undefined,
      dateRange,
    });
  }

  async generateExcelExport(forms: Form[]): Promise<Buffer> {
    return this.excelExportService.generateFormsExcel(forms);
  }
}
