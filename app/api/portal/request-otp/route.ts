import { NextResponse } from "next/server";
import { portalAction } from "@/lib/portal/api";

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    const data = await portalAction("requestOtp", { email, role });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
