import {
  Controller,
  Param,
  Patch,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReturnOrderUseCase } from '@/domain/application/use-cases/return-order';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error';

@Controller('/orders/:id/return')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    try {
      const deliverymanId = user.sub;

      await this.returnOrder.execute({
        orderId,
        deliverymanId,
      });
    } catch (error) {
      if (error instanceof NotAllowedError)
        throw new UnauthorizedException(error.message);
      throw new BadRequestException(error);
    }
  }
}
