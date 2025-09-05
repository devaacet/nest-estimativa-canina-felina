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
  AcquisitionTime,
  AnimalBreed,
  AnimalGender,
  AnimalHousing,
  AnimalSpecies,
  CastrationReason,
  CastrationStatus,
  VaccinationReason,
} from '../../../shared/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCurrentAnimalDto {
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
  castrationStatus?: CastrationStatus;

  @IsOptional()
  @IsArray()
  @IsEnum(CastrationReason, { each: true })
  @ApiPropertyOptional()
  castrationReason?: CastrationReason[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  interestedCastration?: boolean;

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
  @IsBoolean()
  @ApiPropertyOptional()
  streetAccessUnaccompanied?: boolean;

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  @ApiPropertyOptional()
  acquisitionMethod?: AcquisitionMethod;

  @IsOptional()
  @IsEnum(AcquisitionTime)
  @ApiPropertyOptional()
  acquisitionTime?: AcquisitionTime;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  acquisitionState?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  acquisitionCity?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(AnimalHousing, { each: true })
  @ApiPropertyOptional()
  housingMethods?: AnimalHousing[];

  @IsOptional()
  @IsEnum(AnimalBreed)
  @ApiPropertyOptional()
  animalBreed?: AnimalBreed;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  hasMicrochip?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  interestedMicrochip?: boolean;

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
