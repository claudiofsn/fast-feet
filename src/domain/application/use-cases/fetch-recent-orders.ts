import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders-repository';
import { Order } from '@/domain/enterprise/entities/order';

interface FetchOrderUseCaseRequest {
  page: number;
}

interface FetchOrderUseCaseResponse {
  orders: Order[];
}

@Injectable()
export class FetchRecentOrdersUseCase {
  constructor(private orderRepository: OrdersRepository) {}

  async execute({
    page = 1,
  }: FetchOrderUseCaseRequest): Promise<FetchOrderUseCaseResponse> {
    const orders = await this.orderRepository.findManyRecent({ page });

    return {
      orders,
    };
  }
}
