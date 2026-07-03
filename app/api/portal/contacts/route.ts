import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { portalAction } from "@/lib/portal/api";
import { PORTAL_SESSION_COOKIE } from "@/lib/portal/session";

// GET /api/portal/contacts
// Returns all carrier adjuster contacts saved by the logged-in IA user
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

    const data = await portalAction("getCarrierContacts", { sessionToken });

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

// POST /api/portal/contacts
// Saves or updates a single carrier adjuster contact under the logged-in IA account
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
    const { adjusterEmail, contact } = body;

    const data = await portalAction("saveCarrierContact", {
      sessionToken,
      adjusterEmail,
      contact,
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
