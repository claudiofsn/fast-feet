import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUserUseCaseRequest {
  name: string;
  document: string;
  email: string;
  password: string;
  role: UserRole;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  { user: User }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    document,
    email,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const userWithSameDocument =
      await this.usersRepository.findByDocument(document);
    if (userWithSameDocument) {
      return left(new UserAlreadyExistsError(document));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      document,
      email,
      password: hashedPassword,
      role,
    });

    await this.usersRepository.create(user);

    return right({ user });
  }
}
