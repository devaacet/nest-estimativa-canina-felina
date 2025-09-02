import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import {
  AcquisitionMethod,
  AnimalDestiny,
  VaccinationReason,
} from '../../../shared/enums';

export class CreatePuppiesKittensDto {
  @IsOptional()
  @IsBoolean()
  hadPuppiesLast12Months?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  puppyCount?: number;

  @IsOptional()
  @IsBoolean()
  puppiesVaccinated?: boolean;

  @IsOptional()
  @IsEnum(VaccinationReason)
  vaccinationReason?: VaccinationReason;

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  puppiesOrigin?: AcquisitionMethod;

  @IsOptional()
  @IsEnum(AnimalDestiny)
  puppiesDestiny?: AnimalDestiny;

  // Metadata
  @IsOptional()
  @IsInt()
  registrationOrder?: number;

  @IsOptional()
  @IsBoolean()
  cardMinimized?: boolean;
}
