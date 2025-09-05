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
  CastrationDecision,
  CastrationReason,
  HypotheticalAcquisition,
  NoAnimalsReason,
} from '../../../shared/enums';
import { Form } from './form.entity';

@Entity('form_animal_absence')
@Unique(['formId'])
export class AnimalAbsenceForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'form_id', type: 'uuid' })
  formId: string;

  @Column({
    name: 'hypothetical_acquisition',
    type: 'enum',
    enum: HypotheticalAcquisition,
    nullable: true,
  })
  hypotheticalAcquisition?: HypotheticalAcquisition;

  @Column({
    name: 'castration_decision',
    type: 'enum',
    enum: CastrationDecision,
    nullable: true,
  })
  castrationDecision?: CastrationDecision;

  @Column({
    name: 'no_castration_reason',
    type: 'text',
    array: true,
    nullable: true,
  })
  castrationReason?: CastrationReason[];

  @Column({
    name: 'no_animals_reasons',
    type: 'text',
    array: true,
    nullable: true,
  })
  noAnimalsReasons?: NoAnimalsReason[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Form, (form) => form.animalAbsence, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: Form;
}
