// infra/http/controllers/mark-order-as-waiting.controller.ts

import {
  Controller,
  Param,
  Patch,
  HttpCode,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { MarkOrderAsWaitingUseCase } from '@/domain/application/use-cases/mark-order-as-waiting';
import { CannotMarkOrderAsWaitingError } from '@/domain/application/use-cases/errors/cannot-mark-order-as-waiting-error';
import { Roles } from '@/infra/auth/roles.decorator'; // Decorator customizado para Admin
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';

@Controller('/orders/:id/waiting')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarkOrderAsWaitingController {
  constructor(private markOrderAsWaiting: MarkOrderAsWaitingUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(@Param('id') orderId: string) {
    try {
      await this.markOrderAsWaiting.execute({
        orderId,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotMarkOrderAsWaitingError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException();
    }
  }
}
