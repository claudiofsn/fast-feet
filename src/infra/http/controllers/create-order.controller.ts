import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
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
@Controller('/orders/:id')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created.' })
  @ApiResponse({ status: 409, description: 'Order already exists.' })
  async handle(@Body() body: CreateOrderDto, @Param('id') recipientId: string) {
    await this.createOrder.execute({
      ...body,
      recipientId,
    });
  }
}
