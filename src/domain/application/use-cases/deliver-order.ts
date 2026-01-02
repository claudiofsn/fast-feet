// domain/application/use-cases/deliver-order.ts

import { OrdersRepository } from '../repositories/orders-repository';
import { Order } from '@/domain/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';
import { OrderHasBeenCanceledError } from './errors/order-has-been-canceled-error';
import { Injectable } from '@nestjs/common';

interface DeliverOrderUseCaseRequest {
  orderId: string;
  deliverymanId: string;
  signatureId: string;
}

interface DeliverOrderUseCaseResponse {
  order: Order;
}

@Injectable()
export class DeliverOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    deliverymanId,
    signatureId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new ResourceNotFoundError();
    }

    if (
      !order.deliverymanId ||
      order.deliverymanId.toString() !== deliverymanId ||
      order.endDate
    ) {
      throw new NotAllowedError();
    }

    if (order.canceladedAt) {
      throw new OrderHasBeenCanceledError();
    }

    order.signatureId = new UniqueEntityID(signatureId);
    order.endDate = new Date();

    await this.ordersRepository.save(order);

    return { order };
  }
}
