export interface EncrypterOptions {
  expiresIn: string | number;
}

export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: EncrypterOptions,
  ): Promise<string>;
  abstract decrypt(token: string): Promise<Record<string, unknown>>;
}
