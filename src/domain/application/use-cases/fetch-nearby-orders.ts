import { Order } from '@/domain/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { Injectable } from '@nestjs/common';

interface FetchNearbyOrdersUseCaseRequest {
  deliverymanLatitude: number;
  deliverymanLongitude: number;
}

interface FetchNearbyOrdersUseCaseResponse {
  orders: Order[];
}

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanLatitude,
    deliverymanLongitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyNearby({
      latitude: deliverymanLatitude,
      longitude: deliverymanLongitude,
    });

    return { orders };
  }
}
