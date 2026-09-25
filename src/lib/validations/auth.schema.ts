import { z } from "zod";
import { UserRole, Language } from "../generated/prisma/client";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phoneNumber: z
    .string()
    .regex(/^(\+94|0)[0-9]{9}$/, "Please provide a valid Sri Lankan phone number (e.g., +94771234567 or 0771234567)")
    .optional(),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
  preferredLanguage: z.nativeEnum(Language).default(Language.EN),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const kycVerificationSchema = z.object({
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  nicNumber: z
    .string()
    .min(10, "NIC number must be at least 10 characters")
    .max(12, "NIC number cannot exceed 12 characters"),
  nicFrontUrl: z.string().url("NIC front photo URL is required"),
  nicBackUrl: z.string().url("NIC back photo URL is required"),
  drivingLicenseNumber: z.string().optional(),
  drivingLicenseFrontUrl: z.string().url("Driving license front URL must be a valid URL").optional(),
  drivingLicenseBackUrl: z.string().url("Driving license back URL must be a valid URL").optional(),
  profilePhotoUrl: z.string().url("Profile photo URL must be a valid URL").optional(),
});
