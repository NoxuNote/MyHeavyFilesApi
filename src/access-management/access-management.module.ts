import { Module } from '@nestjs/common';
import { AccessManagementService } from './access-management.service';

@Module({
  providers: [AccessManagementService],
  exports: [AccessManagementService],
})
export class AccessManagementModule {}
