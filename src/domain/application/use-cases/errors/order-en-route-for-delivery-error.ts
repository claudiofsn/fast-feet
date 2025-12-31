export class OrderEnRoutForDeliveryError extends Error {
  constructor() {
    super('This order already has a designated delivery person.');

    this.name = 'OrderEnRoutForDeliveryError';
  }
}
