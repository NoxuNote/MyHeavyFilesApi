import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessManagementService } from './access-management.service';

@Module({
  providers: [AccessManagementService],
  exports: [AccessManagementService],
})
export class AccessManagementModule {}
