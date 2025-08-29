import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { City } from '../../city/entities/city.entity';
import { CurrentAnimal } from '../../animals/entities/current-animal.entity';
import { PreviousAnimal } from '../../animals/entities/previous-animal.entity';
import { PuppiesKittens } from '../../animals/entities/puppies-kittens.entity';
import { AnimalAbsence } from '../../animals/entities/animal-absence.entity';
import { FormQuestionResponse } from './form-question-response.entity';
import {
  EducationLevel,
  FormStatus,
  FormType,
  HousingType,
  IncomeRange,
  InterviewStatus,
  ResidenceType,
  VetFrequency,
} from '../../../shared/enums';

@Entity('forms')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'form_date', type: 'date' })
  formDate: Date;

  @Column({
    name: 'form_type',
    type: 'enum',
    enum: FormType,
    default: FormType.FIRST_FORM,
  })
  formType: FormType;

  @Column({
    type: 'enum',
    enum: FormStatus,
    default: FormStatus.DRAFT,
  })
  status: FormStatus;

  @Column({ name: 'current_step', default: 1 })
  currentStep: number;

  // Step 1: Initial Information
  @Column({ name: 'interviewer_name' })
  interviewerName: string;

  @Column({
    name: 'interview_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  interviewDate: string;

  @Column({ name: 'census_sector_code' })
  censusSectorCode: string;

  @Column({
    name: 'interview_status',
    type: 'enum',
    enum: InterviewStatus,
    default: InterviewStatus.ATTENDED,
  })
  interviewStatus: InterviewStatus;

  @Column({ name: 'address_street' })
  addressStreet: string;

  @Column({ name: 'address_number' })
  addressNumber: string;

  @Column({ name: 'address_complement', nullable: true })
  addressComplement?: string;

  @Column({
    name: 'residence_type',
    type: 'enum',
    enum: ResidenceType,
    default: ResidenceType.HOUSE,
  })
  residenceType: ResidenceType;

  // Step 2: Socioeconomic Information
  @Column({
    name: 'education_level',
    type: 'enum',
    enum: EducationLevel,
    nullable: true,
  })
  educationLevel?: EducationLevel;

  @Column({ name: 'children_count', default: 0 })
  childrenCount: number;

  @Column({ name: 'teens_count', default: 0 })
  teensCount: number;

  @Column({ name: 'adults_count', default: 0 })
  adultsCount: number;

  @Column({ name: 'elderly_count', default: 0 })
  elderlyCount: number;

  @Column({
    name: 'housing_type',
    type: 'enum',
    enum: HousingType,
    nullable: true,
  })
  housingType?: HousingType;

  @Column({
    name: 'monthly_income',
    type: 'enum',
    enum: IncomeRange,
    nullable: true,
  })
  monthlyIncome?: IncomeRange;

  // Step 3: Animal Information
  @Column({ name: 'has_dogs_cats', nullable: true })
  hasDogsCats?: boolean;

  @Column({ name: 'general_animal_destiny', nullable: true })
  generalAnimalDestiny?: string;

  @Column({ name: 'stray_animals_neighborhood', nullable: true })
  strayAnimalsNeighborhood?: boolean;

  @Column({ name: 'stray_animals_count', default: 0 })
  strayAnimalsCount: number;

  @Column({ name: 'stray_animals_species', nullable: true })
  strayAnimalsSpecies?: string;

  @Column({ name: 'stray_animals_condition', nullable: true })
  strayAnimalsCondition?: string;

  @Column({ name: 'cares_street_animals', nullable: true })
  caresStreetAnimals?: boolean;

  @Column({ name: 'care_types', nullable: true })
  careTypes?: string; // JSON array

  @Column({
    name: 'vet_frequency',
    type: 'enum',
    enum: VetFrequency,
    nullable: true,
  })
  vetFrequency?: VetFrequency;

  @Column({
    name: 'monthly_vet_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  monthlyVetCost?: number;

  @Column({ name: 'community_animals', nullable: true })
  communityAnimals?: boolean;

  // Additional metadata
  @Column({ name: 'household_data', type: 'jsonb', nullable: true })
  householdData?: any;

  @Column({ name: 'step_completion_status', type: 'jsonb', nullable: true })
  stepCompletionStatus?: any;

  @Column({ name: 'ui_state', type: 'jsonb', nullable: true })
  uiState?: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'submitted_at', nullable: true })
  submittedAt?: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.forms)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => CurrentAnimal, (animal) => animal.form)
  currentAnimals: CurrentAnimal[];

  @OneToMany(() => PreviousAnimal, (animal) => animal.form)
  previousAnimals: PreviousAnimal[];

  @OneToMany(() => PuppiesKittens, (puppies) => puppies.form)
  puppiesKittens: PuppiesKittens[];

  @OneToMany(() => AnimalAbsence, (absence) => absence.form)
  animalAbsence: AnimalAbsence[];

  @OneToMany(() => FormQuestionResponse, (response) => response.form)
  questionResponses: FormQuestionResponse[];
}
