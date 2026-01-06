import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const fetchOrdersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export class FetchOrdersQueryDto extends createZodDto(fetchOrdersQuerySchema) {}
