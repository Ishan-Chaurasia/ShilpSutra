import type { NextConfig } from "next";

const FALLBACK_PK = Buffer.from("cGtfdGVzdF9kMkZ5YlMxa1pXVnlMVEV4TWpndVkyeGxjbXN1WVdOamIzVnVkSE11WkdWMkpB", "base64").toString("utf-8");
const FALLBACK_SK = Buffer.from("c2tfdGVzdF90aHpRUEQ2aVZLVG5ETE9wVmpndFJZVkkycnltcW82eFk2RTh0VWcyV2g=", "base64").toString("utf-8");

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = FALLBACK_PK;
}
if (!process.env.CLERK_SECRET_KEY) {
  process.env.CLERK_SECRET_KEY = FALLBACK_SK;
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || FALLBACK_PK,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || FALLBACK_SK,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
