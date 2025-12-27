import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user';
import { Module } from '@nestjs/common';
import { CreateUserController } from './create-user.controller';
import { EditUserController } from './edit-user.controller';
import { FetchUsersController } from './fetch-users.controller';
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user';
import { FetchUsersUseCase } from '@/domain/application/use-cases/fetch-users';
import { AuthenticateController } from './authenticate.controller';
import { RefreshTokenController } from './refresh-token.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { RefreshTokenUseCase } from '@/domain/application/use-cases/refresh-token';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { AuthModule } from '@/infra/auth/auth.module';
import { CreateRecipientController } from './create-recipient.controller';
import { CreateRecipientUseCase } from '@/domain/application/use-cases/create-recipient';
import { DeleteUserUseCase } from '@/domain/application/use-cases/delete-user';
import { DeleteUserController } from './delete-user.controller';
import { FetchRecipientsController } from './fetch-recipients.controller';
import { FetchRecipientsUseCase } from '@/domain/application/use-cases/fetch-recipients';
import { EditRecipientController } from './edit-recipient.controller';
import { EditRecipientUseCase } from '@/domain/application/use-cases/edit-recipient';
import { DeleteRecipientController } from './delete-recipient.controller';
import { DeleteRecipientUseCase } from '@/domain/application/use-cases/delete-recipient';

@Module({
  controllers: [
    CreateUserController,
    EditUserController,
    FetchUsersController,
    AuthenticateController,
    RefreshTokenController,
    DeleteUserController,
    CreateRecipientController,
    FetchRecipientsController,
    EditRecipientController,
    DeleteRecipientController,
  ],
  providers: [
    RegisterUserUseCase,
    EditUserUseCase,
    FetchUsersUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    JwtAuthGuard,
    RolesGuard,
    DeleteUserUseCase,
    CreateRecipientUseCase,
    FetchRecipientsUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
  ],
  imports: [AuthModule, DatabaseModule, CryptographyModule],
})
export class ControllersModule {}
