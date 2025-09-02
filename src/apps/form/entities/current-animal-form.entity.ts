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
  AnimalHousing,
  AnimalSpecies,
  CastrationReason,
  CastrationStatus,
  VaccinationReason,
} from '../../../shared/enums';
import { Form } from './form.entity';

@Entity('form_current_animals')
@Unique(['formId', 'registrationOrder'])
export class CurrentAnimalForm {
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
  castrationStatus: CastrationStatus;

  @Column({
    name: 'castration_reason',
    type: 'enum',
    enum: CastrationReason,
    nullable: true,
  })
  castrationReason: CastrationReason;

  @Column({ name: 'interested_castration', type: 'boolean', nullable: true })
  interestedCastration: boolean;

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
    name: 'street_access_unaccompanied',
    type: 'boolean',
    default: false,
  })
  streetAccessUnaccompanied: boolean;

  @Column({
    name: 'acquisition_method',
    type: 'enum',
    enum: AcquisitionMethod,
    nullable: true,
  })
  acquisitionMethod: AcquisitionMethod;

  @Column({
    name: 'acquisition_time',
    type: 'enum',
    enum: AcquisitionTime,
    nullable: true,
  })
  acquisitionTime: AcquisitionTime;

  @Column({
    name: 'acquisition_state',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  acquisitionState: string;

  @Column({
    name: 'acquisition_city',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  acquisitionCity: string;

  @Column({
    name: 'housing_methods',
    type: 'text',
    array: true,
    nullable: true,
  })
  housingMethods: AnimalHousing[]; // Array of housing methods

  @Column({
    name: 'animal_breed',
    type: 'enum',
    enum: AnimalBreed,
    nullable: true,
  })
  animalBreed: AnimalBreed;

  @Column({ name: 'has_microchip', type: 'boolean', default: false })
  hasMicrochip: boolean;

  @Column({ name: 'interested_microchip', type: 'boolean', nullable: true })
  interestedMicrochip: boolean;

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
  @ManyToOne(() => Form, (form) => form.currentAnimals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
