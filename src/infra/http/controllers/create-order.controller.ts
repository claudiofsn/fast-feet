import {
  Body,
  Controller,
  Post,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderUseCase } from '@/domain/application/use-cases/create-order';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Registers a new package to be delivered. **Only admins**.',
  })
  @ApiResponse({ status: 201, description: 'Order successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation error.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins can create orders.',
  })
  @ApiResponse({ status: 404, description: 'Not Found - Recipient not found.' })
  async handle(@Body() body: CreateOrderDto) {
    const { recipientId, product, latitude, longitude } = body;

    try {
      await this.createOrder.execute({
        recipientId,
        product,
        latitude,
        longitude,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException('Recipient not found');
      }
      throw new BadRequestException();
    }
  }
}
