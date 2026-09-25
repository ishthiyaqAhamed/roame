import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createVehicleSchema, searchVehiclesSchema } from "@/lib/validations/vehicle.schema";
import { UserRole, VehicleStatus } from "@/lib/generated/prisma/client";

// Public vehicle search & catalog
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parseResult = searchVehiclesSchema.safeParse(queryParams);

    if (!parseResult.success) {
      return jsonError("Invalid query parameters", 400, parseResult.error.flatten().fieldErrors);
    }

    const {
      category,
      district,
      city,
      minPrice,
      maxPrice,
      transmission,
      fuelType,
      chauffeurIncluded,
      page,
      limit,
    } = parseResult.data;

    const skip = (page - 1) * limit;

    // Prisma where filter - only return ACTIVE vehicles in public search
    const where = {
      status: VehicleStatus.ACTIVE,
      ...(category ? { category } : {}),
      ...(district
        ? { locationDistrict: { contains: district, mode: "insensitive" as const } }
        : {}),
      ...(city ? { locationCity: { contains: city, mode: "insensitive" as const } } : {}),
      ...(transmission ? { transmission } : {}),
      ...(fuelType ? { fuelType } : {}),
      ...(chauffeurIncluded !== undefined ? { chauffeurIncluded } : {}),
      ...((minPrice !== undefined || maxPrice !== undefined)
        ? {
            pricePerDay: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    const [vehicles, totalCount] = await Promise.all([
      db.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          category: true,
          make: true,
          model: true,
          year: true,
          plateNumber: true,
          transmission: true,
          fuelType: true,
          seats: true,
          locationDistrict: true,
          locationCity: true,
          locationAddress: true,
          locationLat: true,
          locationLng: true,
          pricingMode: true,
          pricePerDay: true,
          kmIncludedPerDay: true,
          pricePerExtraKm: true,
          fuelPolicy: true,
          securityDeposit: true,
          chauffeurIncluded: true,
          decorationAvailable: true,
          minimumBookingHours: true,
          helmetsIncluded: true,
          engineCC: true,
          requiredLicenseClass: true,
          minimumRiderAge: true,
          photos: true,
          status: true,
          averageRating: true,
          reviewCount: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              fullName: true,
              profilePhotoUrl: true,
              verificationStatus: true,
              createdAt: true,
            },
          },
        },
      }),
      db.vehicle.count({ where }),
    ]);

    return jsonSuccess({
      vehicles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Vehicle search error:", error);
    return jsonError("Internal server error during search", 500);
  }
}

// Protected vehicle creation (Owners only)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
      return jsonError("Only registered vehicle owners can list vehicles on Roame", 403);
    }

    const body = await req.json();
    const parseResult = createVehicleSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation failed", 422, parseResult.error.flatten().fieldErrors);
    }

    const data = parseResult.data;

    // Check if plateNumber already exists in system
    const existingPlate = await db.vehicle.findFirst({
      where: { plateNumber: data.plateNumber },
    });

    if (existingPlate) {
      return jsonError("A vehicle with this license plate number is already listed", 409);
    }

    const vehicle = await db.vehicle.create({
      data: {
        ownerId: user.id,
        category: data.category,
        make: data.make,
        model: data.model,
        year: data.year,
        plateNumber: data.plateNumber,
        transmission: data.transmission,
        fuelType: data.fuelType,
        seats: data.seats,

        locationDistrict: data.locationDistrict,
        locationCity: data.locationCity,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLng: data.locationLng,

        pricingMode: data.pricingMode,
        pricePerDay: data.pricePerDay,
        kmIncludedPerDay: data.kmIncludedPerDay,
        pricePerExtraKm: data.pricePerExtraKm,
        fuelPolicy: data.fuelPolicy,
        securityDeposit: data.securityDeposit,

        chauffeurIncluded: data.chauffeurIncluded,
        decorationAvailable: data.decorationAvailable,
        minimumBookingHours: data.minimumBookingHours,

        helmetsIncluded: data.helmetsIncluded,
        engineCC: data.engineCC,
        requiredLicenseClass: data.requiredLicenseClass,
        minimumRiderAge: data.minimumRiderAge,

        revenueLicenseDocUrl: data.revenueLicenseDocUrl,
        vehicleRegistrationDocUrl: data.vehicleRegistrationDocUrl,
        insuranceDocUrl: data.insuranceDocUrl,
        insuranceExpiryDate: new Date(data.insuranceExpiryDate),
        insuranceType: data.insuranceType,

        photos: data.photos,
        status: VehicleStatus.PENDING_REVIEW, // Requires admin compliance verification
      },
    });

    return jsonSuccess(
      { vehicle },
      "Vehicle listing submitted successfully and is under compliance verification",
      201
    );
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return jsonError("Internal server error during vehicle listing", 500);
  }
}
