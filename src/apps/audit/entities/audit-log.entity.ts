import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditAction } from '../../../shared/enums';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'varchar', length: 255 })
  table_name: string;

  @Column({ type: 'uuid', nullable: true })
  record_id: string;

  @Column({ type: 'jsonb', nullable: true })
  old_data: any;

  @Column({ type: 'jsonb', nullable: true })
  new_data: any;

  @Column({ type: 'inet', nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  session_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;

  // Relationships
  @ManyToOne('User', {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: any;
}
