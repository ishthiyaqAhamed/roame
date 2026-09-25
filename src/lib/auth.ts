import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { db } from "./db";
import { UserRole } from "./generated/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "roame_luxury_fallback_secret_key_2026";
const JWT_EXPIRES_IN = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies user authentication from incoming NextRequest
 * Supports both `Authorization: Bearer <token>` header and `roame_token` cookie.
 */
export async function getAuthUser(req: NextRequest) {
  let token: string | undefined;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = req.cookies.get("roame_token")?.value;
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      role: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      profilePhotoUrl: true,
      verificationStatus: true,
      isBlacklisted: true,
      riskScore: true,
      preferredLanguage: true,
      nicNumber: true,
      drivingLicenseNumber: true,
      createdAt: true,
    },
  });

  if (!user || user.isBlacklisted) return null;

  return user;
}
