import { Injectable } from '@nestjs/common';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface RefreshTokenUseCaseRequest {
  refreshToken: string;
}

interface RefreshTokenUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(private encrypter: Encrypter) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    try {
      const payload = await this.encrypter.decrypt(refreshToken);

      const userId = payload.sub as string;

      const accessToken = await this.encrypter.encrypt(
        { sub: userId }, // Adicione roles aqui se buscar do repo
        { expiresIn: '15m' },
      );

      const newRefreshToken = await this.encrypter.encrypt(
        { sub: userId },
        { expiresIn: '7d' },
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new WrongCredentialsError();
    }
  }
}
