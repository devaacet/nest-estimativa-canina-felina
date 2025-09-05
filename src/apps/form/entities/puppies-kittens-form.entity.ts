import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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
@Unique(['formId'])
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
  puppiesVaccinated?: boolean;

  @Column({
    name: 'vaccination_reason',
    type: 'text',
    array: true,
    nullable: true,
  })
  vaccinationReason?: VaccinationReason[];

  @Column({
    name: 'puppies_origin',
    type: 'enum',
    enum: AcquisitionMethod,
    nullable: true,
  })
  puppiesOrigin?: AcquisitionMethod;

  @Column({
    name: 'puppies_destiny',
    type: 'enum',
    enum: AnimalDestiny,
    nullable: true,
  })
  puppiesDestiny?: AnimalDestiny;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Form, (form) => form.puppiesKittens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
