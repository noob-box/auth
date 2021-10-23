import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AdminController } from './admin.controller';

jest.mock('../users/users.service');

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [UsersService],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
