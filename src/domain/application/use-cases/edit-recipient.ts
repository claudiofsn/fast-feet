import { Recipient } from '@/domain/enterprise/entities/recipient';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface EditRecipientUseCaseRequest {
  recipientId: string;
  name?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string | null;
  neighborhood?: string;
  city?: string;
  state?: string;
}

interface EditRecipientUseCaseResponse {
  recipient: Recipient;
}

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    ...params
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      throw new ResourceNotFoundError();
    }

    recipient.update(params);

    await this.recipientsRepository.save(recipient);

    return {
      recipient,
    };
  }
}
