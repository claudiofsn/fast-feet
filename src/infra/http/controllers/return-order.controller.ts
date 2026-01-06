import {
  Controller,
  Param,
  Patch,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ReturnOrderUseCase } from '@/domain/application/use-cases/return-order';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:id/return')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Return an order',
    description:
      'Marks an order as returned (e.g., recipient not found or refused). **Only the assigned delivery person** can perform this action.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the order to be returned',
    example: 'order-999',
  })
  @ApiResponse({
    status: 204,
    description: 'Order successfully marked as returned.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Invalid token or delivery person not assigned to this order.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Order is in an invalid state for return.',
  })
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
