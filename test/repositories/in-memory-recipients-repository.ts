/* eslint-disable @typescript-eslint/require-await */
import { RecipientsRepository } from '@/domain/application/repositories/recipients-repository';
import { Recipient } from '@/domain/enterprise/entities/recipient';

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async create(recipient: Recipient) {
    this.items.push(recipient);
  }

  async findByEmail(email: string) {
    const recipient = this.items.find((item) => item.email === email);

    if (!recipient) {
      return null;
    }

    return recipient;
  }
}
