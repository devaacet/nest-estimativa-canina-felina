import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('city_questions')
export class CityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'question_text' })
  questionText: string;

  @Column({ type: 'integer', name: 'question_order' })
  questionOrder: number;

  @Column({ default: false })
  required: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => City, (city) => city.cityQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city: City;
}
