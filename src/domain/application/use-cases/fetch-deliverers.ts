import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { Injectable } from '@nestjs/common';

interface FetchDeliverersUseCaseRequest {
  page: number;
}

interface FetchDeliverersUseCaseResponse {
  users: User[];
}

@Injectable()
export class FetchDeliverersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page = 1,
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
