import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAndCreateAttachmentUseCase } from '@/domain/application/use-cases/upload-and-create-attachment';

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: 'O arquivo deve ter no máximo 5MB',
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const { attachment } = await this.uploadAndCreateAttachment.execute({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      });

      return {
        attachmentId: attachment.id.toString(),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
