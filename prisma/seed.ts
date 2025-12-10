import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Limpeza
  await prisma.user.deleteMany();
  console.log('🧹 Database cleaned');

  const passwordHash = await hash('123456', 8);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@fastfeet.com',
      cpf: '11111111111',
      password: passwordHash,
      roles: [UserRole.ADMIN],
    },
  });

  const deliverers = Array.from({ length: 10 }).map(() => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      password: passwordHash,
      roles: [UserRole.DELIVERER],
    };
  });

  await prisma.user.createMany({
    data: deliverers,
  });

  console.log('🌱 Database seeded successfully!');
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
