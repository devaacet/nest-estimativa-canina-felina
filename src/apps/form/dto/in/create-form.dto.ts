import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EducationLevel,
  FormType,
  HousingType,
  IncomeRange,
  InterviewStatus,
  ResidenceType,
  VetFrequency,
} from '../../../../shared/enums';

export class CreateFormDto {
  @ApiProperty({
    description: 'User ID who is filling the form',
    example: 'uuid-string',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'City ID where the form is being conducted',
    example: 'uuid-string',
  })
  @IsUUID()
  cityId: string;

  @ApiProperty({
    description: 'Date when the form was filled',
    example: '2024-01-01',
  })
  @IsDateString()
  formDate: string;

  @ApiProperty({
    description: 'Type of form',
    enum: FormType,
    required: false,
  })
  @IsOptional()
  @IsEnum(FormType)
  formType?: FormType;

  // Step 1: Initial Information
  @ApiProperty({
    description: 'Name of the interviewer',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  interviewerName?: string;

  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @IsOptional()
  @IsString()
  censusSectorCode?: string;

  @IsOptional()
  @IsEnum(InterviewStatus)
  interviewStatus?: InterviewStatus;

  @IsOptional()
  @IsString()
  addressStreet?: string;

  @IsOptional()
  @IsString()
  addressNumber?: string;

  @IsOptional()
  @IsString()
  addressComplement?: string;

  @IsOptional()
  @IsEnum(ResidenceType)
  residenceType?: ResidenceType;

  // Step 2: Socioeconomic Information
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  childrenCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  teensCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  adultsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  elderlyCount?: number;

  @IsOptional()
  @IsEnum(HousingType)
  housingType?: HousingType;

  @IsOptional()
  @IsEnum(IncomeRange)
  monthlyIncome?: IncomeRange;

  // Step 3: Animal Information
  @IsOptional()
  @IsBoolean()
  hasDogsCats?: boolean;

  @IsOptional()
  @IsString()
  generalAnimalDestiny?: string;

  @IsOptional()
  @IsBoolean()
  strayAnimalsNeighborhood?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  strayAnimalsCount?: number;

  @IsOptional()
  @IsString()
  strayAnimalsSpecies?: string;

  @IsOptional()
  @IsString()
  strayAnimalsCondition?: string;

  @IsOptional()
  @IsBoolean()
  caresStreetAnimals?: boolean;

  @IsOptional()
  @IsString()
  careTypes?: string;

  @IsOptional()
  @IsEnum(VetFrequency)
  vetFrequency?: VetFrequency;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyVetCost?: number;

  @IsOptional()
  @IsBoolean()
  communityAnimals?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  currentStep?: number;
}
