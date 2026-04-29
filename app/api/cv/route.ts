import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne();
    
    if (profile && profile.cvUrl && profile.cvUrl !== "/cv.pdf") {
      // Redirect to the external Cloudinary URL
      return NextResponse.redirect(new URL(profile.cvUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    }

    // Fallback if not in DB, try public folder (old way)
    // We'll keep this as a fallback for now
    return NextResponse.redirect(new URL('/cv.pdf', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (error) {
    return new NextResponse("CV not found. Please upload your CV first via Admin Dashboard.", { status: 404 });
  }
}
