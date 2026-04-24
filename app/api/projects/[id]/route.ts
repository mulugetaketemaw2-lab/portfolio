import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { cookies } from "next/headers";
import * as jose from "jose";

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_super_secret_key_123');
      await jose.jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const resolvedParams = await params;
    const project = await Project.findByIdAndUpdate(resolvedParams.id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!project) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating project" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_super_secret_key_123');
      await jose.jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const project = await Project.findByIdAndDelete(resolvedParams.id);
    
    if (!project) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting project" }, { status: 500 });
  }
}
