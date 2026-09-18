import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { initialArtisans } from "@/data/initialArtisans";
import { Artisan } from "@/types";

export async function GET() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        source: "local-fallback",
        data: initialArtisans,
      });
    }

    const collection = db.collection<Artisan>("artisans");
    let artisans = await collection.find({}).toArray();

    if (artisans.length === 0) {
      await collection.insertMany(initialArtisans);
      artisans = await collection.find({}).toArray();
    }

    return NextResponse.json({
      source: "mongodb-atlas",
      count: artisans.length,
      data: artisans,
    });
  } catch (error) {
    return NextResponse.json(
      { source: "error-fallback", data: initialArtisans, error: (error as Error).message },
      { status: 200 }
    );
  }
}
