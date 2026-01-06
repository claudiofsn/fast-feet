import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
});

export class CreateRecipientDto extends createZodDto(
  createRecipientBodySchema,
) {}
