/* eslint-disable @typescript-eslint/require-await */
import {
  UsersRepository,
  PaginationParams,
} from '@/domain/application/repositories/users-repository';
import { User, UserRole } from '@/domain/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User) {
    this.items.push(user);
  }

  async findByCpf(cpf: string) {
    const user = this.items.find((item) => item.cpf === cpf);
    return user ?? null;
  }

  async findByEmail(email: string) {
    const user = this.items.find(
      (item) => item.email === email && !item.deletedAt,
    );
    return user ?? null;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);
    return user ?? null;
  }

  async findManyByRole(role: UserRole, { page }: PaginationParams) {
    const users = this.items
      .filter((item) => item.roles.includes(role))
      .slice((page - 1) * 20, page * 20);

    return users;
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);
    this.items[itemIndex] = user;
  }
}
