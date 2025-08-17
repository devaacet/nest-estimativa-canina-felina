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
import { User } from 'src/apps/user/entities/user.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => CityQuestion, (cityQuestion) => cityQuestion.city)
  cityQuestions: CityQuestion[];

  @ManyToMany(() => User, (user) => user.cities)
  users: User[];
}
