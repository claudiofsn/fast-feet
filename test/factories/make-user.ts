import { faker } from '@faker-js/faker';
import { User, UserProps } from '@/domain/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { hash } from 'bcryptjs';

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

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(overrides = {}) {
    return this.prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: faker.number
          .int({ min: 10000000000, max: 99999999999 })
          .toString(),
        password: await hash('123456', 8),
        roles: ['DELIVERER'],
        ...overrides,
      },
    });
  }
}
