import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FetchRecipientsUseCase } from '@/domain/application/use-cases/fetch-recipients';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { FetchRecipientsQueryDto } from '../dtos/fetch-recipients.dto';
import { RecipientPresenter } from '../presenters/recipient-presenter';

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Fetch recipients',
    description: 'Lists recipients with pagination. **Only admins**.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number to retrieve. Defaults to 1.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Recipients list retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can access this resource.',
  })
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
