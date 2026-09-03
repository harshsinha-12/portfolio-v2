import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export const runtime = "nodejs";

const SITE_VISITOR_COOKIE = "portfolio_site_visitor_counted";
const STATS_HASH = "portfolio:stats";
const SITE_VISITORS_FIELD = "site_visitors";
const ARTICLE_VIEWS_PREFIX = "article_views:";

type VisitorRequest = {
  type: "site" | "article";
  articleSlug?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VisitorRequest;
    const { type, articleSlug } = body;
    
    const cookieStore = await cookies();
    const redis = await getRedisClient();

    if (type === "site") {
      // Track unique site visitors with cookie
      const alreadyCounted = cookieStore.has(SITE_VISITOR_COOKIE);
      
      const count = alreadyCounted
        ? Number((await redis.hGet(STATS_HASH, SITE_VISITORS_FIELD)) ?? 0)
        : await redis.hIncrBy(STATS_HASH, SITE_VISITORS_FIELD, 1);

      if (!alreadyCounted) {
        cookieStore.set(SITE_VISITOR_COOKIE, "1", {
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
    } 
    
    if (type === "article" && articleSlug) {
      // Track article views - always increment (no cookie check for views)
      const viewsField = `${ARTICLE_VIEWS_PREFIX}${articleSlug}`;
      const count = await redis.hIncrBy(STATS_HASH, viewsField, 1);

      return NextResponse.json(
        { count },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
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
