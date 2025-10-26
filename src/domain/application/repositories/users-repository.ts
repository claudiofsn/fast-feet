import { User } from '@/domain/enterprise/entities/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByDocument(document: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
