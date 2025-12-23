import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';

let prisma: PrismaClient;

function generateDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  return url.toString();
}

const schemaId = randomUUID();

// eslint-disable-next-line @typescript-eslint/require-await
beforeAll(async () => {
  const databaseUrl = generateDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseUrl;

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
  });

  // Aplica as migrations no schema temporário
  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  // Limpa o schema após os testes
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
