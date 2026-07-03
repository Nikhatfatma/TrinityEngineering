import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { portalAction } from "@/lib/portal/api";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal/session";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", unauthorized: true },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const insuranceCompany = searchParams.get("insuranceCompany") || undefined;
    const iaCompany = searchParams.get("iaCompany") || undefined;

    const data = await portalAction("getUserPreferences", { sessionToken, insuranceCompany, iaCompany });

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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", unauthorized: true },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { insuranceCompany, iaCompany, preferences } = body;

    const data = await portalAction("saveUserPreferences", {
      sessionToken,
      insuranceCompany,
      iaCompany,
      preferences,
    });

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
