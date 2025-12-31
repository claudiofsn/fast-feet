import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { App } from 'supertest/types';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { UserFactory } from 'test/factories/make-user';
import { JwtService } from '@nestjs/jwt';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-order';

describe('Withdraw Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, UserFactory, OrderFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /orders/:id/withdraw', async () => {
    const delivererman = await userFactory.makePrismaUser();

    const accessToken = jwt.sign({
      sub: delivererman.id.toString(),
      roles: delivererman.roles,
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    /**
     * Cria entrega disponivel para retirada
     */
    const target = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: null,
    });

    await request(app.getHttpServer() as string | App)
      .patch(`/orders/${target.id.toString()}/withdraw`)
      .set('Authorization', `Bearer ${accessToken}`);

    const targetInDb = await prisma.order.findFirst({
      where: {
        id: target.id.toString(),
      },
    });

    expect(targetInDb.deliverymanId).toBe(delivererman.id.toString());
    expect(targetInDb.startDate).toBeInstanceOf(Date);
    expect(targetInDb?.updatedAt).toBeInstanceOf(Date);
  });
});
