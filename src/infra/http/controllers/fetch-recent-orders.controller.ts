import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@/domain/enterprise/entities/user';
import { FetchRecentOrdersUseCase } from '@/domain/application/use-cases/fetch-recent-orders';
import { FetchOrdersQueryDto } from '../dtos/fetch-recent-orders.dto';
import { OrderPresenter } from '../presenters/order.presenter';

@Controller('/orders')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchRecentOrdersController {
  constructor(private fetchOrders: FetchRecentOrdersUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(@Query() query: FetchOrdersQueryDto) {
    const { page } = query;

    const result = await this.fetchOrders.execute({
      page,
    });

    return {
      orders: result.orders.map(OrderPresenter.toHTTP),
    };
  }
}
