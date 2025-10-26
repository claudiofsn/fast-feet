/* eslint-disable @typescript-eslint/require-await */
import { DeliverymanRepository } from '@/domain/application/repositories/deliveryman-repository';
import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = [];

  async findByEmail(email: string): Promise<Deliveryman | null> {
    return this.items.find((item) => item.email === email) || null;
  }

  async findByDocument(document: string): Promise<Deliveryman | null> {
    return this.items.find((item) => item.document === document) || null;
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(deliveryman.id),
    );
    if (index >= 0) {
      this.items[index] = deliveryman;
    }
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    this.items.push(deliveryman);
  }
}
