export class OrderHasBeenCanceledError extends Error {
  constructor() {
    super('Order has been canceled.');
    this.name = 'OrderHasBeenCanceledError';
  }
}
