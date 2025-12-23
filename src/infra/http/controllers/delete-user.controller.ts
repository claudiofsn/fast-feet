import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteUserUseCase } from '@/domain/application/use-cases/delete-user';

@Controller('/users/:id')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  async handle(@Param('id') userId: string) {
    await this.deleteUser.execute({
      userId,
    });
  }
}
