import { Order } from '@/domain/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(this: void, order: Order) {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      product: order.product,
      deliverymanId: order.deliverymanId?.toString() || null,
      signatureId: order.signatureId?.toString() || null,
      canceladedAt: order.canceladedAt,
      startDate: order.startDate,
      endDate: order.endDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
