import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { DeleteUserUseCase } from '@/domain/application/use-cases/delete-user';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes an existing user from the system. **Only admins**.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to be deleted',
    example: 'f3a5b6c7-d8e9-4a0b-bc1d-2e3f4a5b6c7d',
  })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
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
    description: 'Not Found - User not found.',
  })
  async handle(@Param('id') userId: string) {
    await this.deleteUser.execute({
      userId,
    });
  }
}
