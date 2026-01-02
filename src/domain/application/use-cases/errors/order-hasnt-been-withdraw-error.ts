export class OrderHasntBeenWithdrawError extends Error {
  constructor() {
    super('Order hasnt been withdraw.');
    this.name = 'OrderHasntBeenWithdrawError';
  }
}
