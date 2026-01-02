import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FetchDeliverymanOrdersUseCase } from '@/domain/application/use-cases/fetch-deliveryman-orders';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { OrderPresenter } from '../presenters/order.presenter';
import { FetchDeliverymanOrdersQueryDto } from '../dtos/fetch-deliveryman-orders.dto';

@Controller('/deliveries')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchDeliverymanOrdersController {
  constructor(private fetchDeliverymanOrders: FetchDeliverymanOrdersUseCase) {}

  @Get()
  async handle(
    @Query() query: FetchDeliverymanOrdersQueryDto,
    @CurrentUser() user: UserPayload,
  ) {
    const deliverymanId = user.sub;
    const { page } = query;

    const result = await this.fetchDeliverymanOrders.execute({
      deliverymanId,
      page,
    });

    return {
      orders: result.orders.map(OrderPresenter.toHTTP),
    };
  }
}
