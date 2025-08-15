import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from '../../../../shared/enums';

export class AuditLogResponseDto {
  @ApiProperty({
    description: 'Audit log ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who performed the action',
    example: 'uuid-string',
  })
  user_id: string;

  @ApiProperty({
    description: 'Action performed',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  action: AuditAction;

  @ApiProperty({
    description: 'Table name affected',
    example: 'users',
  })
  table_name: string;

  @ApiProperty({
    description: 'Record ID affected',
    example: 'uuid-string',
  })
  record_id: string;

  @ApiProperty({
    description: 'Old values before the change',
    example: { name: 'John', email: 'john@old.com' },
    required: false,
  })
  old_values?: Record<string, any>;

  @ApiProperty({
    description: 'New values after the change',
    example: { name: 'John Doe', email: 'john@new.com' },
    required: false,
  })
  new_values?: Record<string, any>;

  @ApiProperty({
    description: 'IP address of the user',
    example: '192.168.1.1',
    required: false,
  })
  ip_address?: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0...',
    required: false,
  })
  user_agent?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { source: 'web', sessionId: 'abc123' },
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Timestamp when the action occurred',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;
}

export class ExportRequestResponseDto {
  @ApiProperty({
    description: 'Export request ID',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who requested the export',
    example: 'uuid-string',
  })
  user_id: string;

  @ApiProperty({
    description: 'Type of export',
    example: 'forms',
  })
  export_type: string;

  @ApiProperty({
    description: 'Export format',
    example: 'csv',
  })
  format: string;

  @ApiProperty({
    description: 'Export description or title',
    example: 'Formulários de pesquisa - Janeiro 2024',
  })
  description: string;

  @ApiProperty({
    description: 'Current status of the export',
    example: 'completed',
  })
  status: string;

  @ApiProperty({
    description: 'Filters and parameters used for the export',
    example: {
      dateRange: { start: '2024-01-01', end: '2024-01-31' },
      cityId: 'uuid-string',
    },
    required: false,
  })
  parameters?: Record<string, any>;

  @ApiProperty({
    description: 'File path of the generated export',
    example: '/exports/forms_2024-01-01_to_2024-01-31.csv',
    required: false,
  })
  file_path?: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    required: false,
  })
  file_size?: number;

  @ApiProperty({
    description: 'Error message if export failed',
    example: null,
    required: false,
  })
  error_message?: string;

  @ApiProperty({
    description: 'When the export was downloaded',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  downloaded_at?: Date;

  @ApiProperty({
    description: 'Additional metadata',
    example: { recordsExported: 500, requestedBy: 'Research Team' },
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Timestamp when the request was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
