import { NextResponse } from "next/server";
import { fetchCatalyst } from "@/lib/api/catalyst";

/**
 * API Proxy for General Submission actions (default: submitInspection).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract action from query params (priority) or body
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || body.action || "submitInspection";

    // Use unified Catalyst helper
    const data = await fetchCatalyst(action, body);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Proxy Error" },
      { status: 500 }
    );
  }
}
