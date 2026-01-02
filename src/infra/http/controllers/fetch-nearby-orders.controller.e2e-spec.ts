import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { App } from 'supertest/types';
import { RecipientFactory } from 'test/factories/make-recipient';
import { JwtService } from '@nestjs/jwt';
import { UserFactory } from 'test/factories/make-user';
import { OrderFactory } from 'test/factories/make-order';

describe('Fetch Nearby Orders (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, UserFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    recipientFactory = moduleRef.get(RecipientFactory);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    orderFactory = moduleRef.get(OrderFactory);

    await app.init();
  });

  test('[GET] /orders/nearby', async () => {
    const deliveryman = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      roles: deliveryman.roles,
    });

    const recipient1 = await recipientFactory.makePrismaRecipient();
    const recipient2 = await recipientFactory.makePrismaRecipient();

    await orderFactory.makePrismaOrder({
      latitude: -23.5,
      longitude: -46.6,
      recipientId: recipient1.id,
    });

    await orderFactory.makePrismaOrder({
      latitude: -27.0,
      longitude: -48.0,
      recipientId: recipient2.id,
    });

    const response = await request(app.getHttpServer() as string | App)
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ latitude: -23.51, longitude: -46.61 });

    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.orders).toHaveLength(1);
  });
});
