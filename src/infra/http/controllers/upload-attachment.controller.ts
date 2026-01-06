import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadAndCreateAttachmentUseCase } from '@/domain/application/use-cases/upload-and-create-attachment';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('/attachments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload an attachment',
    description:
      'Uploads a file (signature or document) to the storage service. Allowed types: `png, jpg, jpeg, pdf`. Max size: `5MB`.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to be uploaded',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully. Returns the attachment ID.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - File too large or invalid file type.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: 'O arquivo deve ter no máximo 5MB',
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { attachment } = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    return {
      attachmentId: attachment.id.toString(),
    };
  }
}
