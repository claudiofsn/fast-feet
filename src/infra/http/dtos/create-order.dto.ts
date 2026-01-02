import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createOrderBodySchema = z.object({
  recipientId: z.uuid(),
  product: z.string().min(1),
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90, {
    message: 'Latitude deve estar entre -90 e 90',
  }),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
    message: 'Longitude deve estar entre -180 e 180',
  }),
});

export class CreateOrderDto extends createZodDto(createOrderBodySchema) {}
