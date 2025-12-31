// domain/application/use-cases/withdraw-order.ts

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrdersRepository } from '../repositories/orders-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { OrderEnRoutForDeliveryError } from './errors/order-en-route-for-delivery-error';
import { OrderHasBeenCanceledError } from './errors/order-has-been-canceled-error';
import { Injectable } from '@nestjs/common';

interface WithdrawOrderUseCaseRequest {
  orderId: string;
  deliverymanId: string;
}

@Injectable()
export class WithdrawOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ orderId, deliverymanId }: WithdrawOrderUseCaseRequest) {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new ResourceNotFoundError();
    }

    if (order.deliverymanId) {
      throw new OrderEnRoutForDeliveryError();
    }

    if (order.canceladedAt) {
      throw new OrderHasBeenCanceledError();
    }

    order.deliverymanId = new UniqueEntityID(deliverymanId);
    order.startDate = new Date();
    order.update(order);

    await this.ordersRepository.save(order);

    return { order };
  }
}
