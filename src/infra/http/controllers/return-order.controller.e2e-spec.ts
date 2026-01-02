import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';
import { UserFactory } from 'test/factories/make-user';

describe('Return Order', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, RecipientFactory, UserFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    recipientFactory = moduleRef.get(RecipientFactory);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    orderFactory = moduleRef.get(OrderFactory);

    await app.init();
  });

  test('[PATCH] /orders/:id/return', async () => {
    const deliveryman = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      roles: deliveryman.roles,
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
      startDate: new Date(), // Simula que já foi retirada
    });

    const response = await request(app.getHttpServer() as string | App)
      .patch(`/orders/${order.id.toString()}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const orderInDB = await prisma.order.findFirst({
      where: { id: order.id.toString() },
    });

    expect(orderInDB?.canceladedAt).toBeInstanceOf(Date);
    expect(orderInDB.deliverymanId).toEqual(deliveryman.id.toString());
  });
});
