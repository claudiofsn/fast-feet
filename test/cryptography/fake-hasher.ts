/* eslint-disable @typescript-eslint/require-await */
import { HashGenerator } from '@/domain/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/application/cryptography/hash-comparer';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string) {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash;
  }
}
