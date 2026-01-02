import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders-repository';
import { NotAllowedError } from './errors/not-allowed-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ReturnOrderUseCaseRequest {
  orderId: string;
  deliverymanId: string;
}

@Injectable()
export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ orderId, deliverymanId }: ReturnOrderUseCaseRequest) {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) throw new ResourceNotFoundError();

    if (order.deliverymanId?.toString() !== deliverymanId) {
      throw new NotAllowedError();
    }

    order.return();

    await this.ordersRepository.save(order);

    return { order };
  }
}
