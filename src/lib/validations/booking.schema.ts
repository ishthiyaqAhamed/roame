import { z } from "zod";

export const createBookingSchema = z
  .object({
    vehicleId: z.string().uuid("Invalid vehicle ID"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Valid start date is required",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Valid end date is required",
    }),
    pickupLocation: z.string().min(2, "Pickup location is required"),
    returnLocation: z.string().min(2, "Return location is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const respondBookingSchema = z.object({
  action: z.enum(["ACCEPT", "DECLINE"]),
  reason: z.string().optional(),
});
