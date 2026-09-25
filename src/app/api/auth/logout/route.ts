import { jsonSuccess } from "@/lib/api-response";

export async function POST() {
  const response = jsonSuccess(null, "Logged out successfully");
  response.cookies.delete("roame_token");
  return response;
}
