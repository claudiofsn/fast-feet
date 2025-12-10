export interface EncrypterOptions {
  expiresIn: string | number;
}

export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: EncrypterOptions,
  ): Promise<string>;
}
