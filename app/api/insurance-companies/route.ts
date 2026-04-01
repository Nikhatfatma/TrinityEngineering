import { NextResponse } from 'next/server';

/**
 * API Proxy for Insurance Company actions.
 * Proxies searchInsuranceCompanies and resolveCompanyId
 * to the Catalyst BasicIO function.
 *
 * SEARCH FIX: The deployed Catalyst function uses ZCQL LIKE which is case-sensitive.
 * This proxy intercepts searchInsuranceCompanies and retries with case variants
 * (Title Case, UPPERCASE) if the original search returns no results.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const catalystUrl = process.env.NEXT_PUBLIC_CATALYST_FUNCTION_URL;

    if (!catalystUrl) {
      return NextResponse.json(
        { success: false, error: 'Catalyst Function URL is not configured' },
        { status: 500 }
      );
    }

    const action = body.action;
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'action is required' },
        { status: 400 }
      );
    }

    // For searchInsuranceCompanies: try multiple case variants to work around
    // ZCQL's case-sensitive LIKE in the deployed Catalyst function
    if (action === 'searchInsuranceCompanies') {
      const search = (body.search || '').trim();
      if (!search) {
        return NextResponse.json({ success: true, results: [], matchedBy: 'name' });
      }

      console.log(`[Search Proxy] Searching for: "${search}"`);

      const searchLower = search.toLowerCase();
      // No match in mocks, proceed to try Catalyst remote variants...
      const variants: string[] = [search];
      const titleCase = search.replace(/\b\w/g, (c: string) => c.toUpperCase());
      if (titleCase !== search) variants.push(titleCase);
      const upperCase = search.toUpperCase();
      if (!variants.includes(upperCase)) variants.push(upperCase);
      const lowerCase = search.toLowerCase();
      if (!variants.includes(lowerCase)) variants.push(lowerCase);

      // Try each variant until we get results
      for (const variant of variants) {
        try {
          console.log(`[Search Proxy] Trying variant: "${variant}"`);
          const result = await callCatalyst(catalystUrl, {
            action: 'searchInsuranceCompanies',
            search: variant,
          });

          if (result.success && result.results && result.results.length > 0) {
            console.log(`[Search Proxy] Found ${result.results.length} results with variant: "${variant}"`);
            return NextResponse.json(result);
          }
        } catch (err) {
          console.error(`[Search Proxy] Variant "${variant}" failed:`, err);
        }
      }

      // No results from any variant
      console.log(`[Search Proxy] No results for any variant of "${search}"`);
      return NextResponse.json({ success: true, results: [], matchedBy: 'name' });
    }

    // For all other actions, proxy directly to Catalyst
    const result = await callCatalyst(catalystUrl, body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Insurance Companies API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Proxy Error' },
      { status: 500 }
    );
  }
}

/** Helper: call the remote Catalyst BasicIO function */
async function callCatalyst(catalystUrl: string, body: Record<string, any>) {
  const finalUrl = new URL(catalystUrl);
  finalUrl.searchParams.set('action', body.action);

  // Forward key string params as query params for reliable basicIO.getArgument() access
  if (body.search) finalUrl.searchParams.set('search', body.search);
  if (body.companyName) finalUrl.searchParams.set('companyName', body.companyName);
  if (body.rowId) finalUrl.searchParams.set('rowId', body.rowId);

  const response = await fetch(finalUrl.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data = await response.json();

  // UNWRAP Catalyst BasicIO output if wrapped in { output: "{...}" }
  if (data.output && typeof data.output === 'string') {
    try {
      data = JSON.parse(data.output);
    } catch (e) {
      // Fallback if output is not JSON
    }
  }

  return data;
}
