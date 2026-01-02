import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const fetchNearbyOrdersQuerySchema = z.object({
  latitude: z.coerce.number().refine((val) => Math.abs(val) <= 90),
  longitude: z.coerce.number().refine((val) => Math.abs(val) <= 180),
});

export class FetchNearbyOrdersDto extends createZodDto(
  fetchNearbyOrdersQuerySchema,
) {}
