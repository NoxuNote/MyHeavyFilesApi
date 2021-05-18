import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AccessManagementService } from 'src/access-management/access-management.service';
import { AccessManagementModule } from 'src/access-management/access-management.module';

@Module({
  providers: [ApiService],
  controllers: [ApiController],
  imports: [AccessManagementModule]
})
export class ApiModule {}
