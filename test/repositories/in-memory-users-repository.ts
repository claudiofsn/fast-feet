/* eslint-disable @typescript-eslint/require-await */
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { User } from '@/domain/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) || null;
  }

  async findByDocument(document: string): Promise<User | null> {
    return this.items.find((user) => user.document === document) || null;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }
}
