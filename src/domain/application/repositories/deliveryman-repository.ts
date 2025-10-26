import { PaginationParams } from '@/core/repositories/pagination-params';
import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';

export abstract class DeliverymanRepository {
  abstract findMany(params: PaginationParams): Promise<Deliveryman[]>;
  abstract findById(deliverymanId: string): Promise<Deliveryman | null>;
  abstract findByEmail(email: string): Promise<Deliveryman | null>;
  abstract findByDocument(document: string): Promise<Deliveryman | null>;
  abstract save(deliveryman: Deliveryman): Promise<void>;
  abstract delete(deliverymanId: string): Promise<void>;
  abstract create(deliveryman: Deliveryman): Promise<void>;
}
