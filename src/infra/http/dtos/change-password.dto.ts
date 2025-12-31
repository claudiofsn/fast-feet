import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const changePasswordBodySchema = z.object({
  password: z.string().min(6).describe('Senha com no mínimo 6 caracteres'),
});

export class ChangePasswordDto extends createZodDto(changePasswordBodySchema) {}
