import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './forms.service';
import { Form } from './entities/form.entity';
import { FormQuestionResponse } from './entities/form-question-response.entity';
import { CurrentAnimalForm } from './entities/current-animal-form.entity';
import { PreviousAnimalForm } from './entities/previous-animal-form.entity';
import { PuppiesKittensForm } from './entities/puppies-kittens-form.entity';
import { AnimalAbsenceForm } from './entities/animal-absence-form.entity';
import { FormRepository } from './repositories/form.repository';
import { FormQuestionResponseRepository } from './repositories/form-question-response.repository';
import { ExcelExportService } from './services/excel-export.service';
import { CityModule } from '../city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Form,
      FormQuestionResponse,
      CurrentAnimalForm,
      PreviousAnimalForm,
      PuppiesKittensForm,
      AnimalAbsenceForm,
    ]),
    CityModule,
  ],
  controllers: [FormController],
  providers: [
    FormService,
    FormRepository,
    FormQuestionResponseRepository,
    ExcelExportService,
  ],
  exports: [FormService, FormRepository, FormQuestionResponseRepository],
})
export class FormModule {}
