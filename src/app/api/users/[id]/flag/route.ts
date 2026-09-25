import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createFlagSchema } from "@/lib/validations/flag.schema";
import { UserRole } from "@/lib/generated/prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
      return jsonError("Only vehicle owners or admins can submit flags", 403);
    }

    const { id: targetUserId } = await params;

    if (targetUserId === user.id) {
      return jsonError("You cannot flag yourself", 400);
    }

    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return jsonError("Target user not found", 404);
    }

    const body = await req.json();
    const parseResult = createFlagSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const data = parseResult.data;

    // Create flag record
    const flag = await db.blacklistFlag.create({
      data: {
        flaggerId: user.id,
        targetUserId,
        bookingId: data.bookingId,
        reason: data.reason,
        details: data.details,
        evidenceUrl: data.evidenceUrl,
      },
    });

    // Count DISTINCT owners who flagged this user
    const flagsForUser = await db.blacklistFlag.findMany({
      where: { targetUserId },
      select: { flaggerId: true },
    });

    const distinctFlaggers = new Set(flagsForUser.map((f) => f.flaggerId));
    const distinctCount = distinctFlaggers.size;

    // Hard Rule: 3+ flags from different, unrelated owners triggers automatic blacklist
    const shouldBlacklist = distinctCount >= 3;
    const newRiskScore = targetUser.riskScore + 35;

    await db.user.update({
      where: { id: targetUserId },
      data: {
        riskScore: newRiskScore,
        ...(shouldBlacklist ? { isBlacklisted: true } : {}),
      },
    });

    return jsonSuccess(
      {
        flagId: flag.id,
        distinctFlaggersCount: distinctCount,
        autoBlacklisted: shouldBlacklist,
      },
      "Report recorded into internal trust & safety audit trail",
      201
    );
  } catch (error) {
    console.error("Flag user error:", error);
    return jsonError("Internal server error", 500);
  }
}
