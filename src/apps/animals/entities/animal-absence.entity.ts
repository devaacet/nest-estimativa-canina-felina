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
  CastrationReason,
  HypotheticalAcquisition,
} from '../../../shared/enums';
import { Form } from '../../form/entities/form.entity';

@Entity('form_animal_absence')
@Unique(['form_id'])
export class AnimalAbsence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  form_id: string;

  @Column({
    type: 'enum',
    enum: HypotheticalAcquisition,
    nullable: true,
  })
  hypothetical_acquisition: HypotheticalAcquisition;

  @Column({ type: 'boolean', nullable: true })
  would_castrate: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  castration_decision: string; // 'yes', 'no', 'dont_know'

  @Column({
    type: 'enum',
    enum: CastrationReason,
    nullable: true,
  })
  castration_reason: CastrationReason;

  @Column({ type: 'varchar', length: 300, nullable: true })
  no_animals_reasons: string; // JSON array, can be multiple

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Form, (form) => form.animalAbsence, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
