import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import cloudinary from "@/lib/cloudinary";
import { getNetworkTimestamp } from "@/lib/getTime";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Verify auth
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "default_super_secret_key_123"
      );
      await jose.jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    // Check for placeholder values
    if (process.env.CLOUDINARY_API_KEY === "your_api_key" || !process.env.CLOUDINARY_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: "Cloudinary is not configured. Please update your .env file with actual credentials." 
      }, { status: 400 });
    }

    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = await getNetworkTimestamp();

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "profile", 
          resource_type: "auto",
          timestamp: timestamp
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Update Profile record in DB
    await dbConnect();
    let profile = await Profile.findOne();
    if (profile) {
      profile.imageUrl = uploadResult.secure_url;
      await profile.save();
    } else {
      await Profile.create({ imageUrl: uploadResult.secure_url });
    }

    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url, 
      message: "Profile photo updated!" 
    });
  } catch (error: any) {
    console.error("Error uploading profile photo:", error);
    
    // Handle specific Cloudinary errors
    if (error.message?.includes("Stale request")) {
      return NextResponse.json({ 
        success: false, 
        message: "Upload failed: System clock mismatch. Please ensure your computer's date and time are correct." 
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: error.message || "Server error during upload" },
      { status: 500 }
    );
  }
}
