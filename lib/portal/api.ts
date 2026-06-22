import { fetchCatalyst, CatalystResponse } from "@/lib/api/catalyst";

export async function portalAction(
  action: string,
  body: Record<string, unknown> = {}
): Promise<CatalystResponse> {
  return fetchCatalyst(action, body);
}
