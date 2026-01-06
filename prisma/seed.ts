import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

function instacePrisma() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

async function seed() {
  console.log('Iniciando seed...');

  const prisma = instacePrisma();

  async function cleanDatabase() {
    await prisma.order.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.recipient.deleteMany();
    await prisma.user.deleteMany();
  }

  await cleanDatabase();

  const hashedPassword = await hash('123456', 8);

  await prisma.user.upsert({
    where: { email: 'admin@fastfeet.com' },
    update: {},
    create: {
      name: 'Admin Recrutador',
      email: 'admin@fastfeet.com',
      password: hashedPassword,
      roles: [UserRole.ADMIN],
      cpf: '00011122233',
    },
  });

  const deliveryman = await prisma.user.create({
    data: {
      name: 'Entregador Ninja',
      email: 'ninja@fastfeet.com',
      cpf: '55566677788',
      password: hashedPassword,
      roles: [UserRole.DELIVERER],
    },
  });

  const recipient = await prisma.recipient.create({
    data: {
      name: 'Portaria Residencial Horizonte',
      email: faker.internet.email(),
      neighborhood: 'Bela Vista',
      street: 'Av. Paulista',
      number: '1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
  });

  const baseOrder = {
    recipientId: recipient.id,
    latitude: -23.56168,
    longitude: -46.65591,
  };

  const signatureId = await prisma.attachment.create({
    data: {
      title: 'Seed Signature',
      url: 'teste',
      id: 'teste',
    },
  });

  const ordersToCreate = [
    {
      ...baseOrder,
      product: 'iPhone 15 Pro Max',
    },
    {
      ...baseOrder,
      product: 'Monitor Gamer 240Hz',
      deliverymanId: deliveryman.id.toString(),
      startDate: new Date(),
      // Status: Retirada / Em Trânsito
    },
    {
      ...baseOrder,
      product: 'Cadeira Ergonômica',
      deliverymanId: deliveryman.id,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(),
      signatureId: signatureId.id,
      // Status: Entregue
    },
    {
      ...baseOrder,
      product: 'Teclado Mecânico Custom',
      canceladedAt: new Date(),
      // Status: Cancelado / Devolvido
    },
  ];

  for (const orderData of ordersToCreate) {
    await prisma.order.create({ data: orderData });
  }

  console.log('✅ Massa de testes "Fast Feet" gerada com sucesso!');
}

seed()
  .then(() => {
    console.log('🚀 Seed finalizado com sucesso.');
  })
  .catch((e) => {
    console.error('❌ Erro durante a execução do Seed:');
    console.error(e);
    process.exit(1);
  });
