import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { portalAction } from "@/lib/portal/api";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, valid: false });
    }

    const data = await portalAction("validateSession", { sessionToken });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, valid: false, error: message }, { status: 500 });
  }
}
