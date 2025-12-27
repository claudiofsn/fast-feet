import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  zipCode: z.string().length(8),
  street: z.string(),
  number: z.string(),
  complement: z.string().nullable().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string().length(2),
});

export class EditRecipientDto extends createZodDto(editRecipientBodySchema) {}
