import { Recipient } from '@/domain/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(this: void, recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      zipCode: recipient.zipCode,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
    };
  }
}
