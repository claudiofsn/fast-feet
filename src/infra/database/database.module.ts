import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { RecipientsRepository } from '@/domain/application/repositories/recipients-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';
import { OrdersRepository } from '@/domain/application/repositories/orders-repository';
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, RecipientsRepository],
})
export class DatabaseModule {}
