export interface CatalystResponse {
  success: boolean;
  results?: any[];
  zoho_creator_id?: string;
  error?: string;
  message?: string;
  matchedBy?: string;
  [key: string]: any;
}

/**
 * Unified helper to call the remote Catalyst BasicIO function.
 * Handles environment variable checks, query parameters, and unwrapping result output.
 */
export async function fetchCatalyst(
  action: string,
  body: Record<string, any> = {}
): Promise<CatalystResponse> {
  const catalystUrl = process.env.NEXT_PUBLIC_CATALYST_FUNCTION_URL;

  if (!catalystUrl) {
    throw new Error("Catalyst Function URL is not configured in environment variables.");
  }

  const finalUrl = new URL(catalystUrl);
  finalUrl.searchParams.set("action", action);

  // Forward key string params as query params for reliable basicIO.getArgument() access on remote side
  if (body.search !== undefined) finalUrl.searchParams.set("search", String(body.search));
  if (body.companyName !== undefined) finalUrl.searchParams.set("companyName", String(body.companyName));
  if (body.rowId !== undefined) finalUrl.searchParams.set("rowId", String(body.rowId));


  const response = await fetch(finalUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, action }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Catalyst request failed (${response.status}): ${errorText}`);
  }

  let data = await response.json();

  // UNWRAP Catalyst BasicIO output if it's wrapped in { output: "{...}" }
  if (data.output && typeof data.output === "string") {
    try {
      const parsed = JSON.parse(data.output);
      data = parsed;
    } catch (e) {
      console.warn("[Catalyst Utils] Failed to parse wrapped output string as JSON:", e);
    }
  }

  return data;
}
