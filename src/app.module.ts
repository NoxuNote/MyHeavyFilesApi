import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { AccessManagementModule } from './access-management/access-management.module';

@Module({
  imports: [ApiModule, AccessManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
