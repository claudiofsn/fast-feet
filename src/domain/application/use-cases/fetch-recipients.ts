import { Injectable } from '@nestjs/common';
import { RecipientsRepository } from '../repositories/recipients-repository';
import { Recipient } from '@/domain/enterprise/entities/recipient';

interface FetchRecipientUseCaseRequest {
  page: number;
}

interface FetchRecipientUseCaseResponse {
  recipients: Recipient[];
}

@Injectable()
export class FetchRecipientsUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    page = 1,
  }: FetchRecipientUseCaseRequest): Promise<FetchRecipientUseCaseResponse> {
    const recipients = await this.recipientRepository.findManyRecents({ page });

    return {
      recipients,
    };
  }
}
