import { RegisterDelivererUseCase } from '@/domain/application/use-cases/register-deliverer';
import { Module } from '@nestjs/common';
import { CreateDelivererController } from './create-deliverer.controller';
import { EditDelivererController } from './edit-deliverer.controller';
import { FetchDeliverersController } from './fetch-deliverers.controller';
import { EditUserUseCase } from '@/domain/application/use-cases/edit-user';
import { FetchDeliverersUseCase } from '@/domain/application/use-cases/fetch-deliverers';

@Module({
  controllers: [
    CreateDelivererController,
    EditDelivererController,
    FetchDeliverersController,
  ],
  providers: [
    RegisterDelivererUseCase,
    EditUserUseCase,
    FetchDeliverersUseCase,
  ],
})
export class ControllersModule {}
