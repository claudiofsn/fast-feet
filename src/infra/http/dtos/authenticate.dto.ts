import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

export class AuthenticateDto extends createZodDto(authenticateBodySchema) {}
