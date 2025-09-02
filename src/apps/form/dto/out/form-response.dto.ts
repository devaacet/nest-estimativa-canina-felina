import { ApiProperty } from '@nestjs/swagger';
import {
  EducationLevel,
  HousingType,
  IncomeRange,
  InterviewStatus,
  ResidenceType,
  VetFrequency,
} from '../../../../shared/enums';

export class FormResponseDto {
  @ApiProperty({
    description: 'Form ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who filled the form',
    example: 'uuid-string',
  })
  userId: string;

  @ApiProperty({
    description: 'City ID where the form was conducted',
    example: 'uuid-string',
  })
  cityId: string;

  @ApiProperty({
    description: 'Current step of the form (1-8)',
    example: 3,
    minimum: 1,
    maximum: 8,
  })
  currentStep: number;

  @ApiProperty({
    description: 'Whether the form is completed',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Whether the form is submitted',
    example: false,
  })
  isSubmitted: boolean;

  @ApiProperty({
    description: 'Name of the interviewer',
    example: 'João Silva',
    required: false,
  })
  interviewerName?: string;

  @ApiProperty({
    description: 'Interview date',
    example: '2024-01-01',
    required: false,
  })
  interviewDate?: string;

  @ApiProperty({
    description: 'Census sector code',
    example: '123456789',
    required: false,
  })
  censusSectorCode?: string;

  @ApiProperty({
    description: 'Interview status',
    enum: InterviewStatus,
    required: false,
  })
  interviewStatus?: InterviewStatus;

  @ApiProperty({
    description: 'Street address',
    example: 'Rua das Flores',
    required: false,
  })
  addressStreet?: string;

  @ApiProperty({
    description: 'Address number',
    example: '123',
    required: false,
  })
  addressNumber?: string;

  @ApiProperty({
    description: 'Address complement',
    example: 'Apt 45',
    required: false,
  })
  addressComplement?: string;

  @ApiProperty({
    description: 'Residence type',
    enum: ResidenceType,
    required: false,
  })
  residenceType?: ResidenceType;

  @ApiProperty({
    description: 'Education level',
    enum: EducationLevel,
    required: false,
  })
  educationLevel?: EducationLevel;

  @ApiProperty({
    description: 'Number of children',
    example: 2,
    required: false,
  })
  childrenCount?: number;

  @ApiProperty({
    description: 'Number of teenagers',
    example: 1,
    required: false,
  })
  teensCount?: number;

  @ApiProperty({
    description: 'Number of adults',
    example: 2,
    required: false,
  })
  adultsCount?: number;

  @ApiProperty({
    description: 'Number of elderly',
    example: 0,
    required: false,
  })
  elderlyCount?: number;

  @ApiProperty({
    description: 'Housing type',
    enum: HousingType,
    required: false,
  })
  housingType?: HousingType;

  @ApiProperty({
    description: 'Monthly income range',
    enum: IncomeRange,
    required: false,
  })
  monthlyIncome?: IncomeRange;

  @ApiProperty({
    description: 'Has dogs or cats',
    example: true,
    required: false,
  })
  hasDogsCats?: boolean;

  @ApiProperty({
    description: 'General animal destiny description',
    example: 'Kept as family pets',
    required: false,
  })
  generalAnimalDestiny?: string;

  @ApiProperty({
    description: 'Are there stray animals in the neighborhood',
    example: true,
    required: false,
  })
  strayAnimalsNeighborhood?: boolean;

  @ApiProperty({
    description: 'Number of stray animals',
    example: 5,
    required: false,
  })
  strayAnimalsCount?: number;

  @ApiProperty({
    description: 'Species of stray animals',
    example: 'Dogs and cats',
    required: false,
  })
  strayAnimalsSpecies?: string;

  @ApiProperty({
    description: 'Condition of stray animals',
    example: 'Poor health condition',
    required: false,
  })
  strayAnimalsCondition?: string;

  @ApiProperty({
    description: 'Cares for street animals',
    example: true,
    required: false,
  })
  caresStreetAnimals?: boolean;

  @ApiProperty({
    description: 'Types of care provided',
    example: 'Food and water',
    required: false,
  })
  careTypes?: string;

  @ApiProperty({
    description: 'Veterinary visit frequency',
    enum: VetFrequency,
    required: false,
  })
  vetFrequency?: VetFrequency;

  @ApiProperty({
    description: 'Monthly veterinary cost',
    example: 150.0,
    required: false,
  })
  monthlyVetCost?: number;

  @ApiProperty({
    description: 'Involved with community animals',
    example: false,
    required: false,
  })
  communityAnimals?: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class FormQuestionResponseDto {
  @ApiProperty({
    description: 'Response ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Form ID this response belongs to',
    example: 'uuid-string',
  })
  form_id: string;

  @ApiProperty({
    description: 'Question ID this response answers',
    example: 'uuid-string',
  })
  question_id: string;

  @ApiProperty({
    description: 'Text response to the question',
    example: 'Sim, considero muito importante',
    required: false,
  })
  response_text?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class FormValidationResultDto {
  @ApiProperty({
    description: 'Whether the form is valid for completion',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'List of validation errors',
    example: ['Step 3 is incomplete', 'Animal information missing'],
    type: [String],
  })
  errors: string[];

  @ApiProperty({
    description: 'List of missing required fields',
    example: ['interviewerName', 'educationLevel'],
    type: [String],
  })
  missingFields: string[];

  @ApiProperty({
    description: 'Completion percentage',
    example: 85.5,
  })
  completionPercentage: number;
}
