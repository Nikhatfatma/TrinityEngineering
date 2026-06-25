import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Zoho OAuth token cache (module-level, reused across warm invocations)
// ---------------------------------------------------------------------------
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getZohoAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const clientId = (process.env.ZOHO_CLIENT_ID || "").replace(/['"]/g, "").trim();
  const clientSecret = (process.env.ZOHO_CLIENT_SECRET || "").replace(/['"]/g, "").trim();
  const refreshToken = (process.env.ZOHO_REFRESH_TOKEN || "").replace(/['"]/g, "").trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Zoho OAuth credentials.");
  }

  const url =
    `https://accounts.zoho.com/oauth/v2/token` +
    `?refresh_token=${refreshToken}` +
    `&client_id=${clientId}` +
    `&client_secret=${clientSecret}` +
    `&grant_type=refresh_token`;

  const res = await fetch(url, { method: "POST" });
  const data = await res.json();

  if (data.error) throw new Error(`Zoho token refresh failed: ${data.error}`);

  cachedToken = data.access_token as string;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // cache 55 min
  return cachedToken;
}

// ---------------------------------------------------------------------------
// Search for an existing contact by email in the report.
// Returns { id, portalStatus } if found, or null if not found.
// ---------------------------------------------------------------------------
type ContactLookup = { id: string; portalStatus: string };

async function findContactByEmail(
  email: string,
  accessToken: string
): Promise<ContactLookup | null> {
  const appName = (process.env.ZOHO_CREATOR_APP_NAME || "engineering-inspections")
    .replace(/['"]/g, "").trim();
  const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || "trinity5")
    .replace(/['"]/g, "").trim();
  const report = (process.env.ZOHO_CREATOR_ACCESS_REQUEST_REPORT || "All_Roofers")
    .replace(/['"]/g, "").trim();

  const url =
    `https://creator.zoho.com/api/v2/${owner}/${appName}/report/${report}` +
    `?criteria=Email=="${encodeURIComponent(email)}"`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
    const data = await res.json();

    if (Array.isArray(data?.data) && data.data.length > 0) {
      const record = data.data[0];
      const id: string = record.ID ?? record.id ?? "";
      const portalStatus: string = record.Portal_Status ?? "";
      console.log("[request-access] Existing contact found, ID:", id, "Status:", portalStatus);
      return id ? { id, portalStatus } : null;
    }
    return null;
  } catch (err) {
    // If the lookup fails, fall through to create a new record (fail-open)
    console.warn("[request-access] Contact lookup failed, will create new record:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Update Portal_Status on an existing contact record (PATCH by record ID)
// ---------------------------------------------------------------------------
async function updateContactPortalStatus(
  recordId: string,
  accessToken: string
): Promise<void> {
  const appName = (process.env.ZOHO_CREATOR_APP_NAME || "engineering-inspections")
    .replace(/['"]/g, "").trim();
  const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || "trinity5")
    .replace(/['"]/g, "").trim();
  const report = (process.env.ZOHO_CREATOR_ACCESS_REQUEST_REPORT || "All_Roofers")
    .replace(/['"]/g, "").trim();

  const patchUrl =
    `https://creator.zoho.com/api/v2/${owner}/${appName}/report/${report}/${recordId}`;

  const res = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        Portal_Status: "Access Requested",
      },
    }),
  });

  const data = await res.json();
  console.log("[request-access] PATCH status:", res.status, "body:", JSON.stringify(data));

  if (!res.ok || data.error || data.errorCode) {
    const errMsg =
      typeof data.message === "string" ? data.message :
      typeof data.error   === "string" ? data.error   :
      data.error?.message                              ||
      JSON.stringify(data.error ?? data)               ||
      `Zoho PATCH returned status ${res.status}`;
    throw new Error(`Failed to update existing contact: ${errMsg}`);
  }
}

// ---------------------------------------------------------------------------
// POST /api/portal/request-access
// Body: { name: string; email: string }
//
// Logic:
//   1. Search for an existing contact by email.
//   2. If FOUND  → update Portal_Status to "Access Requested" (no duplicate created).
//   3. If NOT FOUND → create a new contact record with Portal_Status "Access Requested".
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // --- Basic validation ---
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, error: "A valid email is required." }, { status: 400 });
    }

    const cleanName  = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Split into first / last for Zoho Creator's compound Name field
    const spaceIdx  = cleanName.indexOf(" ");
    const firstName = spaceIdx !== -1 ? cleanName.slice(0, spaceIdx) : cleanName;
    const lastName  = spaceIdx !== -1 ? cleanName.slice(spaceIdx + 1) : ".";

    // --- Zoho OAuth ---
    const accessToken = await getZohoAccessToken();

    // --- Search for existing contact ---
    const existing = await findContactByEmail(cleanEmail, accessToken);

    if (existing) {
      const { id: existingRecordId, portalStatus } = existing;

      // ── Already requested → inform user ──
      if (portalStatus === "Access Requested") {
        console.log("[request-access] Already has 'Access Requested':", existingRecordId);
        return NextResponse.json(
          {
            success: false,
            alreadyRequested: true,
            error: "You have already submitted an access request. A member of our team will review and approve the request shortly.",
          },
          { status: 409 }
        );
      }

      // ── Any other status (Approved, Invited, Rejected, etc.) → show invite message ──
      console.log("[request-access] Contact exists with status:", portalStatus, "ID:", existingRecordId);
      return NextResponse.json(
        {
          success: false,
          alreadyApproved: true,
          error: "Your access request has been approved. Please return to the login page to sign in and access your account.",
        },
        { status: 409 }
      );
    }

    // ── Contact NOT FOUND → create a new record ──
    const appName  = (process.env.ZOHO_CREATOR_APP_NAME || "engineering-inspections")
      .replace(/['"]/g, "").trim();
    const owner    = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || "trinity5")
      .replace(/['"]/g, "").trim();
    const formName = (process.env.ZOHO_CREATOR_ACCESS_REQUEST_FORM || "PH_Rep")
      .replace(/['"]/g, "").trim();

    const createUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;

    const requestType = (process.env.ZOHO_CREATOR_ACCESS_REQUEST_TYPE || "Roofer")
      .replace(/['"]/g, "").trim();

    const payload = {
      data: {
        Name: {
          first_name: firstName,
          last_name:  lastName,
        },
        Email:         cleanEmail,
        Type_field:    requestType,
        Portal_Status: "Access Requested",
      },
    };

    console.log("[request-access] Creating new contact for:", cleanEmail);

    const zohoRes  = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const zohoData = await zohoRes.json();

    console.log("[request-access] Zoho CREATE status:", zohoRes.status);
    console.log("[request-access] Zoho CREATE body:", JSON.stringify(zohoData));

    // Zoho Creator returns HTTP 200/201 on success.
    const zohoError = !zohoRes.ok || zohoData.error || zohoData.errorCode;
    if (zohoError) {
      const errMsg =
        typeof zohoData.message === "string" ? zohoData.message :
        typeof zohoData.error   === "string" ? zohoData.error   :
        zohoData.error?.message                                  ||
        JSON.stringify(zohoData.error ?? zohoData)               ||
        `Zoho Creator returned status ${zohoRes.status}`;
      console.error("[request-access] Zoho Creator CREATE error:", errMsg);
      throw new Error(errMsg);
    }

    return NextResponse.json({ success: true, created: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[request-access] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
