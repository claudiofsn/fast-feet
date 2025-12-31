/* eslint-disable @typescript-eslint/require-await */
import { AttachmentsRepository } from '@/domain/application/repositories/attachments-repository';
import { Attachment } from '@/domain/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}

// test/storage/fake-uploader.ts
import { Uploader, UploadParams } from '@/domain/application/storage/uploader';

export class FakeUploader implements Uploader {
  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    return { url: `http://firebase-storage.com/${fileName}` };
  }
}
