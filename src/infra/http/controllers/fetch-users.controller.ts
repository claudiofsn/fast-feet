import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FetchUsersUseCase } from '@/domain/application/use-cases/fetch-users';
import { UserPresenter } from '../presenters/user-presenter';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { FetchUsersQueryDto } from '../dtos/fetch-users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(@Query() query: FetchUsersQueryDto) {
    const { page } = query;

    const result = await this.fetchUsers.execute({
      page,
    });

    return {
      users: result.users.map(UserPresenter.toHTTP),
    };
  }
}
