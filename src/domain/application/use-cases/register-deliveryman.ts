import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';
import { DeliverymanRepository } from '../repositories/deliveryman-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterDeliverymanUseCaseRequest {
  name: string;
  document: string;
  email: string;
  password: string;
}

type RegisterDeliverymanUseCaseResponse = Either<
  UserAlreadyExistsError,
  { deliveryman: Deliveryman }
>;

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    document,
    email,
    password,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
    const deliverymanWithSameEmail =
      await this.deliverymansRepository.findByEmail(email);

    if (deliverymanWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const deliverymanWithSameDocument =
      await this.deliverymansRepository.findByDocument(document);

    if (deliverymanWithSameDocument) {
      return left(new UserAlreadyExistsError(document));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryman = Deliveryman.create({
      name,
      document,
      email,
      password: hashedPassword,
    });

    await this.deliverymansRepository.create(deliveryman);

    return right({ deliveryman });
  }
}
