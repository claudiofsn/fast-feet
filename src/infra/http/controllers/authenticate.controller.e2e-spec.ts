import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        cpf: '11122233344',
        password: await hash('123456', 8),
        roles: ['ADMIN'],
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
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
