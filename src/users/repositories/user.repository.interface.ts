import { User } from '../user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface FindAllOptions {
  name?: string;
  skip: number;
  take: number;
}

export interface IUserRepository {
  findAll(options: FindAllOptions): Promise<[User[], number]>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
