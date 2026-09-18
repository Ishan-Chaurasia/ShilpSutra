import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { initialProducts } from "@/data/initialProducts";
import { Product } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    if (db) {
      try {
        const collection = db.collection<Product>("products");
        const product = await collection.findOne({
          $or: [{ id }, { slug: id }],
        });

        if (product) {
          return NextResponse.json({ source: "mongodb-atlas", data: product });
        }
      } catch (mongoErr) {
        console.warn("[MongoDB Get Warning] Falling back to local:", (mongoErr as Error).message);
      }
    }

    const fallback = initialProducts.find((p) => p.id === id || p.slug === id);
    if (!fallback) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ source: "local", data: fallback });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const db = await getDb();

    if (db) {
      try {
        const collection = db.collection<Product>("products");
        const result = await collection.findOneAndUpdate(
          { id },
          { $set: updates },
          { returnDocument: "after" }
        );

        return NextResponse.json({
          success: true,
          source: "mongodb-atlas",
          data: result,
        });
      } catch (mongoErr) {
        console.warn("[MongoDB Put Warning] Falling back to local:", (mongoErr as Error).message);
      }
    }

    return NextResponse.json({
      success: true,
      source: "local",
      data: { id, ...updates },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    if (db) {
      try {
        const collection = db.collection<Product>("products");
        await collection.deleteOne({ id });

        return NextResponse.json({
          success: true,
          source: "mongodb-atlas",
          message: `Product ${id} deleted successfully.`,
        });
      } catch (mongoErr) {
        console.warn("[MongoDB Delete Warning] Falling back to local:", (mongoErr as Error).message);
      }
    }

    return NextResponse.json({
      success: true,
      source: "local",
      message: `Product ${id} deleted locally.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product", details: (error as Error).message },
      { status: 500 }
    );
  }
}
