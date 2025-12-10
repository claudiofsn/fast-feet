import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  Encrypter,
  EncrypterOptions,
} from '@/domain/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(
    payload: Record<string, unknown>,
    options?: EncrypterOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: options?.expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  async decrypt(token: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(token);
  }
}
