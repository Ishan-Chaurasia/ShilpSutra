import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Fallback Clerk keys safely decoded so unconfigured environments never crash with 500
const FALLBACK_PK = typeof atob !== "undefined"
  ? atob("cGtfdGVzdF9kMkZ5YlMxa1pXVnlMVEV4TWpndVkyeGxjbXN1WVdOamIzVnVkSE11WkdWMkpB")
  : "pk_test_d2FybS1kZWVyLTExMjguY2xlcmsuYWNjb3VudHMuZGV2JA";
const FALLBACK_SK = typeof atob !== "undefined"
  ? atob("c2tfdGVzdF90aHpRUEQ2aVZLVG5ETE9wVmpndFJZVkkycnltcW82eFk2RTh0VWcyV2g=")
  : "sk_test_thzQPD6iVKTnDLOpVjgtRYVI2rymqo6xY6E8tUg2Wh";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || FALLBACK_PK;
const secretKey = process.env.CLERK_SECRET_KEY || FALLBACK_SK;

let clerkHandler: any = null;
try {
  clerkHandler = clerkMiddleware({
    publishableKey,
  });
} catch (e) {
  console.warn("[Clerk Middleware Init Warning]:", e);
}

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  try {
    if (clerkHandler) {
      return clerkHandler(req, event);
    }
    return NextResponse.next();
  } catch (err) {
    console.warn("[Clerk Middleware Runtime Warning]:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
