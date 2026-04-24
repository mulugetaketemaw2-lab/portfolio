import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import * as jose from "jose";

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

    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate it is actually an image by checking magic bytes
    const isPng  = buffer[0] === 0x89 && buffer[1] === 0x50; // PNG
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8; // JPEG
    const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45; // WEBP

    if (!isPng && !isJpeg && !isWebp) {
      return NextResponse.json(
        { success: false, message: "Please upload a valid image file (PNG, JPG, or WEBP)." },
        { status: 400 }
      );
    }

    // Always save as profile-final.png so the page.tsx <Image> src never changes
    const filePath = path.join(process.cwd(), "public", "profile-final.png");
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, message: "Profile photo updated!" });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return NextResponse.json(
      { success: false, message: "Server error during upload" },
      { status: 500 }
    );
  }
}
