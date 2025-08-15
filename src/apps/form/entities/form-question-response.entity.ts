import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Form } from './form.entity';
import { CityQuestion } from '../../city/entities/city-question.entity';

@Entity('form_question_responses')
export class FormQuestionResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'form_id' })
  formId: string;

  @Column({ name: 'question_id' })
  questionId: string;

  @Column({ name: 'response_text', type: 'text', nullable: true })
  responseText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Form, (form) => form.questionResponses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;

  @ManyToOne(() => CityQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: CityQuestion;
}
