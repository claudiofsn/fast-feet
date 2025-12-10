import { Injectable } from '@nestjs/common';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { Recipient } from '@/domain/enterprise/entities/recipient';
import { ConflictException } from '@nestjs/common';

interface CreateRecipientUseCaseRequest {
  name: string;
  email: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    email,
    zipCode,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  }: CreateRecipientUseCaseRequest) {
    const recipientWithSameEmail =
      await this.recipientsRepository.findByEmail(email);

    if (recipientWithSameEmail) {
      throw new ConflictException('Recipient with same email already exists.');
    }

    const recipient = Recipient.create({
      name,
      email,
      zipCode,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
    });

    await this.recipientsRepository.create(recipient);

    return {
      recipient,
    };
  }
}
