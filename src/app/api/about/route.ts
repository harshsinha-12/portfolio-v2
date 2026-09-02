import { getAgentProfile, jsonResponse } from "@/lib/agentProfile";

export const dynamic = "force-static";

export function GET() {
  return jsonResponse(getAgentProfile());
}
