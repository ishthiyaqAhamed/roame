import { z } from "zod";

export const createDamageClaimSchema = z.object({
  damageDescription: z.string().min(10, "Please describe the damage in detail (at least 10 characters)"),
  evidencePhotos: z
    .array(z.string().url("Evidence photo must be a valid URL"))
    .min(1, "Please provide at least one photo of the damage"),
  estimatedRepairCost: z.number().positive("Estimated repair cost must be greater than zero"),
  insuranceExcessAmount: z.number().positive("Insurance excess / deductible amount must be greater than zero"),
});

export const respondClaimSchema = z.object({
  action: z.enum(["ACCEPT_EXCESS", "REQUEST_MEDIATION"]),
  notes: z.string().optional(),
});
