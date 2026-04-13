import { NextResponse } from "next/server";
import { fetchCatalyst } from "@/lib/api/catalyst";

/**
 * API Proxy for Insurance Company actions.
 * Proxies searchInsuranceCompanies and resolveCompanyId to the Catalyst BasicIO function.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    if (!action) {
      return NextResponse.json({ success: false, error: "action is required" }, { status: 400 });
    }

    // SPECIAL HANDLING: searchInsuranceCompanies
    // The deployed Catalyst function uses ZCQL LIKE which is case-sensitive.
    // Try multiple case variants to work around this limitation.
    if (action === "searchInsuranceCompanies") {
      const search = (body.search || "").trim();
      console.log(`[Search Proxy] Searching for: "${search}"`);

      // ── Build Search Variants ──
      // If search is empty, we only need to try one variant (the empty search itself)
      // to fetch all active companies.
      const variants: string[] = search ? [search] : [""];
      if (search) {
        const titleCase = search.replace(/\b\w/g, (c: string) => c.toUpperCase());
        if (titleCase !== search) variants.push(titleCase);
        const upperCase = search.toUpperCase();
        if (!variants.includes(upperCase)) variants.push(upperCase);
        const lowerCase = search.toLowerCase();
        if (!variants.includes(lowerCase)) variants.push(lowerCase);
      }

      // ── Try Variants In Parallel ──
      const results = await Promise.all(
        variants.map(async (variant) => {
          try {
            console.log(`[Search Proxy] Trying variant: "${variant}"`);
            const result = await fetchCatalyst("searchInsuranceCompanies", { search: variant });
            if (result.success && result.results && result.results.length > 0) {
              return result;
            }
          } catch (err) {
            console.error(`[Search Proxy] Variant "${variant}" failed:`, err);
          }
          return null;
        })
      );

      // Find the first variant that returned results
      const firstValidResult = results.find(r => r !== null);
      if (firstValidResult && firstValidResult.results) {
        console.log(`[Search Proxy] Found ${firstValidResult.results.length} results.`);
        return NextResponse.json(firstValidResult);
      }

      // No results from any variant
      console.log(`[Search Proxy] No results for any variant of "${search}"`);
      return NextResponse.json({ success: true, results: [], matchedBy: "name" });
    }

    // For all other actions, use the unified Catalyst helper
    const result = await fetchCatalyst(action, body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Insurance Companies API Proxy Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Proxy Error" },
      { status: 500 }
    );
  }
}
