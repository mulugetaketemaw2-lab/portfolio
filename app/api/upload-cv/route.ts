import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import * as jose from 'jose';

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

    // 3. Save the file (enforce cv.pdf name for link consistency)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate that the uploaded file is actually a PDF by checking magic bytes
    // PDF files always start with the 4 bytes: %PDF (hex: 25 50 44 46)
    if (buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Please upload a PDF file (not a Word document or image)." },
        { status: 400 }
      );
    }

    // Get the public directory path
    const uploadDir = path.join(process.cwd(), "public");
    const filePath = path.join(uploadDir, "cv.pdf");

    await writeFile(filePath, buffer);
    console.log(`Saved CV file to ${filePath}`);

    return NextResponse.json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message: "Server error during upload" }, { status: 500 });
  }
}
