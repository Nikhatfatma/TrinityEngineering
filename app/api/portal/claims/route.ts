import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { portalAction } from "@/lib/portal/api";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", unauthorized: true },
        { status: 401 }
      );
    }

    const data = await portalAction("getMyClaims", { sessionToken });

    if (data.unauthorized) {
      cookieStore.delete(PORTAL_SESSION_COOKIE);
      return NextResponse.json(data, { status: 401 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
