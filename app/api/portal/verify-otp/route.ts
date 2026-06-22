import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { portalAction } from "@/lib/portal/api";
import {
  PORTAL_SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  getSessionMaxAgeSeconds,
} from "@/lib/portal/session";

export async function POST(request: Request) {
  try {
    const { email, otp, role } = await request.json();
    const data = await portalAction("verifyOtp", { email, otp, role });

    if (!data.success || !data.sessionToken) {
      return NextResponse.json(data);
    }

    const cookieStore = await cookies();
    cookieStore.set(PORTAL_SESSION_COOKIE, String(data.sessionToken), {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: getSessionMaxAgeSeconds(),
    });

    return NextResponse.json({
      success: true,
      message: data.message,
      user: data.user,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
