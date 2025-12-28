import { Order } from '@/domain/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface EditOrderUseCaseRequest {
  orderId: string;
  product?: string;
  deliverymanId?: UniqueEntityID | null;
  signatureId?: UniqueEntityID | null;
  canceladedAt?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface EditOrderUseCaseResponse {
  order: Order;
}

@Injectable()
export class EditOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    ...params
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new ResourceNotFoundError();
    }

    order.update(params);

    await this.ordersRepository.save(order);

    return {
      order,
    };
  }
}
