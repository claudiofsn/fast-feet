/* eslint-disable @typescript-eslint/require-await */
import { RecipientsRepository } from '@/domain/application/repositories/recipients-repository';
import { PaginationParams } from '@/domain/application/repositories/users-repository';
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

  async findManyRecents(params: PaginationParams): Promise<Recipient[]> {
    const { page } = params;
    const ITEMS_PER_PAGE = 20;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = page * ITEMS_PER_PAGE;

    const recipients = this.items.slice(startIndex, endIndex);

    return recipients;
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id);

    if (!recipient) {
      return null;
    }
    return recipient;
  }

  async save(recipient: Recipient): Promise<void> {
    const recipientIndex = this.items.findIndex(
      (item) => item.id === recipient.id,
    );

    if (recipientIndex >= 0) {
      this.items[recipientIndex] = recipient;
    }
  }
}
