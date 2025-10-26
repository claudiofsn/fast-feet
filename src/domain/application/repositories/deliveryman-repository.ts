import { Deliveryman } from '@/domain/enterprise/entities/deliveryman';

export abstract class DeliverymanRepository {
  abstract findByEmail(email: string): Promise<Deliveryman | null>;
  abstract findByDocument(document: string): Promise<Deliveryman | null>;
  abstract save(deliveryman: Deliveryman): Promise<void>;
  abstract create(deliveryman: Deliveryman): Promise<void>;
}
