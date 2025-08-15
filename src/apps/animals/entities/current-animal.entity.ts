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
  AcquisitionTime,
  AnimalBreed,
  AnimalGender,
  AnimalSpecies,
  CastrationReason,
  CastrationStatus,
  VaccinationReason,
} from '../../../shared/enums';
import { Form } from '../../form/entities/form.entity';

@Entity('form_current_animals')
@Unique(['form_id', 'registration_order'])
export class CurrentAnimal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  form_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  animal_name: string;

  @Column({
    type: 'enum',
    enum: AnimalSpecies,
  })
  animal_species: AnimalSpecies;

  @Column({
    type: 'enum',
    enum: AnimalGender,
    nullable: true,
  })
  animal_gender: AnimalGender;

  @Column({ type: 'integer', nullable: true })
  age_months: number;

  @Column({ type: 'integer', nullable: true })
  age_years: number;

  @Column({
    type: 'enum',
    enum: CastrationStatus,
    default: CastrationStatus.NO,
  })
  castration_status: CastrationStatus;

  @Column({
    type: 'enum',
    enum: CastrationReason,
    nullable: true,
  })
  castration_reason: CastrationReason;

  @Column({ type: 'boolean', nullable: true })
  interested_castration: boolean;

  @Column({ type: 'boolean', default: false })
  is_vaccinated: boolean;

  @Column({
    type: 'enum',
    enum: VaccinationReason,
    nullable: true,
  })
  vaccination_reason: VaccinationReason;

  @Column({ type: 'boolean', default: false })
  street_access_unaccompanied: boolean;

  @Column({
    type: 'enum',
    enum: AcquisitionMethod,
    nullable: true,
  })
  acquisition_method: AcquisitionMethod;

  @Column({
    type: 'enum',
    enum: AcquisitionTime,
    nullable: true,
  })
  acquisition_time: AcquisitionTime;

  @Column({ type: 'varchar', length: 100, nullable: true })
  acquisition_state: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  acquisition_city: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  housing_methods: string; // JSON array of housing methods

  @Column({
    type: 'enum',
    enum: AnimalBreed,
    nullable: true,
  })
  animal_breed: AnimalBreed;

  @Column({ type: 'boolean', default: false })
  has_microchip: boolean;

  @Column({ type: 'boolean', nullable: true })
  interested_microchip: boolean;

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
  @ManyToOne(() => Form, (form) => form.currentAnimals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
