import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/application/repositories/orders-repository';
import { PaginationParams } from '@/domain/application/repositories/users-repository';
import { Order } from '@/domain/enterprise/entities/order';
import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { Injectable } from '@nestjs/common';
import { Prisma, Order as PrismaOrder } from '@prisma/client';

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

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    /**
     * Ajuste necessário para o test e2e
     */
    const databaseUrl = process.env.DATABASE_URL;
    const schema = new URL(databaseUrl).searchParams.get('schema') || 'public';

    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
    SELECT * FROM ${Prisma.raw(`"${schema}"."orders"`)}
    WHERE (
      6371 * acos(
        cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + 
        sin(radians(${latitude})) * sin(radians(latitude))
      )
    ) <= 10
    AND deliveryman_id IS NULL
    AND canceladed_at IS NULL
  `;

    return orders.map(PrismaOrderMapper.toDomain);
  }
}
