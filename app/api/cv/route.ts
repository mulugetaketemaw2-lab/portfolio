import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "cv.pdf");
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"cv.pdf\"",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new NextResponse("CV not found. Please upload your CV first via Admin Dashboard. / CV አልተገኘም፣ እባክዎ መጀመሪያ በአድሚን ዳሽቦርድ በኩል ያስገቡ።", { status: 404 });
  }
}
