import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/enterprise/entities/order';
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      product: `Product ${Math.random()}`,
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      deliverymanId: null,
      signatureId: null,
      canceladedAt: null,
      startDate: null,
      endDate: null,
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
