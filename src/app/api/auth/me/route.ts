import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized or session expired", 401);
    }

    return jsonSuccess({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return jsonError("Internal server error", 500);
  }
}
