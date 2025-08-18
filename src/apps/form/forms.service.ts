import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FormRepository } from './repositories/form.repository';
import { FormQuestionResponseRepository } from './repositories/form-question-response.repository';
import { Form } from './entities/form.entity';
import { FormQuestionResponse } from './entities/form-question-response.entity';
import { CreateFormDto, CreateFormResponseDto, UpdateFormDto } from './dto';
import { FormStatus } from '../../shared/enums';

@Injectable()
export class FormService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly formQuestionResponseRepository: FormQuestionResponseRepository,
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
    const form = await this.findOne(formId);

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
}
