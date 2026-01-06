import {
  Controller,
  Param,
  Patch,
  Body,
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
import { DeliverOrderUseCase } from '@/domain/application/use-cases/deliver-order';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error';
import { DeliverOrderDto } from '../dtos/deliver-order.dto';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:id/deliver')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deliver an order',
    description:
      'Finalizes the delivery process. Requires a signature (attachmentId). **Only the assigned delivery person** can perform this action.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the order being delivered',
    example: 'order-123',
  })
  @ApiResponse({ status: 204, description: 'Order successfully delivered.' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Invalid token or delivery person not assigned to this order.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Missing signature or order in invalid state.',
  })
  async handle(
    @Param('id') orderId: string,
    @Body() body: DeliverOrderDto,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const { attachmentId } = body;

      await this.deliverOrder.execute({
        orderId,
        deliverymanId: user.sub,
        signatureId: attachmentId,
      });
    } catch (error) {
      if (error instanceof NotAllowedError)
        throw new UnauthorizedException(error.message);

      throw new BadRequestException(error);
    }
  }
}
