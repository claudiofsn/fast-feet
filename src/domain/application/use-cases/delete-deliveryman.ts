import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { DeliverymanRepository } from '../repositories/deliveryman-repository';

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string;
}

type DeleteDeliverymanUseCaseResponse = Either<ResourceNotFoundError, null>;

export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute(
    request: DeleteDeliverymanUseCaseRequest,
  ): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(
      request.deliverymanId,
    );

    if (!deliveryman) {
      return left(new ResourceNotFoundError());
    }

    await this.deliverymanRepository.delete(deliveryman.id.toString());

    return right(null);
  }
}
