import { z } from 'zod';

const glassSchema = z.object({
  category: z.string().refine((val) => val === 'glass'),
  coating: z.string(),
  edge: z.string(),
  facet: z.number(),
  nomenclature: z.string(),
  sandblast: z.string(),
  thickness: z.number(),
  type: z.string(),
});

const filmSchema = z.object({
  category: z.string().refine((val) => val === 'film'),
  type: z.string(),
});

const cameraSchema = z.object({
  category: z.string().refine((val) => val === 'camera'),
  gas: z.string(),
  nomenclature: z.string(),
  thickness: z.number(),
  type: z.string(),
});

export type IGlass = z.infer<typeof glassSchema>;
export type IFilm = z.infer<typeof filmSchema>;
export type ICamera = z.infer<typeof cameraSchema>;

export { cameraSchema, filmSchema, glassSchema };
