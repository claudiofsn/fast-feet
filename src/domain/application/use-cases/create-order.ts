import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders-repository';
import { Order } from '@/domain/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CreateOrderUseCaseRequest {
  recipientId: string;
  product: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientRepository: RecipientsRepository,
  ) {}

  async execute({ recipientId, product }: CreateOrderUseCaseRequest) {
    const recipient = await this.recipientRepository.findById(recipientId);

    if (!recipient) {
      throw new ResourceNotFoundError();
    }

    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
      product,
      deliverymanId: null,
      signatureId: null,
      startDate: null,
      endDate: null,
      canceladedAt: null,
    });

    await this.ordersRepository.create(order);

    return {
      order,
    };
  }
}
