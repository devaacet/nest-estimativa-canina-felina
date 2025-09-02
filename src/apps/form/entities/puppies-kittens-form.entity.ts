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
import { Form } from './form.entity';

@Entity('form_puppies_kittens')
@Unique(['formId', 'registrationOrder'])
export class PuppiesKittensForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'form_id', type: 'uuid' })
  formId: string;

  @Column({
    name: 'had_puppies_last_12_months',
    type: 'boolean',
    default: false,
  })
  hadPuppiesLast12Months: boolean;

  @Column({ name: 'puppy_count', type: 'integer', default: 0 })
  puppyCount: number;

  @Column({ name: 'puppies_vaccinated', type: 'boolean', nullable: true })
  puppiesVaccinated: boolean;

  @Column({
    name: 'vaccination_reason',
    type: 'enum',
    enum: VaccinationReason,
    nullable: true,
  })
  vaccinationReason: VaccinationReason;

  @Column({
    name: 'puppies_origin',
    type: 'enum',
    enum: AcquisitionMethod,
    nullable: true,
  })
  puppiesOrigin: AcquisitionMethod;

  @Column({
    name: 'puppies_destiny',
    type: 'enum',
    enum: AnimalDestiny,
    nullable: true,
  })
  puppiesDestiny: AnimalDestiny;

  // Metadata
  @Column({ name: 'registration_order', type: 'integer' })
  registrationOrder: number;

  @Column({ name: 'card_minimized', type: 'boolean', default: false })
  cardMinimized: boolean;

  @Column({ name: 'additional_data', type: 'jsonb', nullable: true })
  additionalData: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Form, (form) => form.puppiesKittens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
