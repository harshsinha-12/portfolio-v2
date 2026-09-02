import { buildLlmsTxt, markdownResponse } from "@/lib/agentProfile";

export const dynamic = "force-static";

export function GET() {
  return markdownResponse(buildLlmsTxt());
}
