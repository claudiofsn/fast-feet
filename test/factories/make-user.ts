import { faker } from '@faker-js/faker';
import { User, UserProps } from '@/domain/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      cpf: String(faker.number.int({ min: 11111111111, max: 99999999999 })),
      ...override,
    },
    id,
  );

  return user;
}
