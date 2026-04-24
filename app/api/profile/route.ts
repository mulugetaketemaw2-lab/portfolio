import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { cookies } from "next/headers";
import * as jose from "jose";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    // Assuming only one profile exists
    let profile = await Profile.findOne();
    if (!profile) {
      // Create default if not exists
      profile = await Profile.create({});
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
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
    
    // Update the single profile, or create if none exists
    let profile = await Profile.findOne();
    if (profile) {
      profile.set(body);
      await profile.save();
    } else {
      profile = await Profile.create(body);
    }
    
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating profile" }, { status: 500 });
  }
}
