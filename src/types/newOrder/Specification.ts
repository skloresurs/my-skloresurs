import { z } from "zod";

const specificationSchema = z
  .object({
    type: z.string().nullable(),
    nomenclature: z.string().nullable(),
    edgeProcessing: z.string().nullable(),
    facet: z.string().nullable(),
    paint: z.string().nullable(),
    emalitFilm: z.string().nullable(),
    hardening: z.string().nullable(),
    gasFilling: z.string().nullable(),
    coatingType: z.string().nullable(),
    sandBlaster: z.string().nullable(),
    hydrofob: z.boolean(),
    hst: z.boolean(),

    tempAllowHardening: z.boolean(),
    tempRequireHardening: z.boolean(),
    tempRequireEdgeProcessing: z.boolean(),
  })
  .strict()
  .refine((data) => data.type, { message: "Тип обов`язковий", path: ["type"] })
  .refine((data) => data.nomenclature, {
    message: "Номенклатура обов`язкова",
    path: ["nomenclature"],
  })
  .refine((data) => (data.edgeProcessing && data.tempRequireEdgeProcessing) || !data.tempRequireEdgeProcessing, {
    message: "Для цієї номенклатури необхідно обов`язково вказати обробку кромки",
    path: ["edgeProcessing"],
  })
  .refine((data) => (data.hardening && data.tempRequireHardening) || !data.tempRequireHardening, {
    message: "Для цієї номенклатури необхідно обов`язково вказати гартування",
    path: ["hardening"],
  });

type SpecificationSchema = z.infer<typeof specificationSchema>;

const defaultSpecificationData: SpecificationSchema = {
  type: null,
  nomenclature: null,
  edgeProcessing: null,
  facet: null,
  paint: null,
  emalitFilm: null,
  hardening: null,
  gasFilling: null,
  coatingType: null,
  sandBlaster: null,
  hydrofob: false,
  hst: false,

  tempAllowHardening: false,
  tempRequireHardening: false,
  tempRequireEdgeProcessing: false,
};

export default specificationSchema;
export { defaultSpecificationData };
export type { SpecificationSchema };
