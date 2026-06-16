import { NextResponse } from "next/server";
import { fetchCatalyst } from "@/lib/api/catalyst";

/**
 * API Proxy for IA Company lookup (IA_Company_Name on Zoho form).
 * Uses Zoho All_Companies_List filtered to Company_Type == "IA Company".
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || "searchIaCompanies";

    if (action !== "searchIaCompanies") {
      return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
    }

    const search = (body.search || "").trim();
    const result = await fetchCatalyst("searchIaCompanies", { search });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("IA Companies API Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Proxy Error" },
      { status: 500 }
    );
  }
}
