import { Either, left, right } from '@/core/either';
import { DeliverymanRepository } from '../repositories/deliveryman-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';

export interface GetDeliverymanByIdUseCaseRequest {
  id: string;
}

type GetDeliverymanByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman;
  }
>;

export class GetDeliverymanByIdUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    id,
  }: GetDeliverymanByIdUseCaseRequest): Promise<GetDeliverymanByIdUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(id);

    if (!deliveryman) {
      return left(new ResourceNotFoundError());
    }

    return right({
      deliveryman,
    });
  }
}
