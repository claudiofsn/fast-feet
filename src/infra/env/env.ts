import { z } from 'zod';

export const envSchema = z.object({
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DATABASE_URL: z.string(),
  CLOUD_FLARE_ACCOUNT_ID: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;
