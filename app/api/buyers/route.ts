import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { initialBuyerMatches } from "@/data/initialBuyers";
import { BuyerMatch } from "@/types";

export async function GET() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        source: "local-fallback",
        data: initialBuyerMatches,
      });
    }

    const collection = db.collection<BuyerMatch>("buyers");
    let buyers = await collection.find({}).toArray();

    if (buyers.length === 0) {
      await collection.insertMany(initialBuyerMatches);
      buyers = await collection.find({}).toArray();
    }

    return NextResponse.json({
      source: "mongodb-atlas",
      count: buyers.length,
      data: buyers,
    });
  } catch (error) {
    return NextResponse.json(
      { source: "error-fallback", data: initialBuyerMatches, error: (error as Error).message },
      { status: 200 }
    );
  }
}
