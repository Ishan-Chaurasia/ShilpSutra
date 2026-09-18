import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "hws6wj4r",
  api_key: process.env.CLOUDINARY_API_KEY || "471265969841963",
  api_secret: process.env.CLOUDINARY_API_SECRET || "B9NKW3qlgddkFQTOya_S46HxS1w",
  secure: true,
});

export interface CloudinaryUploadResult {
  success: boolean;
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  error?: string;
}

/**
 * Uploads an image (base64 data URL, remote URL, or file path) to Cloudinary.
 * Returns the optimized secure CDN URL.
 */
export async function uploadImageToCloudinary(
  fileData: string,
  folder: string = "shilpsutra/products"
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "hws6wj4r";

  if (!cloudName) {
    console.warn("[Cloudinary] CLOUDINARY_CLOUD_NAME is not set. Using local/original image URL.");
    return {
      success: false,
      url: fileData,
      error: "CLOUDINARY_CLOUD_NAME is not configured.",
    };
  }

  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error: any) {
    console.error("[Cloudinary Upload Error]:", error?.message || error);
    return {
      success: false,
      url: fileData,
      error: error?.message || "Failed to upload image to Cloudinary",
    };
  }
}

export default cloudinary;
