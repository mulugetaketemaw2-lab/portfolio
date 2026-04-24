import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export const dynamic = "force-dynamic";

// PUT update a certificate
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const cert = await Certificate.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ success: true, data: cert });
}

// DELETE a certificate
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  await Certificate.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
