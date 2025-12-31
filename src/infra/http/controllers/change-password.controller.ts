import { Body, Controller, UseGuards, Patch, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { ChangeUserPasswordUseCase } from '@/domain/application/use-cases/change-user-password';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/:userId/password')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChangePasswordController {
  constructor(private changeUserPassword: ChangeUserPasswordUseCase) {}

  @Patch()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Changes a user password' })
  @ApiResponse({
    status: 200,
    description: 'User password changed successfully.',
  })
  async handle(
    @Param('userId') userId: string,
    @Body() body: ChangePasswordDto,
    @CurrentUser() user: UserPayload,
  ): Promise<void> {
    const { password } = body;
    const authorId = user.sub;

    await this.changeUserPassword.execute({
      userId,
      newPassword: password,
      authorId,
    });
  }
}
