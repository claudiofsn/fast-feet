import { RegisterDelivererUseCase } from '@/domain/application/use-cases/register-deliverer';
import { Module } from '@nestjs/common';
import { CreateDelivererController } from './create-deliverer.controller';
import { EditDelivererController } from './edit-deliverer.controller';
import { FetchDeliverersController } from './fetch-deliverers.controller';
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user';
import { FetchDeliverersUseCase } from '@/domain/application/use-cases/fetch-deliverers';
import { AuthenticateController } from './authenticate.controller';
import { RefreshTokenController } from './refresh-token.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { RefreshTokenUseCase } from '@/domain/application/use-cases/refresh-token';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { AuthModule } from '@/infra/auth/auth.module';

@Module({
  controllers: [
    CreateDelivererController,
    EditDelivererController,
    FetchDeliverersController,
    AuthenticateController,
    RefreshTokenController,
  ],
  providers: [
    RegisterDelivererUseCase,
    EditUserUseCase,
    FetchDeliverersUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    JwtAuthGuard,
    RolesGuard,
  ],
  imports: [AuthModule, DatabaseModule, CryptographyModule],
})
export class ControllersModule {}
