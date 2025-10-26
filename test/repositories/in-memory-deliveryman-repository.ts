/* eslint-disable @typescript-eslint/require-await */
import { PaginationParams } from '@/core/repositories/pagination-params';
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

  async delete(deliverymanId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === deliverymanId,
    );
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  async findById(deliverymanId: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find(
      (item) => item.id.toString() === deliverymanId,
    );
    return deliveryman || null;
  }

  async findMany({ page }: PaginationParams): Promise<Deliveryman[]> {
    const PERPAGE = 20;

    return this.items
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * PERPAGE, page * PERPAGE);
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    this.items.push(deliveryman);
  }
}
