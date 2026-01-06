import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FetchNearbyOrdersUseCase } from '@/domain/application/use-cases/fetch-nearby-orders';
import { OrderPresenter } from '../presenters/order.presenter';
import { FetchNearbyOrdersDto } from '../dtos/fetch-nearby-orders';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/nearby')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch nearby orders',
    description:
      'Lists orders within a 10km radius based on the provided coordinates. **Available for deliverers and admins**.',
  })
  @ApiQuery({
    name: 'latitude',
    type: Number,
    description: 'Current latitude of the delivery person',
    example: -23.56168,
  })
  @ApiQuery({
    name: 'longitude',
    type: Number,
    description: 'Current longitude of the delivery person',
    example: -46.65591,
  })
  @ApiResponse({
    status: 200,
    description: 'List of nearby orders retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid coordinates format.',
  })
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
