import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User, UserProps, UserRole } from '@/domain/enterprise/entities/user';
import { faker } from '@faker-js/faker';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const generateCPF = (): string => {
    const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));
    const d1 =
      ((n.reduce((acc, cur, idx) => acc + cur * (10 - idx), 0) * 10) % 11) % 10;
    const d2 =
      (([...n, d1].reduce((acc, cur, idx) => acc + cur * (11 - idx), 0) * 10) %
        11) %
      10;
    return [...n, d1, d2].join('');
  };

  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document: generateCPF(),
      role: UserRole.USER,
      ...override,
    },
    id,
  );
  return user;
}
