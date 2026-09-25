import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { respondClaimSchema } from "@/lib/validations/claim.schema";
import { ClaimStatus } from "@/lib/generated/prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;
    const claim = await db.damageClaim.findUnique({
      where: { id },
    });

    if (!claim) {
      return jsonError("Damage claim not found", 404);
    }

    if (claim.respondentId !== user.id) {
      return jsonError("Only the renter named in the claim can respond", 403);
    }

    if (claim.status !== ClaimStatus.OPEN) {
      return jsonError(`Claim is already in ${claim.status} status`, 400);
    }

    const body = await req.json();
    const parseResult = respondClaimSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { action, notes } = parseResult.data;

    let updatedClaim;
    if (action === "ACCEPT_EXCESS") {
      updatedClaim = await db.damageClaim.update({
        where: { id },
        data: {
          status: ClaimStatus.ACCEPTED_BY_RENTER,
          amountChargedToRenter: claim.insuranceExcessAmount,
          resolutionNotes: notes || "Renter agreed to pay insurance excess deductible.",
        },
      });
    } else {
      updatedClaim = await db.damageClaim.update({
        where: { id },
        data: {
          status: ClaimStatus.UNDER_MEDIATION,
          resolutionNotes: notes || "Renter requested Roame platform mediation.",
        },
      });
    }

    return jsonSuccess(
      { claim: updatedClaim },
      action === "ACCEPT_EXCESS"
        ? "Insurance excess accepted. Charge scheduled against deposit/card."
        : "Roame mediation team has been assigned to investigate and review evidence photos."
    );
  } catch (error) {
    console.error("Claim response error:", error);
    return jsonError("Internal server error", 500);
  }
}
