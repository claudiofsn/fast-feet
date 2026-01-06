import {
  Controller,
  Param,
  Patch,
  HttpCode,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { MarkOrderAsWaitingUseCase } from '@/domain/application/use-cases/mark-order-as-waiting';
import { CannotMarkOrderAsWaitingError } from '@/domain/application/use-cases/errors/cannot-mark-order-as-waiting-error';
import { Roles } from '@/infra/auth/roles.decorator';
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:id/waiting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarkOrderAsWaitingController {
  constructor(private markOrderAsWaiting: MarkOrderAsWaitingUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Mark order as waiting',
    description:
      'Updates order status to "waiting for pickup". This allows delivery personnel to see and pick up the order. **Only admins**.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the order',
    example: 'order-uuid-001',
  })
  @ApiResponse({
    status: 204,
    description: 'Order successfully marked as waiting.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can perform this action.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Order not found.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Business rule violation (e.g., order is already delivered).',
  })
  async handle(@Param('id') orderId: string) {
    try {
      await this.markOrderAsWaiting.execute({
        orderId,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CannotMarkOrderAsWaitingError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException();
    }
  }
}
