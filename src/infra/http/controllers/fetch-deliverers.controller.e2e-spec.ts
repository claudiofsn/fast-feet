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

describe('Fetch Deliverers (E2E)', () => {
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

  test('[GET] /deliverers', async () => {
    const user = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    await Promise.all([
      userFactory.makePrismaUser({ email: 'john.doe@example.com' }),
      userFactory.makePrismaUser(),
    ]);

    const response = await request(app.getHttpServer() as string | App)
      .get('/deliverers')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    const deliverersInDb = await prisma.user.findMany({
      where: {
        roles: {
          equals: [UserRole.DELIVERER],
        },
      },
    });
    expect(deliverersInDb).toHaveLength(2);
    expect(deliverersInDb[0].email).toBe('john.doe@example.com');
  });
});
