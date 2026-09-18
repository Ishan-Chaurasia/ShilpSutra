import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let imageData: string | null = null;
    let folder: string = "shilpsutra/products";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      imageData = body.image || body.file;
      if (body.folder) folder = body.folder;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folderParam = formData.get("folder") as string | null;
      if (folderParam) folder = folderParam;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageData = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
      }
    }

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: "No image data provided" },
        { status: 400 }
      );
    }

    const uploadResult = await uploadImageToCloudinary(imageData, folder);

    return NextResponse.json(uploadResult, {
      status: uploadResult.success ? 200 : 202,
    });
  } catch (error: any) {
    console.error("[Upload API Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server upload error" },
      { status: 500 }
    );
  }
}
