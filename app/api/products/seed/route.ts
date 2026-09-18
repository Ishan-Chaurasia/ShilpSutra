import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { initialProducts } from "@/data/initialProducts";
import { initialArtisans } from "@/data/initialArtisans";
import { initialBuyerMatches } from "@/data/initialBuyers";

export async function POST() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "MongoDB Atlas not configured. Local data ready.",
        products: initialProducts.length,
      });
    }

    // Reset and seed products
    const prodCol = db.collection("products");
    await prodCol.deleteMany({});
    await prodCol.insertMany(initialProducts.map(p => ({ ...p })));

    // Reset and seed artisans
    const artCol = db.collection("artisans");
    await artCol.deleteMany({});
    await artCol.insertMany(initialArtisans.map(a => ({ ...a })));

    // Reset and seed buyers
    const buyerCol = db.collection("buyers");
    await buyerCol.deleteMany({});
    await buyerCol.insertMany(initialBuyerMatches.map(b => ({ ...b })));

    return NextResponse.json({
      success: true,
      source: "mongodb-atlas",
      message: "Database seeded successfully with pristine ShilpSutra craft listings!",
      seededCounts: {
        products: initialProducts.length,
        artisans: initialArtisans.length,
        buyers: initialBuyerMatches.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to seed database", details: (error as Error).message },
      { status: 500 }
    );
  }
}
