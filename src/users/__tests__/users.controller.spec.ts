import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { PaginatedUsersResponseDto, UserResponseDto } from '../dto/user-response.dto';

const mockUserDto: UserResponseDto = {
  id: 1,
  username: 'jdoe',
  email: 'jdoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isActive: 1,
  createdAt: new Date('2024-01-01'),
};

const mockPaginatedResponse: PaginatedUsersResponseDto = {
  data: [mockUserDto],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      service.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should pass username filter to service', async () => {
      service.findAll.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll({ page: 1, limit: 10, username: 'jdoe' });

      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        username: 'jdoe',
      });
    });

    it('should return empty result when no users match filter', async () => {
      const emptyResponse: PaginatedUsersResponseDto = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      service.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      service.findOne.mockResolvedValue(mockUserDto);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUserDto);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException when user not found', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      service.findByUsername.mockResolvedValue(mockUserDto);

      const result = await controller.findByUsername('jdoe');

      expect(result).toEqual(mockUserDto);
      expect(service.findByUsername).toHaveBeenCalledWith('jdoe');
    });

    it('should propagate NotFoundException when username not found', async () => {
      service.findByUsername.mockRejectedValue(
        new NotFoundException("User with username 'ghost' not found"),
      );

      await expect(controller.findByUsername('ghost')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
