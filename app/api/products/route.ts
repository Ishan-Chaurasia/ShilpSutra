import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { initialProducts } from "@/data/initialProducts";
import { Product } from "@/types";

export async function GET() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        source: "local-fallback",
        message: "MongoDB Atlas not configured or unreachable; using local seed data.",
        data: initialProducts,
      });
    }

    const collection = db.collection<Product>("products");
    let products = await collection.find({}).sort({ createdAt: -1 }).toArray();

    // Auto-seed collection if empty
    if (products.length === 0) {
      await collection.insertMany(initialProducts);
      products = await collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json({
      source: "mongodb-atlas",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("[API Error] Failed to fetch products from MongoDB:", error);
    return NextResponse.json(
      { source: "error-fallback", data: initialProducts, error: (error as Error).message },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.name || !body.category) {
      return NextResponse.json(
        { error: "Product name and category are required." },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      ...body,
      id: body.id || `prod-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
      status: body.status || "PUBLISHED",
    };

    const db = await getDb();

    if (db) {
      try {
        const collection = db.collection<Product>("products");
        // Use upsert by id so duplicate syncs don't crash
        await collection.updateOne(
          { id: newProduct.id },
          { $set: newProduct },
          { upsert: true }
        );
        return NextResponse.json({
          success: true,
          source: "mongodb-atlas",
          data: newProduct,
        });
      } catch (mongoErr) {
        console.warn("[MongoDB Post Warning] Falling back to local:", (mongoErr as Error).message);
      }
    }

    return NextResponse.json({
      success: true,
      source: "local",
      message: "MongoDB not connected. Product stored for client-side persistence.",
      data: newProduct,
    });
  } catch (error) {
    console.error("[API Error] Failed to save product to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: (error as Error).message },
      { status: 500 }
    );
  }
}
