import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const fetchOrdersQuerySchema = z.object({
  page: z.coerce // Coerce força a conversão do input (string da URL) para o tipo abaixo
    .number()
    .min(1)
    .optional()
    .default(1), // Se não enviar nada, assume página 1
});

export class FetchOrdersQueryDto extends createZodDto(fetchOrdersQuerySchema) {}
