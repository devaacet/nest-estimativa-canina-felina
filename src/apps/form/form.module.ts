import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './forms.service';
import { Form } from './entities/form.entity';
import { FormQuestionResponse } from './entities/form-question-response.entity';
import { FormRepository } from './repositories/form.repository';
import { FormQuestionResponseRepository } from './repositories/form-question-response.repository';
import { ExcelExportService } from './services/excel-export.service';
import { CityModule } from '../city/city.module';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormQuestionResponse]), CityModule],
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
