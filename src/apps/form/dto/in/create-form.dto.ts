import {
  IsArray,
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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  AnimalCondition,
  AnimalDestiny,
  AnimalSpecies,
  CareType,
  EducationLevel,
  FormStatus,
  HousingType,
  IncomeRange,
  InterviewStatus,
  ResidenceType,
  VetFrequency,
} from '../../../../shared/enums';
import { CreateCurrentAnimalDto } from '../create-current-animal.dto';
import { CreatePreviousAnimalDto } from '../create-previous-animal.dto';
import { CreatePuppiesKittensDto } from '../create-puppies-kittens.dto';
import { CreateAnimalAbsenceDto } from '../create-animal-absence.dto';

export class CreateFormDto {
  @ApiProperty({
    description: 'Optional form ID for update operations',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

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
    description: 'Status of the form',
    enum: FormStatus,
    example: FormStatus.DRAFT,
  })
  @IsEnum(FormStatus)
  @IsOptional()
  status?: FormStatus;

  // Step 1: Initial Information
  @ApiProperty({
    description: 'Name of the interviewer',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  interviewerName?: string;

  @IsDateString()
  interviewDate: string;

  @IsString()
  censusSectorCode: string;

  @IsEnum(InterviewStatus)
  interviewStatus: InterviewStatus;

  @IsString()
  addressStreet: string;

  @IsOptional()
  @IsString()
  addressNumber?: string;

  @IsOptional()
  @IsString()
  addressComplement?: string;

  @IsEnum(ResidenceType)
  residenceType: ResidenceType;

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
  @IsEnum(AnimalDestiny)
  generalAnimalDestiny?: AnimalDestiny;

  @IsOptional()
  @IsBoolean()
  strayAnimalsNeighborhood?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  strayAnimalsCount?: number;

  @IsOptional()
  @IsEnum(AnimalSpecies)
  strayAnimalsSpecies?: AnimalSpecies;

  @IsOptional()
  @IsEnum(AnimalCondition)
  strayAnimalsCondition?: AnimalCondition;

  @IsOptional()
  @IsBoolean()
  caresStreetAnimals?: boolean;

  @IsOptional()
  @IsEnum(CareType)
  @IsArray()
  careTypes?: CareType[];

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

  // Step 4: Current Animals
  @ApiProperty({
    description: 'Array of current animals in the household',
    type: [CreateCurrentAnimalDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCurrentAnimalDto)
  currentAnimals?: CreateCurrentAnimalDto[];

  // Step 5: Previous Animals
  @ApiProperty({
    description: 'Array of previous animals that the household had',
    type: [CreatePreviousAnimalDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreviousAnimalDto)
  previousAnimals?: CreatePreviousAnimalDto[];

  // Step 6: Puppies and Kittens
  @ApiProperty({
    description: 'Array of puppies/kittens information',
    type: [CreatePuppiesKittensDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePuppiesKittensDto)
  puppiesKittens?: CreatePuppiesKittensDto[];

  // Step 7: Animal Absence
  @ApiProperty({
    description: 'Array of animal absence information',
    type: [CreateAnimalAbsenceDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnimalAbsenceDto)
  animalAbsence?: CreateAnimalAbsenceDto[];
}
