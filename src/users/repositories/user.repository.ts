import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../user.entity';
import { FindAllOptions, IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll({ name, skip, take }: FindAllOptions): Promise<[User[], number]> {
    const where: Record<string, unknown> = {};
    if (name) {
      where.name = ILike(`%${name}%`);
    }
    return this.repo.findAndCount({ where, skip, take, order: { id: 'ASC' } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { name: username } });
  }
}
