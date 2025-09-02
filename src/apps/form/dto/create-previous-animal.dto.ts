import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  AcquisitionMethod,
  AnimalDestiny,
  AnimalGender,
  AnimalSpecies,
  CastrationReason,
  CastrationStatus,
  VaccinationReason,
} from '../../../shared/enums';

export class CreatePreviousAnimalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(AnimalSpecies)
  species: AnimalSpecies;

  @IsOptional()
  @IsEnum(AnimalGender)
  gender?: AnimalGender;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(11)
  ageMonths?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  ageYears?: number;

  @IsOptional()
  @IsEnum(CastrationStatus)
  castrated?: CastrationStatus;

  @IsOptional()
  @IsEnum(CastrationReason)
  castrationReason?: CastrationReason;

  @IsOptional()
  @IsBoolean()
  isVaccinated?: boolean;

  @IsOptional()
  @IsEnum(VaccinationReason)
  vaccinationReason?: VaccinationReason;

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  acquisitionMethod?: AcquisitionMethod;

  @IsEnum(AnimalDestiny)
  destiny: AnimalDestiny;

  // Metadata
  @IsOptional()
  @IsInt()
  registrationOrder?: number;

  @IsOptional()
  @IsBoolean()
  cardMinimized?: boolean;
}
