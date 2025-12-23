import { User, UserRole } from '@/domain/enterprise/entities/user';

export interface PaginationParams {
  page: number;
}

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findManyByRole(
    role: UserRole,
    params: PaginationParams,
  ): Promise<User[]>;
  abstract save(user: User): Promise<void>;
}
