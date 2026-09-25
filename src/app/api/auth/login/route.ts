import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { loginSchema } from "@/lib/validations/auth.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { email, password } = parseResult.data;

    // Retrieve user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Constant-time or generic rejection for both non-existent user and bad password
    if (!user || !user.passwordHash) {
      return jsonError("Invalid email or password", 401);
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return jsonError("Invalid email or password", 401);
    }

    if (user.isBlacklisted) {
      return jsonError("Your account has been suspended. Please contact Roame support.", 403);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const sanitizedUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      verificationStatus: user.verificationStatus,
      profilePhotoUrl: user.profilePhotoUrl,
      preferredLanguage: user.preferredLanguage,
    };

    const response = jsonSuccess(
      {
        user: sanitizedUser,
        token,
      },
      "Logged in successfully"
    );

    response.cookies.set("roame_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return jsonError("Internal server error during login", 500);
  }
}
