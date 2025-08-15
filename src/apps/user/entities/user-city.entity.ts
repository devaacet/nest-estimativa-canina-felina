import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_cities')
@Unique(['user_id', 'city_id'])
export class UserCity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  city_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.user_cities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne('City', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city: any;
}
