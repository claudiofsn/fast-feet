import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EditRecipientUseCase } from '@/domain/application/use-cases/edit-recipient';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { EditRecipientDto } from '../dtos/edit-recipient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/recipients/:id')
@ApiTags('Recipients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
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
