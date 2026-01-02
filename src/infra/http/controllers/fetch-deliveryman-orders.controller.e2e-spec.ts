/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Deliveryman Orders (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /deliveries', async () => {
    const deliveryman = await userFactory.makePrismaUser();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      roles: deliveryman.roles,
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    });

    await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    });

    const otherDeliveryman = await userFactory.makePrismaUser();
    await orderFactory.makePrismaOrder({
      deliverymanId: otherDeliveryman.id,
      recipientId: recipient.id,
    });

    const response = await request(app.getHttpServer() as string | App)
      .get('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.orders).toHaveLength(2);
    expect(response.body.orders).toEqual([
      expect.objectContaining({ deliverymanId: deliveryman.id.toString() }),
      expect.objectContaining({ deliverymanId: deliveryman.id.toString() }),
    ]);
  });
});
