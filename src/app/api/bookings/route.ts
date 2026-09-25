import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createBookingSchema } from "@/lib/validations/booking.schema";
import {
  VerificationStatus,
  VehicleCategory,
  BookingStatus,
  VehicleStatus,
} from "@/lib/generated/prisma/client";

// Generate clean luxury reference number e.g. ROAME-7K9X2
function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "ROAME-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// Get bookings for current user (as customer or as owner)
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const roleView = searchParams.get("view") || "customer"; // "customer" or "owner"

    const where =
      roleView === "owner" ? { ownerId: user.id } : { customerId: user.id };

    const bookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            plateNumber: true,
            category: true,
            photos: true,
            locationCity: true,
            locationDistrict: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
            phoneNumber: true,
          },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
            phoneNumber: true,
          },
        },
        handovers: true,
        damageClaim: true,
      },
    });

    return jsonSuccess({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return jsonError("Internal server error", 500);
  }
}

// Create a new booking request
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    if (user.isBlacklisted) {
      return jsonError("Account is suspended from creating bookings", 403);
    }

    // 1. HARD RULE: Customer must be VERIFIED
    if (user.verificationStatus !== VerificationStatus.VERIFIED) {
      return jsonError(
        "Identity verification required: Your profile must be approved before you can book vehicles on Roame. Please complete your verification profile.",
        403
      );
    }

    const body = await req.json();
    const parseResult = createBookingSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { vehicleId, startDate, endDate, pickupLocation, returnLocation } = parseResult.data;

    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle || vehicle.status !== VehicleStatus.ACTIVE) {
      return jsonError("This vehicle is currently unavailable for booking", 400);
    }

    // Prevent owner from booking their own vehicle
    if (vehicle.ownerId === user.id) {
      return jsonError("You cannot book your own vehicle", 400);
    }

    // 2. HARD RULE: Check Driving License for self-drive categories
    if (
      vehicle.category === VehicleCategory.CAR_VAN ||
      vehicle.category === VehicleCategory.MOTORBIKE
    ) {
      if (!user.drivingLicenseNumber) {
        return jsonError(
          "A verified driving license is mandatory for self-drive rentals. Please update your profile.",
          403
        );
      }
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate days (minimum 1 day)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const pricePerDay = vehicle.pricePerDay || 0;
    const totalPrice = totalDays * pricePerDay;
    const securityDeposit = vehicle.securityDeposit || 0;

    // Check for conflicting active bookings
    const overlappingBooking = await db.booking.findFirst({
      where: {
        vehicleId,
        status: {
          in: [
            BookingStatus.ACCEPTED,
            BookingStatus.PICKUP_INSPECTION,
            BookingStatus.ACTIVE,
            BookingStatus.RETURN_INSPECTION,
          ],
        },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return jsonError("This vehicle is already reserved for the selected dates", 409);
    }

    // 6-hour owner response deadline
    const ownerResponseDeadline = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const booking = await db.booking.create({
      data: {
        bookingReference: generateBookingReference(),
        customerId: user.id,
        ownerId: vehicle.ownerId,
        vehicleId: vehicle.id,
        startDate: start,
        endDate: end,
        pickupLocation,
        returnLocation,
        totalDays,
        totalPrice,
        securityDeposit,
        status: BookingStatus.REQUESTED,
        ownerResponseDeadline,
      },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            photos: true,
          },
        },
      },
    });

    return jsonSuccess(
      { booking },
      "Booking request sent to owner. The owner has 6 hours to respond.",
      201
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return jsonError("Internal server error during booking creation", 500);
  }
}
