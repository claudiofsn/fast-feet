import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { DeleteRecipientUseCase } from '@/domain/application/use-cases/delete-recipient';

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete a recipient',
    description: 'Removes a recipient from the system. **Only admins**.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the recipient to be deleted',
    example: '6089851a-7965-4235-9092-20f63b45e99c',
  })
  @ApiResponse({ status: 204, description: 'Recipient successfully deleted.' })
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
  async handle(@Param('id') recipientId: string) {
    await this.deleteRecipient.execute({
      recipientId,
    });
  }
}
