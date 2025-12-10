import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';

interface FetchDeliverersUseCaseRequest {
  page: number;
}

interface FetchDeliverersUseCaseResponse {
  users: User[];
}

export class FetchDeliverersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: FetchDeliverersUseCaseRequest): Promise<FetchDeliverersUseCaseResponse> {
    const users = await this.usersRepository.findManyByRole(
      UserRole.DELIVERER,
      { page },
    );

    return {
      users,
    };
  }
}
