import { Either, left, right } from '@/core/either';
import { DeliverymanRepository } from '../repositories/deliveryman-repository';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';

interface EditDeliverymanUseCaseRequest {
  id: string;
  name: string;
  email: string;
  document: string;
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman;
  }
>;

export class EditDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute(
    request: EditDeliverymanUseCaseRequest,
  ): Promise<EditDeliverymanUseCaseResponse> {
    const { id, name, email, document } = request;

    const deliveryman = await this.deliverymanRepository.findById(id);

    if (!deliveryman) {
      return left(new ResourceNotFoundError());
    }

    deliveryman.name = name;
    deliveryman.email = email;
    deliveryman.document = document;

    await this.deliverymanRepository.save(deliveryman);

    return right({ deliveryman });
  }
}
