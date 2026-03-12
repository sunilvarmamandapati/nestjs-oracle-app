import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { PaginatedUsersResponseDto, UserResponseDto } from './dto/user-response.dto';
import { IUserRepository, USER_REPOSITORY } from './repositories/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(query: GetUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    const { page, limit, name } = query;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAll({ name, skip, take: limit });

    return {
      data: users.map((u) => this.toResponseDto(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  async findByUsername(username: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
