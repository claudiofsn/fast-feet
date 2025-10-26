import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/enterprise/entities/deliveryman';
import { faker } from '@faker-js/faker';

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
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

  const deliveryman = Deliveryman.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document: generateCPF(),
      ...override,
    },
    id,
  );
  return deliveryman;
}
