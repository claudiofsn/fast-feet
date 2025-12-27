import { Recipient as PrismaRecipient, Prisma } from '@prisma/client';
import { Recipient } from '@/domain/enterprise/entities/recipient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaRecipientMapper {
  static toDomain(this: void, raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        zipCode: raw.zipCode,
        street: raw.street,
        number: raw.number,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
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
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
      deletedAt: recipient.deletedAt,
    };
  }
}
