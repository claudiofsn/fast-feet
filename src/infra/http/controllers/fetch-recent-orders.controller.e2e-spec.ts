import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { App } from 'supertest/types';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { makeRecipient, RecipientFactory } from 'test/factories/make-recipient';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/domain/enterprise/entities/user';
import { UserFactory } from 'test/factories/make-user';
import { OrderFactory } from 'test/factories/make-order';

describe('Fetch Recipients (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;

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

  test('[GET] /orders', async () => {
    const user = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const recipient =
      await recipientFactory.makePrismaRecipient(makeRecipient());

    for (let i = 0; i < 3; i++) {
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
      });
    }

    const response = await request(app.getHttpServer() as string | App)
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    const ordersInDb = await prisma.order.findMany();
    expect(ordersInDb).toHaveLength(3);
    expect(ordersInDb[0].recipientId).toBe(recipient.id.toString());
  });
});
