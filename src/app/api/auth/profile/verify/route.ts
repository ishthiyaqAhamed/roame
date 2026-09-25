import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { kycVerificationSchema } from "@/lib/validations/auth.schema";
import { VerificationStatus } from "@/lib/generated/prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const body = await req.json();
    const parseResult = kycVerificationSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation failed", 422, parseResult.error.flatten().fieldErrors);
    }

    const data = parseResult.data;

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        nicNumber: data.nicNumber,
        nicFrontUrl: data.nicFrontUrl,
        nicBackUrl: data.nicBackUrl,
        drivingLicenseNumber: data.drivingLicenseNumber,
        drivingLicenseFrontUrl: data.drivingLicenseFrontUrl,
        drivingLicenseBackUrl: data.drivingLicenseBackUrl,
        profilePhotoUrl: data.profilePhotoUrl || user.profilePhotoUrl,
        verificationStatus: VerificationStatus.PENDING,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        verificationStatus: true,
        nicNumber: true,
        drivingLicenseNumber: true,
        updatedAt: true,
      },
    });

    return jsonSuccess(
      { user: updatedUser },
      "Identity verification documents submitted for review"
    );
  } catch (error) {
    console.error("KYC submission error:", error);
    return jsonError("Internal server error during KYC submission", 500);
  }
}
