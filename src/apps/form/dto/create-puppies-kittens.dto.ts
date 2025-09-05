import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import {
  AcquisitionMethod,
  AnimalDestiny,
  VaccinationReason,
} from '../../../shared/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePuppiesKittensDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  hadPuppiesLast12Months?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional()
  puppyCount?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  puppiesVaccinated?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(VaccinationReason, { each: true })
  @ApiPropertyOptional()
  vaccinationReason?: VaccinationReason[];

  @IsOptional()
  @IsEnum(AcquisitionMethod)
  @ApiPropertyOptional()
  puppiesOrigin?: AcquisitionMethod;

  @IsOptional()
  @IsEnum(AnimalDestiny)
  @ApiPropertyOptional()
  puppiesDestiny?: AnimalDestiny;
}
