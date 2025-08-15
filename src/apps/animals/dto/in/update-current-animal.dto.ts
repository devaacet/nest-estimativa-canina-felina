import { PartialType } from '@nestjs/swagger';
import { CreateCurrentAnimalDto } from './create-current-animal.dto';

export class UpdateCurrentAnimalDto extends PartialType(
  CreateCurrentAnimalDto,
) {}
