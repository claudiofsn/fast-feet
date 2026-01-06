import {
  Controller,
  Param,
  Patch,
  HttpCode,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { WithdrawOrderUseCase } from '@/domain/application/use-cases/withdraw-order';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error';
import { OrderHasBeenCanceledError } from '@/domain/application/use-cases/errors/order-has-been-canceled-error';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { OrderEnRoutForDeliveryError } from '@/domain/application/use-cases/errors/order-en-route-for-delivery-error';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:id/withdraw')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WithdrawOrderController {
  constructor(private withdrawOrder: WithdrawOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Withdraw an order',
    description:
      'Assigns the order to the authenticated delivery person and marks it as "withdrawn". **Available for delivery personnel and admins**.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the order to be withdrawn',
    example: 'order-123',
  })
  @ApiResponse({ status: 204, description: 'Order successfully withdrawn.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Order not found.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Order is already en route or has been canceled.',
  })
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
