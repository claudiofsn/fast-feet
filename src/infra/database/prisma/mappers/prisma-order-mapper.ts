import { Order as PrismaOrder, Prisma } from '@prisma/client';
import { Order } from '@/domain/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaOrderMapper {
  static toDomain(this: void, raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        product: raw.product,
        deliverymanId: new UniqueEntityID(raw.deliverymanId),
        signatureId: new UniqueEntityID(raw.signatureId),
        canceladedAt: raw.canceladedAt,
        startDate: raw.startDate,
        endDate: raw.endDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      product: order.product,
      deliverymanId: order.deliverymanId?.toString() ?? null,
      signatureId: order.signatureId?.toString() ?? null,
      canceladedAt: order.canceladedAt,
      startDate: order.startDate,
      endDate: order.endDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
