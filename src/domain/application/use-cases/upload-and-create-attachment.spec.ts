import { beforeEach, describe, expect, it } from 'vitest';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { FakeUploader } from 'test/storage/fake-uploader';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      fakeUploader,
      inMemoryAttachmentsRepository,
    );
  });

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('fake-image-content'),
    });

    expect(result.attachment.id).toBeDefined();
    expect(result.attachment.url).toContain('profile.png');
    expect(result.attachment.url).toMatch(/http:\/\/.*profile\.png/);
  });
});
