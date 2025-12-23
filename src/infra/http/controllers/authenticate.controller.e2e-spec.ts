import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
import { DatabaseModule } from '@/infra/database/database.module';
import { hash } from 'bcryptjs';
import { App } from 'supertest/types';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await userFactory.makePrismaUser({
      cpf: '11122233344',
      passwordHash: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer() as string | App)
      .post('/sessions')
      .send({
        cpf: '11122233344',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      access_token: expect.any(String),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refresh_token: expect.any(String),
    });
  });
});
