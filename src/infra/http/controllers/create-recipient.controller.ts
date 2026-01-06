import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateRecipientUseCase } from '@/domain/application/use-cases/create-recipient';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/roles.decorator';
import { UserRole } from '@/domain/enterprise/entities/user';
import { CreateRecipientDto } from '../dtos/create-recipient.dto';

@ApiTags('Recipients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new recipient' })
  @ApiResponse({ status: 201, description: 'Recipient created.' })
  @ApiResponse({ status: 409, description: 'Recipient already exists.' })
  async handle(@Body() body: CreateRecipientDto) {
    const {
      name,
      email,
      zipCode,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
    } = body;

    await this.createRecipient.execute({
      name,
      email,
      zipCode,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
    });
  }
}
