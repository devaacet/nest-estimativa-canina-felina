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

export class CreateCurrentAnimalDto {
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
  castrationStatus?: CastrationStatus;

  @IsOptional()
  @IsEnum(CastrationReason)
  castrationReason?: CastrationReason;

  @IsOptional()
  @IsBoolean()
  interestedCastration?: boolean;

  @IsOptional()
  @IsBoolean()
  isVaccinated?: boolean;

  @IsOptional()
  @IsEnum(VaccinationReason)
  vaccinationReason?: VaccinationReason;

  @IsOptional()
  @IsBoolean()
  streetAccessUnaccompanied?: boolean;

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  acquisitionMethod?: AcquisitionMethod;

  @IsOptional()
  @IsEnum(AcquisitionTime)
  acquisitionTime?: AcquisitionTime;

  @IsOptional()
  @IsString()
  acquisitionState?: string;

  @IsOptional()
  @IsString()
  acquisitionCity?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(AnimalHousing, { each: true })
  housingMethods?: AnimalHousing[];

  @IsOptional()
  @IsEnum(AnimalBreed)
  animalBreed?: AnimalBreed;

  @IsOptional()
  @IsBoolean()
  hasMicrochip?: boolean;

  @IsOptional()
  @IsBoolean()
  interestedMicrochip?: boolean;

  // Metadata
  @IsOptional()
  @IsInt()
  registrationOrder?: number;

  @IsOptional()
  @IsBoolean()
  cardMinimized?: boolean;
}
