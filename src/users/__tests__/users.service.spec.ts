import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { GetUsersQueryDto } from '../dto/get-users-query.dto';

const mockUser: User = {
  id: 1,
  username: 'jdoe',
  email: 'jdoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isActive: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockUser2: User = {
  id: 2,
  username: 'jsmith',
  email: 'jsmith@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  isActive: 1,
  createdAt: new Date('2024-01-02'),
  updatedAt: new Date('2024-01-02'),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated users with defaults', async () => {
      repository.findAndCount.mockResolvedValue([[mockUser, mockUser2], 2]);

      const query: GetUsersQueryDto = { page: 1, limit: 10 };
      const result = await service.findAll(query);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { id: 'ASC' },
      });
    });

    it('should apply username filter using ILike', async () => {
      repository.findAndCount.mockResolvedValue([[mockUser], 1]);

      const query: GetUsersQueryDto = { page: 1, limit: 10, username: 'jdoe' };
      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].username).toBe('jdoe');
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { username: ILike('%jdoe%') },
        }),
      );
    });

    it('should calculate correct skip offset for page 2', async () => {
      repository.findAndCount.mockResolvedValue([[mockUser], 11]);

      const query: GetUsersQueryDto = { page: 2, limit: 10 };
      const result = await service.findAll(query);

      expect(result.totalPages).toBe(2);
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });

    it('should return empty list when no users found', async () => {
      repository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should map entity fields to response DTO correctly', async () => {
      repository.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      const dto = result.data[0];

      expect(dto.id).toBe(mockUser.id);
      expect(dto.username).toBe(mockUser.username);
      expect(dto.email).toBe(mockUser.email);
      expect(dto.firstName).toBe(mockUser.firstName);
      expect(dto.lastName).toBe(mockUser.lastName);
      expect(dto.isActive).toBe(mockUser.isActive);
      // updatedAt should NOT be exposed in the response DTO
      expect((dto as any).updatedAt).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.username).toBe('jdoe');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('findByUsername', () => {
    it('should return a user when found by username', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('jdoe');

      expect(result.username).toBe('jdoe');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'jdoe' },
      });
    });

    it('should throw NotFoundException when username does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findByUsername('ghost')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByUsername('ghost')).rejects.toThrow(
        "User with username 'ghost' not found",
      );
    });
  });
});
