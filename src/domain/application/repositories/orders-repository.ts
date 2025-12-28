import { Order } from '@/domain/enterprise/entities/order';
import { PaginationParams } from './users-repository';

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>;
  abstract findManyRecent(params: PaginationParams): Promise<Order[]>;
  abstract save(order: Order): Promise<void>;
  abstract findById(orderId: string): Promise<Order | null>;
}
