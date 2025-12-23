/* eslint-disable @typescript-eslint/require-await */
import { Encrypter } from '@/domain/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
  }

  async decrypt(token: string): Promise<Record<string, unknown>> {
    try {
      return JSON.parse(token) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
}
