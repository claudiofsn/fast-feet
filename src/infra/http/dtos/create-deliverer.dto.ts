import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createDelivererBodySchema = z.object({
  name: z.string().describe('Nome completo do entregador'),
  cpf: z.string().length(11).describe('CPF apenas números'),
  email: z.email().describe('Endereço de e-mail válido'),
  password: z.string().min(6).describe('Senha com no mínimo 6 caracteres'),
});

export class CreateDelivererDto extends createZodDto(
  createDelivererBodySchema,
) {}
