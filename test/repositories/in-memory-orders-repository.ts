/* eslint-disable @typescript-eslint/require-await */
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/application/repositories/orders-repository';
import { PaginationParams } from '@/domain/application/repositories/users-repository';
import { Order } from '@/domain/enterprise/entities/order';
import { getDistanceBetweenCoordinates } from '@/domain/helpers/get-distance-between-coordinates';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Order[]> {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.items.find((order) => order.id.toString() === orderId);

    if (!order) {
      return null;
    }

    return order;
  }

  async save(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === order.id);
    if (orderIndex >= 0) {
      this.items[orderIndex] = order;
    }
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const MAX_RANGE_IN_KM = 10;

    return this.items.filter((item) => {
      if (item.deliverymanId || item.canceladedAt) return false;

      const distance = getDistanceBetweenCoordinates({
        lat1: latitude,
        lon1: longitude,
        lat2: item.latitude,
        lon2: item.longitude,
      });

      return distance < MAX_RANGE_IN_KM; // Raio de 10km
    });
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    return this.items
      .filter((item) => item.deliverymanId.toString() === deliverymanId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
  }
}
