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
import { CreateOrderController } from './create-order.controller';
import { CreateOrderUseCase } from '@/domain/application/use-cases/create-order';
import { FetchRecentOrdersUseCase } from '@/domain/application/use-cases/fetch-recent-orders';
import { FetchRecentOrdersController } from './fetch-recent-orders.controller';
import { ChangePasswordController } from './change-password.controller';
import { ChangeUserPasswordUseCase } from '@/domain/application/use-cases/change-user-password';
import { MarkOrderAsWaitingController } from './mark-order-as-waiting.controller';
import { MarkOrderAsWaitingUseCase } from '@/domain/application/use-cases/mark-order-as-waiting';
import { WithdrawOrderController } from './withdraw-order.controller';
import { WithdrawOrderUseCase } from '@/domain/application/use-cases/withdraw-order';
import { StorageModule } from '@/infra/storage/storage.module';
import { UploadAttachmentController } from './upload-attachment.controller';
import { UploadAndCreateAttachmentUseCase } from '@/domain/application/use-cases/upload-and-create-attachment';

@Module({
  controllers: [
    CreateUserController,
    ChangePasswordController,
    EditUserController,
    FetchUsersController,
    AuthenticateController,
    RefreshTokenController,
    DeleteUserController,
    CreateRecipientController,
    FetchRecipientsController,
    EditRecipientController,
    DeleteRecipientController,
    CreateOrderController,
    FetchRecentOrdersController,
    MarkOrderAsWaitingController,
    WithdrawOrderController,
    UploadAttachmentController,
  ],
  providers: [
    RegisterUserUseCase,
    ChangeUserPasswordUseCase,
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
    CreateOrderUseCase,
    FetchRecentOrdersUseCase,
    MarkOrderAsWaitingUseCase,
    WithdrawOrderUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
  imports: [AuthModule, DatabaseModule, CryptographyModule, StorageModule],
})
export class ControllersModule {}
