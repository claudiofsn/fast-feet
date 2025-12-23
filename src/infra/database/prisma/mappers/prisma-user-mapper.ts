import { User as PrismaUser, Prisma } from '@prisma/client';
import {
  User,
  UserRole as DomainUserRole,
} from '@/domain/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaUserMapper {
  static toDomain(this: void, raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        passwordHash: raw.password,
        roles: raw.roles.map((role) => {
          if (role === 'ADMIN') return DomainUserRole.ADMIN;
          if (role === 'DELIVERER') return DomainUserRole.DELIVERER;
        }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      password: user.passwordHash,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
