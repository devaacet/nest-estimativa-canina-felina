import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './forms.service';
import { Form } from './entities/form.entity';
import { FormQuestionResponse } from './entities/form-question-response.entity';
import { FormRepository } from './repositories/form.repository';
import { FormQuestionResponseRepository } from './repositories/form-question-response.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormQuestionResponse])],
  controllers: [FormController],
  providers: [FormService, FormRepository, FormQuestionResponseRepository],
  exports: [FormService, FormRepository, FormQuestionResponseRepository],
})
export class FormModule {}
