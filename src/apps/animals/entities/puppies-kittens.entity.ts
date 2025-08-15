import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  AcquisitionMethod,
  AnimalDestiny,
  VaccinationReason,
} from '../../../shared/enums';
import { Form } from '../../form/entities/form.entity';

@Entity('form_puppies_kittens')
@Unique(['form_id', 'registration_order'])
export class PuppiesKittens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  form_id: string;

  @Column({ type: 'boolean', default: false })
  had_puppies_last_12_months: boolean;

  @Column({ type: 'integer', default: 0 })
  puppy_count: number;

  @Column({ type: 'boolean', nullable: true })
  puppies_vaccinated: boolean;

  @Column({
    type: 'enum',
    enum: VaccinationReason,
    nullable: true,
  })
  vaccination_reason: VaccinationReason;

  @Column({
    type: 'enum',
    enum: AcquisitionMethod,
    nullable: true,
  })
  puppies_origin: AcquisitionMethod;

  @Column({
    type: 'enum',
    enum: AnimalDestiny,
    nullable: true,
  })
  puppies_destiny: AnimalDestiny;

  // Metadata
  @Column({ type: 'integer' })
  registration_order: number;

  @Column({ type: 'boolean', default: false })
  card_minimized: boolean;

  @Column({ type: 'jsonb', nullable: true })
  additional_data: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Form, (form) => form.puppiesKittens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
