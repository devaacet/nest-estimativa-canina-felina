import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import {
  CastrationDecision,
  CastrationReason,
  HypotheticalAcquisition,
  NoAnimalsReason,
} from '../../../shared/enums';

export class CreateAnimalAbsenceDto {
  @IsOptional()
  @IsEnum(HypotheticalAcquisition)
  hypotheticalAcquisition?: HypotheticalAcquisition;

  @IsOptional()
  @IsBoolean()
  wouldCastrate?: boolean;

  @IsOptional()
  @IsEnum(CastrationDecision)
  castrationDecision?: CastrationDecision;

  @IsOptional()
  @IsEnum(CastrationReason)
  castrationReason?: CastrationReason;

  @IsOptional()
  @IsArray()
  @IsEnum(NoAnimalsReason, { each: true })
  noAnimalsReasons?: NoAnimalsReason[];
}
