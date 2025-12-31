import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domain/enterprise/entities/attachment';
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client';
export class PrismaAttachmentMapper {
  static toDomain(this: void, raw: PrismaAttachment) {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      title: attachment.title,
      url: attachment.url,
      id: attachment.id.toString(),
    };
  }
}
