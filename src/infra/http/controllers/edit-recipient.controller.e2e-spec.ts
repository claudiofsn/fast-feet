import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { App } from 'supertest/types';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { RecipientFactory } from 'test/factories/make-recipient';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/domain/enterprise/entities/user';
import { UserFactory } from 'test/factories/make-user';

describe.only('Edit Recipient (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, RecipientFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    recipientFactory = moduleRef.get(RecipientFactory);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /recipient', async () => {
    const user = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const recipient = await recipientFactory.makePrismaRecipient();

    const newData = {
      name: 'John Doe',
      email: 'jhon.doe@example.com',
      zipCode: '12345678',
      street: 'Rua Exemplo',
      number: '123',
      complement: null,
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
    };

    const response = await request(app.getHttpServer() as string | App)
      .put('/recipients/' + recipient.id.toString())
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...newData,
      });

    expect(response.statusCode).toBe(204);

    const recipientsInDB = await prisma.recipient.findFirst({
      where: {
        id: recipient.id.toString(),
      },
    });
    expect(recipientsInDB).toBeDefined();
    expect(recipientsInDB).toEqual(
      expect.objectContaining({
        ...newData,
      }),
    );
  });
});
