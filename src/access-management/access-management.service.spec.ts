import { Test, TestingModule } from '@nestjs/testing';
import { AccessManagementService } from './access-management.service';

describe('AccessManagementService', () => {
  let service: AccessManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessManagementService],
    }).compile();

    service = module.get<AccessManagementService>(AccessManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
