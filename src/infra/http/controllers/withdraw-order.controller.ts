import {
  Controller,
  Param,
  Patch,
  HttpCode,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { WithdrawOrderUseCase } from '@/domain/application/use-cases/withdraw-order';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error';
import { OrderEnRoutForDeliveryError } from '@/domain/application/use-cases/errors/order-en-route-for-delivery-error';
import { OrderHasBeenCanceledError } from '@/domain/application/use-cases/errors/order-has-been-canceled-error';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';

@Controller('/orders/:id/withdraw')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WithdrawOrderController {
  constructor(private withdrawOrder: WithdrawOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const deliverymanId = user.sub;

    try {
      await this.withdrawOrder.execute({
        orderId,
        deliverymanId,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException();
      }

      if (error instanceof OrderEnRoutForDeliveryError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof OrderHasBeenCanceledError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException(error);
    }
  }
}
