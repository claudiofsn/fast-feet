import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { Env } from '@/infra/env/env';

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  roles: z.array(z.enum(['ADMIN', 'DELIVERER'])).optional(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
