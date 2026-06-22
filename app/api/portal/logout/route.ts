import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { portalAction } from "@/lib/portal/api";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

    if (sessionToken) {
      await portalAction("logout", { sessionToken });
    }

    cookieStore.delete(PORTAL_SESSION_COOKIE);
    return NextResponse.json({ success: true, message: "Logged out" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
