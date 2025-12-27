import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteRecipientUseCase } from '@/domain/application/use-cases/delete-recipient';

@Controller('/recipients/:id')
@ApiTags('Recipients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(@Param('id') recipientId: string) {
    await this.deleteRecipient.execute({
      recipientId,
    });
  }
}
