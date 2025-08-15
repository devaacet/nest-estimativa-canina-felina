import { PartialType } from '@nestjs/swagger';
import { CreateExportRequestDto } from './create-export-request.dto';

export class UpdateExportRequestDto extends PartialType(
  CreateExportRequestDto,
) {}
