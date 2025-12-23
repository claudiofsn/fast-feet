import { User } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface EditUserUseCaseRequest {
  userId: string;
  name?: string;
  email?: string;
  cpf?: string;
  roles?: User['roles'];
}

interface EditUserUseCaseResponse {
  user: User;
}

@Injectable()
export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    email,
    roles,
    cpf,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (roles) user.roles = roles;
    if (cpf) user.cpf = cpf;

    await this.usersRepository.save(user);

    return {
      user,
    };
  }
}
