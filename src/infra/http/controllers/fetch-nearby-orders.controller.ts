import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FetchNearbyOrdersUseCase } from '@/domain/application/use-cases/fetch-nearby-orders';
import { OrderPresenter } from '../presenters/order.presenter';
import { FetchNearbyOrdersDto } from '../dtos/fetch-nearby-orders';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';

@Controller('/orders/nearby')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(@Query() query: FetchNearbyOrdersDto) {
    const { latitude, longitude } = query;

    const result = await this.fetchNearbyOrders.execute({
      deliverymanLatitude: Number(latitude),
      deliverymanLongitude: Number(longitude),
    });

    return {
      orders: result.orders.map(OrderPresenter.toHTTP),
    };
  }
}
