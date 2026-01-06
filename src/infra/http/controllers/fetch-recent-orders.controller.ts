import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { FetchRecentOrdersUseCase } from '@/domain/application/use-cases/fetch-recent-orders';
import { FetchOrdersQueryDto } from '../dtos/fetch-recent-orders.dto';
import { OrderPresenter } from '../presenters/order.presenter';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchRecentOrdersController {
  constructor(private fetchOrders: FetchRecentOrdersUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Fetch recent orders',
    description:
      'Lists the most recent orders with pagination. **Only admins**.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number to retrieve. Defaults to 1.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent orders list retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can access this resource.',
  })
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
