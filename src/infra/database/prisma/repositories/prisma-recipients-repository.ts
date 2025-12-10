import { Injectable } from '@nestjs/common';
import { RecipientsRepository } from '@/domain/application/repositories/recipients-repository';
import { Recipient } from '@/domain/enterprise/entities/recipient';
import { PrismaService } from '../prisma.service';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';

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
}
