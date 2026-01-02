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
import { DeliverOrderUseCase } from '@/domain/application/use-cases/deliver-order';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error';
import { DeliverOrderDto } from '../dtos/deliver-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';

@Controller('/orders/:id/deliver')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
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
