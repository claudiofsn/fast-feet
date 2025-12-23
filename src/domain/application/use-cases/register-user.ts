import { User, UserRole } from '@/domain/enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { Injectable } from '@nestjs/common';

interface RegisterUserUseCaseRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
  roles?: UserRole[];
}

interface RegisterUserUseCaseResponse {
  user: User;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
    roles = [UserRole.DELIVERER],
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameCpf = await this.usersRepository.findByCpf(cpf);
    if (userWithSameCpf) {
      throw new UserAlreadyExistsError(cpf);
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError(email);
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      email,
      passwordHash,
      roles,
    });

    await this.usersRepository.create(user);

    return {
      user,
    };
  }
}
