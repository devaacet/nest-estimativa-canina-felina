import { ApiProperty } from '@nestjs/swagger';

export class AuditStatisticsDto {
  @ApiProperty({
    description: 'Total number of audit logs',
    example: 15420,
  })
  totalLogs: number;

  @ApiProperty({
    description: 'Logs by action type',
    example: {
      CREATE: 5200,
      UPDATE: 7800,
      DELETE: 1200,
      LOGIN: 1220,
    },
  })
  logsByAction: Record<string, number>;

  @ApiProperty({
    description: 'Logs by table name',
    example: {
      users: 2100,
      forms: 8900,
      animals: 3200,
      cities: 420,
      audit_logs: 800,
    },
  })
  logsByTable: Record<string, number>;

  @ApiProperty({
    description: 'Most active users',
    example: [
      { userId: 'uuid-1', count: 450, userName: 'João Silva' },
      { userId: 'uuid-2', count: 320, userName: 'Maria Santos' },
    ],
  })
  mostActiveUsers: Array<{
    userId: string;
    count: number;
    userName?: string;
  }>;

  @ApiProperty({
    description: 'Activity by day of week',
    example: {
      monday: 2200,
      tuesday: 2100,
      wednesday: 2300,
      thursday: 2000,
      friday: 2100,
      saturday: 800,
      sunday: 920,
    },
  })
  activityByDayOfWeek: Record<string, number>;

  @ApiProperty({
    description: 'Activity by hour of day',
    example: { '9': 800, '10': 950, '11': 1200, '14': 900, '15': 1100 },
  })
  activityByHour: Record<string, number>;
}

export class ExportStatisticsDto {
  @ApiProperty({
    description: 'Total number of export requests',
    example: 847,
  })
  totalRequests: number;

  @ApiProperty({
    description: 'Requests by status',
    example: {
      pending: 12,
      processing: 3,
      completed: 800,
      failed: 32,
    },
  })
  requestsByStatus: Record<string, number>;

  @ApiProperty({
    description: 'Requests by type',
    example: {
      forms: 450,
      animals: 200,
      users: 100,
      audit_logs: 50,
      statistics: 47,
    },
  })
  requestsByType: Record<string, number>;

  @ApiProperty({
    description: 'Requests by format',
    example: {
      csv: 520,
      xlsx: 250,
      json: 50,
      pdf: 27,
    },
  })
  requestsByFormat: Record<string, number>;

  @ApiProperty({
    description: 'Most frequent exporters',
    example: [
      { userId: 'uuid-1', count: 45, userName: 'Research Team Lead' },
      { userId: 'uuid-2', count: 32, userName: 'Data Analyst' },
    ],
  })
  topExporters: Array<{
    userId: string;
    count: number;
    userName?: string;
  }>;

  @ApiProperty({
    description: 'Average processing time in seconds',
    example: 23.5,
  })
  averageProcessingTime: number;

  @ApiProperty({
    description: 'Total size of all exports in bytes',
    example: 2048000000,
  })
  totalExportSize: number;
}

export class DashboardStatisticsDto {
  @ApiProperty({
    description: 'Audit statistics',
    type: AuditStatisticsDto,
  })
  auditStats: AuditStatisticsDto;

  @ApiProperty({
    description: 'Export statistics',
    type: ExportStatisticsDto,
  })
  exportStats: ExportStatisticsDto;

  @ApiProperty({
    description: 'System health indicators',
    example: {
      databaseConnections: 45,
      memoryUsage: 67.2,
      cpuUsage: 23.1,
      diskSpace: 78.9,
    },
  })
  systemHealth: Record<string, number>;

  @ApiProperty({
    description: 'Recent activity summary',
    example: {
      last24Hours: 1250,
      lastWeek: 8900,
      lastMonth: 35000,
    },
  })
  recentActivity: {
    last24Hours: number;
    lastWeek: number;
    lastMonth: number;
  };
}
