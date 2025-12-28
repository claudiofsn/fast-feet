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

describe('Create Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /orders', async () => {
    const user = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const response = await request(app.getHttpServer() as string | App)
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        zipCode: '12345678',
        street: 'Main Street',
        number: '123',
        complement: 'Apt 4B',
        neighborhood: 'Downtown',
        city: 'New York',
        state: 'NY',
      });

    expect(response.statusCode).toBe(201);

    const ordersInDb = await prisma.order.findMany();
    expect(ordersInDb).toHaveLength(1);
    expect(ordersInDb[0].email).toBe('john.doe@example.com');
  });

  test('[POST] /orders - Unauthorized', async () => {
    const user = await userFactory.makePrismaUser(); // DEFAULT ROLE IS DELIVERYMAN

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const response = await request(app.getHttpServer() as string | App)
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe 2',
        email: 'john.doe@example.com',
        zipCode: '12345678',
        street: 'Main Street',
        number: '123',
        complement: 'Apt 4B',
        neighborhood: 'Downtown',
        city: 'New York',
        state: 'NY',
      });

    expect(response.statusCode).toBe(403);

    const ordersInDb = await prisma.order.findFirst({
      where: { name: 'John Doe 2' },
    });

    expect(ordersInDb).toBeNull();
  });
});
