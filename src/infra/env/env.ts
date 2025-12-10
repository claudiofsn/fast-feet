import { z } from 'zod';

export const envSchema = z.object({
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
