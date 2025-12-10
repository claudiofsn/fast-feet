import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Recipient,
  RecipientProps,
} from '@/domain/enterprise/entities/recipient';

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      state: faker.location.state(),
      neighborhood: faker.location.street(),
      street: faker.location.streetAddress(),
      zipCode: faker.location.zipCode('########'),
      complement: faker.location.secondaryAddress(),
      number: String(faker.number.int({ min: 1, max: 1000 })),
      ...override,
    },
    id,
  );

  return recipient;
}
