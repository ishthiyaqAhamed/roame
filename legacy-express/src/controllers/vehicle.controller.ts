import { Response } from "express";
import { prisma } from "../db";
import { AuthRequest } from "../middleware/auth.middleware";
import { toJsonArray, fromJsonArray } from "../utils/json-array";

export async function createVehicle(req: AuthRequest, res: Response) {
  try {
    const {
      category,
      make,
      model,
      year,
      plateNumber,
      transmission,
      fuelType,
      locationLat,
      locationLng,
      locationDistrict,
      pricingMode,
      pricePerDay,
      kmIncludedPerDay,
      pricePerExtraKm,
      fuelPolicy,
      chauffeurIncluded,
      decorationAvailable,
      minimumBookingHours,
      helmetsIncluded,
      engineCC,
      requiredLicenseClass,
      minimumRiderAge,
      insuranceType,
      insuranceExpiryDate,
      baselinePhotos,
    } = req.body;

    if (!category || !make || !model || !year || !plateNumber || !pricingMode) {
      return res.status(400).json({
        error: "category, make, model, year, plateNumber, and pricingMode are required",
      });
    }

    if (insuranceType !== "COMPREHENSIVE") {
      return res.status(400).json({
        error: "Only vehicles with comprehensive insurance can be listed on Roame",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId: req.userId!,
        category,
        make,
        model,
        year,
        plateNumber,
        transmission,
        fuelType,
        locationLat,
        locationLng,
        locationDistrict,
        pricingMode,
        pricePerDay,
        kmIncludedPerDay,
        pricePerExtraKm,
        fuelPolicy,
        chauffeurIncluded,
        decorationAvailable,
        minimumBookingHours,
        helmetsIncluded,
        engineCC,
        requiredLicenseClass,
        minimumRiderAge,
        insuranceType,
        insuranceExpiryDate: insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
        baselinePhotosJson: toJsonArray(baselinePhotos),
      },
    });

    res.status(201).json({
      message: "Vehicle listed successfully and is pending review",
      vehicle: {
        ...vehicle,
        baselinePhotos: fromJsonArray(vehicle.baselinePhotosJson),
      },
    });
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ error: "Something went wrong while listing the vehicle" });
  }
}

export async function listVehicles(req: AuthRequest, res: Response) {
  try {
    const { category, district } = req.query;

    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category: category as any } : {}),
        ...(district ? { locationDistrict: district as string } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const result = vehicles.map((v) => ({
      ...v,
      baselinePhotos: fromJsonArray(v.baselinePhotosJson),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("List vehicles error:", error);
    res.status(500).json({ error: "Something went wrong while fetching vehicles" });
  }
}