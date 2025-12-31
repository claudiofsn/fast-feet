export class CannotMarkOrderAsWaitingError extends Error {
  constructor() {
    super(
      'Deliver has already been completed and cannot be marked as waiting again.',
    );
    this.name = 'CannotMarkOrderAsWaitingError';
  }
}
