import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { Env } from '@/infra/env/env';
import { UserRole } from '@/domain/enterprise/entities/user';

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  roles: z.array(z.enum(UserRole)),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['HS256'], // Use 'RS256' se estiver usando chaves RSA reais
    });
  }

  validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
