import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const editDelivererBodySchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
});

export class EditDelivererDto extends createZodDto(editDelivererBodySchema) {}
