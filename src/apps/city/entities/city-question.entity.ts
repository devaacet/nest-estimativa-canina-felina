import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { City } from './city.entity';

@Entity('city_questions')
@Unique(['city_id', 'question_order'])
export class CityQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  city_id: string;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'integer' })
  question_order: number;

  @Column({ type: 'boolean', default: false })
  required: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Relationships
  @ManyToOne(() => City, (city) => city.city_questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city: City;
}
