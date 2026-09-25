import { z } from "zod";
import { FlagReason } from "../generated/prisma/client";

export const createFlagSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID").optional(),
  reason: z.nativeEnum(FlagReason),
  details: z.string().min(10, "Please provide detailed context for this report (at least 10 characters)"),
  evidenceUrl: z.string().url("Evidence URL must be a valid URL").optional(),
});
