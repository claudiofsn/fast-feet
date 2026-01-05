import { defineConfig } from '@prisma/config';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined. Please check your .env file.');
}

export default defineConfig({
  datasource: {
    url: dbUrl,
  },
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
    path: './prisma/migrations',
  },
});
