import {
  Body,
  Controller,
  Post,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDelivererUseCase } from '@/domain/application/use-cases/register-deliverer';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { CreateDelivererDto } from '../dtos/create-deliverer.dto';

@ApiTags('Deliverers')
@ApiBearerAuth()
@Controller('/deliverers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateDelivererController {
  constructor(private registerDeliverer: RegisterDelivererUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new deliverer' })
  @ApiResponse({ status: 201, description: 'Deliverer successfully created.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  async handle(@Body() body: CreateDelivererDto) {
    const { name, email, cpf, password } = body;

    try {
      await this.registerDeliverer.execute({
        name,
        email,
        cpf,
        password,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
