import { Recipient } from '@/domain/enterprise/entities/recipient';
import { PaginationParams } from './users-repository';

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findById(id: string): Promise<Recipient | null>;
  abstract save(recipient: Recipient): Promise<void>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
  abstract findManyRecents(params: PaginationParams): Promise<Recipient[]>;
}
