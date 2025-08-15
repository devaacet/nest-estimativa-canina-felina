import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CityQuestion } from './city-question.entity';

@Entity('cities')
@Unique(['name', 'year'])
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @OneToMany(() => CityQuestion, (cityQuestion) => cityQuestion.city)
  city_questions: CityQuestion[];

  @OneToMany('UserCity', 'city')
  user_cities: any[];

  @ManyToMany('User')
  users: any[];
}
