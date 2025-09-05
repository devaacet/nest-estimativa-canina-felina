import {
  IsArray,
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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePreviousAnimalDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsEnum(AnimalSpecies)
  @ApiPropertyOptional()
  species: AnimalSpecies;

  @IsOptional()
  @IsEnum(AnimalGender)
  @ApiPropertyOptional()
  gender?: AnimalGender;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(11)
  @ApiPropertyOptional()
  ageMonths?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  @ApiPropertyOptional()
  ageYears?: number;

  @IsOptional()
  @IsEnum(CastrationStatus)
  @ApiPropertyOptional()
  castrated?: CastrationStatus;

  @IsOptional()
  @IsArray()
  @IsEnum(CastrationReason, { each: true })
  @ApiPropertyOptional()
  castrationReason?: CastrationReason[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isVaccinated?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(VaccinationReason, { each: true })
  @ApiPropertyOptional()
  vaccinationReason?: VaccinationReason[];

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  @ApiPropertyOptional()
  acquisitionMethod?: AcquisitionMethod;

  @IsEnum(AnimalDestiny)
  @ApiPropertyOptional()
  destiny: AnimalDestiny;

  // Metadata
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  registrationOrder?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  cardMinimized?: boolean;
}
