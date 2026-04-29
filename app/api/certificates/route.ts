import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export const dynamic = "force-dynamic";

// GET all certificates
export async function GET() {
  await dbConnect();
  const certs = await Certificate.find({}).sort({ order: 1, createdAt: 1 });
  return NextResponse.json({ success: true, data: certs });
}

// POST create new certificate
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  console.log("POST Certificate body:", body);
  const cert = await Certificate.create(body);
  return NextResponse.json({ success: true, data: cert });
}
