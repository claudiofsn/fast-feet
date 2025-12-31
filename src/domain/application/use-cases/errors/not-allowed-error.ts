export class NotAllowedError extends Error {
  constructor() {
    super('Operation not allowed.');
    this.name = 'NotAllowedError';
  }
}
