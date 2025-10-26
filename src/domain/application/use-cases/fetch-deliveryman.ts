import { Injectable } from '@nestjs/common';
import { DeliverymanRepository } from '../repositories/deliveryman-repository';
import { Either, right } from '@/core/either';
import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';

interface FetchDeliverymanUseCaseRequest {
  page: number;
}

type FetchDeliverymanUseCaseResponse = Either<
  null,
  { deliveryman: Deliveryman[] }
>;

@Injectable()
export class FetchDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}
  async execute({
    page,
  }: FetchDeliverymanUseCaseRequest): Promise<FetchDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findMany({ page });
    return right({ deliveryman });
  }
}
