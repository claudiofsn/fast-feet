import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FetchRecipientsUseCase } from '@/domain/application/use-cases/fetch-recipients';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@/domain/enterprise/entities/user';
import { FetchRecipientsQueryDto } from '../dtos/fetch-recipients.dto';
import { RecipientPresenter } from '../presenters/recipient-presenter';

@Controller('/recipients')
@ApiTags('Recipients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(@Query() query: FetchRecipientsQueryDto) {
    const { page } = query;

    const result = await this.fetchRecipients.execute({
      page,
    });

    return {
      recipients: result.recipients.map(RecipientPresenter.toHTTP),
    };
  }
}
