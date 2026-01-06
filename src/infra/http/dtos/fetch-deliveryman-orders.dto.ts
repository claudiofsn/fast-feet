import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const fetchDeliverymanOrdersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export class FetchDeliverymanOrdersQueryDto extends createZodDto(
  fetchDeliverymanOrdersQuerySchema,
) {}
