import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from 'jose';
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getNetworkTimestamp } from "@/lib/getTime";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_super_secret_key_123');
      await jose.jwtVerify(token, secret);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    // 2. Parse the form data
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = await getNetworkTimestamp();

    // 3. Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "cv", 
          resource_type: "raw",
          timestamp: timestamp
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 4. Update Profile record in DB
    await dbConnect();
    let profile = await Profile.findOne();
    if (profile) {
      profile.cvUrl = uploadResult.secure_url;
      await profile.save();
    } else {
      await Profile.create({ cvUrl: uploadResult.secure_url });
    }

    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url,
      message: "CV uploaded successfully" 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message: "Server error during upload" }, { status: 500 });
  }
}
