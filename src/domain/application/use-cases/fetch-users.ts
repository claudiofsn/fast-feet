import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { Injectable } from '@nestjs/common';

interface FetchUsersUseCaseRequest {
  page: number;
}

interface FetchUsersUseCaseResponse {
  users: User[];
}

@Injectable()
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page = 1,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const users = await this.usersRepository.findManyByRole(
      UserRole.DELIVERER,
      { page },
    );

    return {
      users,
    };
  }
}
