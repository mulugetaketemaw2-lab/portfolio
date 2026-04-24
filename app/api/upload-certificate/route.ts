import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_super_secret_key_123");
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

    // Ensure /public/certificates directory exists
    const uploadDir = path.join(process.cwd(), "public", "certificates");
    await mkdir(uploadDir, { recursive: true });

    // Use a timestamp-based unique filename to avoid collisions
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `cert_${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Return the public URL path
    const publicUrl = `/certificates/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error uploading certificate image:", error);
    return NextResponse.json({ success: false, message: "Server error during upload" }, { status: 500 });
  }
}
