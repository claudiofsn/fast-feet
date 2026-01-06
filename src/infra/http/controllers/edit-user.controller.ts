import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { EditUserDto } from '../dtos/edit-user.dto';
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Edit an existing user',
    description:
      'Updates user details. **Only admins**. The roles can be: `ADMIN` or `DELIVERER`.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to be updated',
    example: 'user-id-123',
  })
  @ApiResponse({ status: 204, description: 'User successfully updated.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - User not found.',
  })
  async handle(@Body() body: EditUserDto, @Param('id') userId: string) {
    try {
      const { name, email, roles, cpf } = body;

      await this.editUser.execute({
        userId,
        name,
        email,
        roles,
        cpf,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException();
      }
      throw new BadRequestException(error);
    }
  }
}
