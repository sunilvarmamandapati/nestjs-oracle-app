import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ required: false })
  @Expose()
  name: string;

  @ApiProperty({ required: false })
  @Expose()
  email: string;

  @ApiProperty({ required: false })
  @Expose()
  createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
