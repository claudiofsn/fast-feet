import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserFactory } from 'test/factories/make-user';
import { Uploader } from '@/domain/application/storage/uploader';
import { FakeUploader } from 'test/storage/fake-uploader';
import { AppModule } from '@/app.module';
import { App } from 'supertest/types';

describe('Upload Attachment (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    })
      .overrideProvider(Uploader)
      .useClass(FakeUploader)
      .compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /attachments', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      roles: user.roles,
    });

    const response: { statusCode: number; body: { attachmentId: string } } =
      await request(app.getHttpServer() as string | App)
        .post('/attachments')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', './test/e2e/test-attachment.jpg');

    expect(response.statusCode).toBe(201);
    expect(response.body.attachmentId).toEqual(expect.any(String));

    const attachmentOnDatabase = await prisma.attachment.findFirst({
      where: {
        id: response.body.attachmentId,
      },
    });

    expect(attachmentOnDatabase).toBeTruthy();
    // expect(attachmentOnDatabase?.title).toBe('image.png');
  });
});
