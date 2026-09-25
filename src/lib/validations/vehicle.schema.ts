import { z } from "zod";
import {
  VehicleCategory,
  Transmission,
  FuelType,
  PricingMode,
  FuelPolicy,
  InsuranceType,
} from "../generated/prisma/client";

export const createVehicleSchema = z
  .object({
    category: z.nativeEnum(VehicleCategory),
    make: z.string().min(1, "Make is required (e.g. Toyota, Honda, Mercedes-Benz)"),
    model: z.string().min(1, "Model is required (e.g. WagonR, Premio, S-Class, Vespa)"),
    year: z
      .number()
      .int()
      .min(1950, "Year must be valid")
      .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
    plateNumber: z
      .string()
      .min(3, "Plate number is required")
      .transform((val) => val.toUpperCase().trim()),
    transmission: z.nativeEnum(Transmission).optional(),
    fuelType: z.nativeEnum(FuelType).optional(),
    seats: z.number().int().min(1).max(60).optional(),

    // Location
    locationDistrict: z.string().min(2, "District is required (e.g. Colombo, Kandy, Galle)"),
    locationCity: z.string().min(2, "City is required (e.g. Colombo 07, Negombo, Kandy)"),
    locationAddress: z.string().optional(),
    locationLat: z.number().optional(),
    locationLng: z.number().optional(),

    // Pricing
    pricingMode: z.nativeEnum(PricingMode).default(PricingMode.PER_DAY),
    pricePerDay: z.number().positive("Price per day must be positive"),
    kmIncludedPerDay: z.number().int().nonnegative().optional(),
    pricePerExtraKm: z.number().nonnegative().optional(),
    fuelPolicy: z.nativeEnum(FuelPolicy).optional(),
    securityDeposit: z.number().nonnegative("Security deposit must be 0 or positive").default(0),

    // Luxury & Wedding specific
    chauffeurIncluded: z.boolean().optional(),
    decorationAvailable: z.boolean().optional(),
    minimumBookingHours: z.number().int().positive().optional(),

    // Motorbike specific
    helmetsIncluded: z.number().int().nonnegative().optional(),
    engineCC: z.number().int().positive().optional(),
    requiredLicenseClass: z.string().optional(),
    minimumRiderAge: z.number().int().min(18).optional(),

    // Mandatory Compliance Documents & Comprehensive Insurance
    revenueLicenseDocUrl: z.string().url("Revenue license document URL is required"),
    vehicleRegistrationDocUrl: z.string().url("Vehicle registration document URL is required"),
    insuranceDocUrl: z.string().url("Comprehensive insurance document URL is required"),
    insuranceExpiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Valid insurance expiry date is required",
    }),
    insuranceType: z.nativeEnum(InsuranceType, {
      message: "Insurance type is mandatory",
    }),

    // Photos
    photos: z
      .array(z.string().url("Each photo must be a valid URL"))
      .min(3, "Please provide at least 3 high-quality photos of the vehicle"),
  })
  .refine(
    (data) => {
      // Hard rule: Insurance type MUST be COMPREHENSIVE
      return data.insuranceType === InsuranceType.COMPREHENSIVE;
    },
    {
      message:
        "Roame strictly requires COMPREHENSIVE insurance to protect owners and renters. Third-party insurance is not permitted.",
      path: ["insuranceType"],
    }
  )
  .refine(
    (data) => {
      // Check that insurance has not already expired
      const expiry = new Date(data.insuranceExpiryDate);
      return expiry > new Date();
    },
    {
      message: "Insurance policy has expired. Please provide a currently active insurance policy.",
      path: ["insuranceExpiryDate"],
    }
  );

export const searchVehiclesSchema = z.object({
  category: z.nativeEnum(VehicleCategory).optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  transmission: z.nativeEnum(Transmission).optional(),
  fuelType: z.nativeEnum(FuelType).optional(),
  chauffeurIncluded: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
