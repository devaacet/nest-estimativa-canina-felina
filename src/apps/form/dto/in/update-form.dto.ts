import { PartialType } from '@nestjs/mapped-types';
import { CreateFormDto } from './create-form.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { FormStatus } from '../../../../shared/enums';

export class UpdateFormDto extends PartialType(CreateFormDto) {
  @IsOptional()
  @IsEnum(FormStatus)
  status?: FormStatus;

  @IsOptional()
  householdData?: any;

  @IsOptional()
  stepCompletionStatus?: any;

  @IsOptional()
  uiState?: any;
}
