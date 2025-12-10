import { Recipient } from '@/domain/enterprise/entities/recipient';

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
}
