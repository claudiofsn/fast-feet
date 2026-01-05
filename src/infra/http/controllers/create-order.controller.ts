import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateOrderUseCase } from '@/domain/application/use-cases/create-order';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/roles.decorator';
import { UserRole } from '@/domain/enterprise/entities/user';
import { CreateOrderDto } from '../dtos/create-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created.' })
  async handle(@Body() body: CreateOrderDto) {
    await this.createOrder.execute({
      ...body,
    });
  }
}
