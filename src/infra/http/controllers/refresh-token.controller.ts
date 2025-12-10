import { Body, Controller, Patch, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenUseCase } from '@/domain/application/use-cases/refresh-token';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { Public } from '@/infra/auth/public.decorator';

@ApiTags('Auth')
@Controller('/token/refresh')
@Public()
export class RefreshTokenController {
  constructor(private refreshToken: RefreshTokenUseCase) {}

  @Patch()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens renewed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async handle(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body;

    try {
      const result = await this.refreshToken.execute({
        refreshToken,
      });

      return {
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
