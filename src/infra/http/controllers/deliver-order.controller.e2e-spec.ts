import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';
import { UserFactory } from 'test/factories/make-user';

describe('Deliver Order', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let orderFactory: OrderFactory;
  let attachmentFactory: AttachmentFactory;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PrismaService,
        RecipientFactory,
        UserFactory,
        OrderFactory,
        AttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    recipientFactory = moduleRef.get(RecipientFactory);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    orderFactory = moduleRef.get(OrderFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  test('[PATCH] /orders/:id/deliver', async () => {
    const deliveryman = await userFactory.makePrismaUser();
    const recipient = await recipientFactory.makePrismaRecipient();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      roles: deliveryman.roles,
    });

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
      startDate: new Date(),
    });

    const signature = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer() as string | App)
      .patch(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId: signature.id.toString(),
      });

    expect(response.statusCode).toBe(204);

    const orderInDB = await prisma.order.findFirst({
      where: {
        id: order.id.toString(),
      },
    });

    expect(orderInDB?.endDate).toBeInstanceOf(Date);
    expect(orderInDB?.signatureId).toBe(signature.id.toString());
  });
});
