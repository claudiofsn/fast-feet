import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FetchDeliverymanOrdersUseCase } from '@/domain/application/use-cases/fetch-deliveryman-orders';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { OrderPresenter } from '../presenters/order.presenter';
import { FetchDeliverymanOrdersQueryDto } from '../dtos/fetch-deliveryman-orders.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchDeliverymanOrdersController {
  constructor(private fetchDeliverymanOrders: FetchDeliverymanOrdersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch deliveryman orders',
    description:
      'Lists all orders assigned to the currently authenticated delivery person. **Pagination supported**.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number for pagination. Defaults to 1.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of deliveryman orders retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token.',
  })
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
