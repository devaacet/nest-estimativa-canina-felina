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
  AnimalGender,
  AnimalSpecies,
  CastrationReason,
  CastrationStatus,
  VaccinationReason,
} from '../../../shared/enums';
import { Form } from './form.entity';

@Entity('form_previous_animals')
@Unique(['formId', 'registrationOrder'])
export class PreviousAnimalForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'form_id', type: 'uuid' })
  formId: string;

  @Column({ name: 'animal_name', type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({
    name: 'animal_species',
    type: 'enum',
    enum: AnimalSpecies,
  })
  species: AnimalSpecies;

  @Column({
    name: 'animal_gender',
    type: 'enum',
    enum: AnimalGender,
    nullable: true,
  })
  gender: AnimalGender;

  @Column({ name: 'age_months', type: 'integer', nullable: true })
  ageMonths: number;

  @Column({ name: 'age_years', type: 'integer', nullable: true })
  ageYears: number;

  @Column({
    name: 'castration_status',
    type: 'enum',
    enum: CastrationStatus,
    default: CastrationStatus.NO,
  })
  castrated: CastrationStatus;

  @Column({
    name: 'castration_reason',
    type: 'enum',
    enum: CastrationReason,
    nullable: true,
  })
  castrationReason: CastrationReason;

  @Column({ name: 'is_vaccinated', type: 'boolean', default: false })
  isVaccinated: boolean;

  @Column({
    name: 'vaccination_reason',
    type: 'enum',
    enum: VaccinationReason,
    nullable: true,
  })
  vaccinationReason: VaccinationReason;

  @Column({
    name: 'acquisition_method',
    type: 'enum',
    enum: AcquisitionMethod,
    nullable: true,
  })
  acquisitionMethod: AcquisitionMethod;

  @Column({
    name: 'animal_destiny',
    type: 'enum',
    enum: AnimalDestiny,
  })
  destiny: AnimalDestiny;

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
  @ManyToOne(() => Form, (form) => form.previousAnimals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
