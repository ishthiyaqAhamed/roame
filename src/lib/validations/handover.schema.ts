import { z } from "zod";
import { HandoverType } from "../generated/prisma/client";

export const createHandoverSchema = z.object({
  type: z.nativeEnum(HandoverType),
  frontPhotoUrl: z.string().url("Front view photo is required"),
  backPhotoUrl: z.string().url("Rear view photo is required"),
  leftPhotoUrl: z.string().url("Driver side photo is required"),
  rightPhotoUrl: z.string().url("Passenger side photo is required"),
  dashboardPhotoUrl: z.string().url("Dashboard / instrument cluster photo is required").optional(),
  odometerReading: z.number().nonnegative("Odometer reading must be non-negative").optional(),
  fuelLevelPercent: z
    .number()
    .int()
    .min(0, "Fuel percentage cannot be less than 0")
    .max(100, "Fuel percentage cannot exceed 100")
    .optional(),
  notes: z.string().optional(),
});

export const confirmHandoverSchema = z.object({
  handoverId: z.string().uuid("Invalid handover ID"),
});
