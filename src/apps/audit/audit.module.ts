import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';
import { ExportRequest } from './entities/export-request.entity';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { ExportRequestRepository } from './repositories/export-request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, ExportRequest])],
  controllers: [AuditController],
  providers: [AuditService, AuditLogRepository, ExportRequestRepository],
  exports: [
    AuditService,
    AuditLogRepository,
    ExportRequestRepository,
    TypeOrmModule,
  ],
})
export class AuditModule {}
