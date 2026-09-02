import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export const runtime = "nodejs";

const VISITOR_COOKIE = "portfolio_visitor_counted";
const VISITOR_HASH = "portfolio:stats";
const VISITOR_FIELD = "visitors";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const redis = await getRedisClient();
    const alreadyCounted = cookieStore.has(VISITOR_COOKIE);

    const count = alreadyCounted
      ? Number((await redis.hGet(VISITOR_HASH, VISITOR_FIELD)) ?? 0)
      : await redis.hIncrBy(VISITOR_HASH, VISITOR_FIELD, 1);

    if (!alreadyCounted) {
      cookieStore.set(VISITOR_COOKIE, "1", {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hour — same browser can count again after cookie expires
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return NextResponse.json(
      { count },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { count: null },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
