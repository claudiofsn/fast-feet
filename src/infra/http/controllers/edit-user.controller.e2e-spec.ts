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

describe('Edit User (E2E)', () => {
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

  test('[PUT] /user', async () => {
    const user = await userFactory.makePrismaUser({
      roles: [UserRole.ADMIN],
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const userToEdit = await userFactory.makePrismaUser();

    const response = await request(app.getHttpServer() as string | App)
      .put('/users/' + userToEdit.id.toString())
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'jhon.doe@example.com',
        roles: [UserRole.ADMIN],
        cpf: '12345678900',
      });

    expect(response.statusCode).toBe(204);

    const usersInDB = await prisma.user.findFirst({
      where: {
        id: userToEdit.id.toString(),
      },
    });
    expect(usersInDB).toBeDefined();
    expect(usersInDB).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'jhon.doe@example.com',
        cpf: '12345678900',
        roles: [UserRole.ADMIN],
      }),
    );
  });
});
