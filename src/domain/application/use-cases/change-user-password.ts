// domain/application/use-cases/change-user-password.ts

import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { NotAllowedError } from './errors/not-allowed-error';
import { UserRole } from '@/domain/enterprise/entities/user';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface ChangeUserPasswordUseCaseRequest {
  authorId: string;
  userId: string;
  newPassword: string;
}

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    authorId,
    userId,
    newPassword,
  }: ChangeUserPasswordUseCaseRequest) {
    const author = await this.usersRepository.findById(authorId);

    if (!author || !author.roles.includes(UserRole.ADMIN)) {
      throw new NotAllowedError();
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword);

    user.update({ passwordHash: hashedPassword });

    await this.usersRepository.save(user);
  }
}
