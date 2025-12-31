import { Attachment } from '@/domain/enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';
import { Injectable } from '@nestjs/common';

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private uploader: Uploader,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest) {
    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({ title: fileName, url });

    await this.attachmentsRepository.create(attachment);

    return { attachment };
  }
}
