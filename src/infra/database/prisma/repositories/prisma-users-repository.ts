import { Injectable } from '@nestjs/common';
import {
  UsersRepository,
  PaginationParams,
} from '@/domain/application/repositories/users-repository';
import { User, UserRole } from '@/domain/enterprise/entities/user';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf, deletedAt: null },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findManyByRole(
    role: UserRole,
    { page }: PaginationParams,
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        roles: {
          has: role, // Sintaxe do Postgres para arrays
        },
      },
      take: 20, // Limite por página
      skip: (page - 1) * 20, // Lógica de pular itens
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }
}
