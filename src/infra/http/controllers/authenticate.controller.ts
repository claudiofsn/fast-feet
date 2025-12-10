import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { AuthenticateDto } from '../dtos/authenticate.dto';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public.decorator';

@ApiTags('Auth')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate user (Login)' })
  @ApiResponse({ status: 201, description: 'Return access and refresh tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async handle(@Body() body: AuthenticateDto) {
    const { cpf, password } = body;

    try {
      const result = await this.authenticateUser.execute({
        cpf,
        password,
      });

      return {
        access_token: result.accessToken,
        refresh_token: result.refreshToken, // Snake case é padrão comum em JSONs de OAuth
      };
    } catch (error) {
      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
