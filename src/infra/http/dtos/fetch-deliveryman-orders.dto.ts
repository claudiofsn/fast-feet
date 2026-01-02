import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const fetchDeliverymanOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});

export class FetchDeliverymanOrdersQueryDto extends createZodDto(
  fetchDeliverymanOrdersQuerySchema,
) {}
