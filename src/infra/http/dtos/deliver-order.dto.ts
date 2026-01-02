import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const deliverOrderBodySchema = z.object({
  attachmentId: z.uuid(),
});

export class DeliverOrderDto extends createZodDto(deliverOrderBodySchema) {}
