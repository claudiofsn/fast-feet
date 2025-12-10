import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { HashGenerator } from '@/domain/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/application/cryptography/hash-comparer';

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}
