import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createOrderBodySchema = z.object({
  product: z.string().min(1),
});

export class CreateOrderDto extends createZodDto(createOrderBodySchema) {}
