export class OrderHasBeenDeliveredError extends Error {
  constructor() {
    super('Order has been delivered.');
    this.name = 'OrderHasBeenDeliveredError';
  }
}
