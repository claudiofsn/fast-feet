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
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { Roles } from '@/infra/auth/roles.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { UserRole } from '@/domain/enterprise/entities/user';
import { CreateUserDto } from '../dtos/create-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  async handle(@Body() body: CreateUserDto) {
    const { name, email, cpf, password, roles } = body;

    try {
      await this.registerUser.execute({
        name,
        email,
        cpf,
        password,
        roles,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
