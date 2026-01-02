import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/infra/auth/auth.module';
import { EnvModule } from '@/infra/env/env.module';
import { envSchema } from '@/infra/env/env';
import { DatabaseModule } from './infra/database/database.module';
import { ControllersModule } from './infra/http/controllers/controllers.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
    DatabaseModule,
    ControllersModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
