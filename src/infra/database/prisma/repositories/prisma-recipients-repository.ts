import { Injectable } from '@nestjs/common';
import { RecipientsRepository } from '@/domain/application/repositories/recipients-repository';
import { Recipient } from '@/domain/enterprise/entities/recipient';
import { PrismaService } from '../prisma.service';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';
import { PaginationParams } from '@/domain/application/repositories/users-repository';

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);
    await this.prisma.recipient.create({ data });
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { email },
    });

    if (!recipient) return null;

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id },
    });
    if (!recipient) return null;

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findManyRecents(params: PaginationParams): Promise<Recipient[]> {
    const PAGE_SIZE = 20;

    const recipients = await this.prisma.recipient.findMany({
      take: PAGE_SIZE,
      skip: (params.page - 1) * PAGE_SIZE,
    });

    return recipients.map(PrismaRecipientMapper.toDomain);
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);
    await this.prisma.recipient.update({
      where: { id: data.id },
      data,
    });
  }
}
