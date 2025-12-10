import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FetchDeliverersUseCase } from '@/domain/application/use-cases/fetch-deliverers';
import { UserPresenter } from '../presenters/user-presenter';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { FetchDeliverersQueryDto } from '../dtos/fetch-reliverers.dto';

@Controller('/deliverers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchDeliverersController {
  constructor(private fetchDeliverers: FetchDeliverersUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(@Query() query: FetchDeliverersQueryDto) {
    const { page } = query;

    const result = await this.fetchDeliverers.execute({
      page,
    });

    return {
      deliverers: result.users.map(UserPresenter.toHTTP),
    };
  }
}
