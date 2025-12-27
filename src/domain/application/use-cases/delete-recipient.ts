import { RecipientsRepository } from '../repositories/recipients-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

export interface DeleteRecipientUseCaseRequest {
  recipientId: string;
}

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({ recipientId }: DeleteRecipientUseCaseRequest): Promise<void> {
    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      throw new ResourceNotFoundError();
    }

    recipient.delete();

    await this.recipientsRepository.save(recipient);
  }
}
