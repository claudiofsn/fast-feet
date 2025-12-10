import { User } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface EditUserUseCaseRequest {
  userId: string;
  name?: string;
  email?: string;
}

interface EditUserUseCaseResponse {
  user: User;
}

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    email,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await this.usersRepository.save(user);

    return {
      user,
    };
  }
}
