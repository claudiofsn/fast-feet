import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { EditRecipientUseCase } from '@/domain/application/use-cases/edit-recipient';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { EditRecipientDto } from '../dtos/edit-recipient.dto';

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Edit a recipient',
    description:
      'Updates the details of an existing recipient. **Only admins**.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the recipient',
    example: 'recipient-123',
  })
  @ApiResponse({ status: 204, description: 'Recipient successfully updated.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can perform this action.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Recipient not found.',
  })
  async handle(
    @Body() body: EditRecipientDto,
    @Param('id') recipientId: string,
  ) {
    const data = body;

    await this.editRecipient.execute({
      recipientId,
      ...data,
    });
  }
}
