import { UsersRepository } from '../repositories/users-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { Injectable } from '@nestjs/common';

interface AuthenticateUserUseCaseRequest {
  cpf: string;
  password: string;
}

interface AuthenticateUserUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByCpf(cpf);

    if (!user) {
      throw new WrongCredentialsError();
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
        roles: user.roles,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
