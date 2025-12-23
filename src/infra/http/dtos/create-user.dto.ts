import { UserRole } from '@/domain/enterprise/entities/user';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserBodySchema = z.object({
  name: z.string().describe('Nome completo do usuário'),
  cpf: z.string().length(11).describe('CPF apenas números'),
  email: z.email().describe('Endereço de e-mail válido'),
  password: z.string().min(6).describe('Senha com no mínimo 6 caracteres'),
  roles: z.array(z.enum(UserRole)).optional().describe('Cargos do usuário'),
});

export class CreateUserDto extends createZodDto(createUserBodySchema) {}
