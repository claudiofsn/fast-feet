import { OrdersRepository } from '@/domain/application/repositories/orders-repository';
import { PaginationParams } from '@/domain/application/repositories/users-repository';
import { Order } from '@/domain/enterprise/entities/order';
import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOrderRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });
  }
  async findManyRecent(params: PaginationParams): Promise<Order[]> {
    const PER_PAGE = 20;

    const orders = await this.prisma.order.findMany({
      skip: params.page * PER_PAGE,
      take: PER_PAGE,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }
}
