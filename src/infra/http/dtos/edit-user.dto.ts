import { UserRole } from '@/domain/enterprise/entities/user';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const editUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  roles: z.array(z.enum(UserRole)).optional(),
  cpf: z.string().length(11).describe('CPF apenas números').optional(),
});

export class EditUserDto extends createZodDto(editUserBodySchema) {}
