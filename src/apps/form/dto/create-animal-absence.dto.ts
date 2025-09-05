import { IsArray, IsEnum, IsOptional } from 'class-validator';
import {
  CastrationDecision,
  CastrationReason,
  HypotheticalAcquisition,
  NoAnimalsReason,
} from '../../../shared/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnimalAbsenceDto {
  @IsOptional()
  @IsEnum(HypotheticalAcquisition)
  @ApiPropertyOptional()
  hypotheticalAcquisition?: HypotheticalAcquisition;

  @IsOptional()
  @IsEnum(CastrationDecision)
  @ApiPropertyOptional()
  castrationDecision?: CastrationDecision;

  @IsOptional()
  @IsArray()
  @IsEnum(CastrationReason, { each: true })
  @ApiPropertyOptional()
  castrationReason?: CastrationReason[];

  @IsOptional()
  @IsArray()
  @IsEnum(NoAnimalsReason, { each: true })
  @ApiPropertyOptional()
  noAnimalsReasons?: NoAnimalsReason[];
}
