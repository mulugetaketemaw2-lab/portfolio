import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { cookies } from "next/headers";
import * as jose from "jose";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Auth Check
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
    const project = await Project.create(body);
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error creating project" }, { status: 500 });
  }
}
