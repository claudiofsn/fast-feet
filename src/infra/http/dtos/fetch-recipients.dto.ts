import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const fetchRecipientsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export class FetchRecipientsQueryDto extends createZodDto(
  fetchRecipientsQuerySchema,
) {}
