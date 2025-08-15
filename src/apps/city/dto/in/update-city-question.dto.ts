import { PartialType } from '@nestjs/swagger';
import { CreateCityQuestionDto } from './create-city-question.dto';

export class UpdateCityQuestionDto extends PartialType(CreateCityQuestionDto) {}
