// domain/application/use-cases/mark-order-as-waiting.ts

import { OrdersRepository } from '../repositories/orders-repository';
import { Order } from '@/domain/enterprise/entities/order';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CannotMarkOrderAsWaitingError } from './errors/cannot-mark-order-as-waiting-error';
import { Injectable } from '@nestjs/common';

interface MarkOrderAsWaitingUseCaseRequest {
  orderId: string;
}

interface MarkOrderAsWaitingUseCaseResponse {
  order: Order;
}

@Injectable()
export class MarkOrderAsWaitingUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: MarkOrderAsWaitingUseCaseRequest): Promise<MarkOrderAsWaitingUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }

    // Regra: Uma encomenda entregue talvez não devesse voltar para 'aguardando'
    // Mas uma encomenda 'cancelada' ou 'devolvida' sim.
    if (order.endDate) {
      throw new CannotMarkOrderAsWaitingError();
    }

    order.deliverymanId = null;
    order.startDate = null;
    order.endDate = null;
    order.signatureId = null;
    order.canceladedAt = null; // Caso estivesse cancelada e voltasse ao fluxo

    order.update(order);

    await this.ordersRepository.save(order);

    return { order };
  }
}
