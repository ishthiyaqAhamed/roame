import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { registerSchema } from "@/lib/validations/auth.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const { fullName, email, password, phoneNumber, role, preferredLanguage } = parseResult.data;

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return jsonError("Email address is already registered", 409);
    }

    // Check phone number uniqueness if provided
    if (phoneNumber) {
      const existingPhone = await db.user.findUnique({
        where: { phoneNumber },
      });
      if (existingPhone) {
        return jsonError("Phone number is already associated with an account", 409);
      }
    }

    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        phoneNumber,
        passwordHash,
        role,
        preferredLanguage,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        verificationStatus: true,
        preferredLanguage: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = jsonSuccess(
      {
        user: newUser,
        token,
      },
      "Account created successfully",
      201
    );

    // Set secure HTTP-only cookie
    response.cookies.set("roame_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return jsonError("Internal server error during registration", 500);
  }
}
