import { Order } from '@/domain/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { Injectable } from '@nestjs/common';

interface FetchDeliverymanOrdersUseCaseRequest {
  deliverymanId: string;
  page: number;
}

@Injectable()
export class FetchDeliverymanOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    page,
  }: FetchDeliverymanOrdersUseCaseRequest): Promise<{ orders: Order[] }> {
    const orders = await this.ordersRepository.findManyByDeliverymanId(
      deliverymanId,
      { page },
    );

    return { orders };
  }
}
