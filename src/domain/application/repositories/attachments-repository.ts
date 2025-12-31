import { Attachment } from '@/domain/enterprise/entities/attachment';

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>;
}
