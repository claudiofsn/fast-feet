import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { App } from 'supertest/types';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { makeUser, UserFactory } from 'test/factories/make-user';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@/domain/enterprise/entities/user';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';

describe('Change Password (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let bcryptHasher: BcryptHasher;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    bcryptHasher = new BcryptHasher();
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /users/:userId/password', async () => {
    const admin = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      roles: admin.roles,
    });

    const target = await userFactory.makePrismaUser(makeUser());

    const response = await request(app.getHttpServer() as string | App)
      .patch(`/users/${target.id.toString()}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: 'new-password123' });

    expect(response.statusCode).toBe(200);

    const targetInDB = await prisma.user.findFirst({
      where: {
        id: target.id.toString(),
      },
    });

    expect(targetInDB).toBeDefined();

    const isPasswordCorrect = await bcryptHasher.compare(
      'new-password123',
      targetInDB.password,
    );
    expect(isPasswordCorrect).toBe(true);
  });
});
