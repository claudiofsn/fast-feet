import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { App } from 'supertest/types';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { UserFactory } from 'test/factories/make-user';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/domain/enterprise/entities/user';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-order';

describe('Create Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, UserFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /orders/:id/waiting', async () => {
    const user = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    /**
     * Cria entrega com dados populados, simulando uma ordem que já saiu para entrega
     */
    const target = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      product: 'Product 01',
      deliverymanId: user.id,
      startDate: new Date(),
    });

    await request(app.getHttpServer() as string | App)
      .patch(`/orders/${target.id.toString()}/waiting`)
      .set('Authorization', `Bearer ${accessToken}`);

    const targetInDb = await prisma.order.findFirst({
      where: {
        id: target.id.toString(),
      },
    });

    /**
     * Limpa os dados, deixando a ordem disponivel para retirada novamente
     */
    expect(targetInDb).toEqual(
      expect.objectContaining({
        deliverymanId: null,
        startDate: null,
        endDate: null,
        signatureId: null,
        canceladedAt: null,
      }),
    );

    expect(targetInDb?.updatedAt).toBeInstanceOf(Date);
  });
});
