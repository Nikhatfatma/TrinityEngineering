const catalyst = require('zcatalyst-sdk-node');

function mapFormDataToCreator(data) {
    return {
        data: {
            Inspection_Type: data.inspectionType || "",
            Building_Type: data.buildingType || "",
            Claim_Number: data.claimNumber || "",
            Insurance_Company: data.insuranceCompany || "",
            Adjuster_Email: data.adjusterEmail || "",
            Adjuster_First_Name: data.adjusterFirstName || "",
            Adjuster_Last_Name: data.adjusterLastName || "",
            Adjuster_Phone: data.adjusterPhone || "",
            Adjuster_Phone_Ext: data.adjusterPhoneExt || "",
            Second_Email_for_Report: data.secondEmailForReport || "",
            Adjusters_Comments_or_Special_Notes: data.adjusterComments || "",
            Is_IA_Claim: data.isIAClaim ? ["true"] : [],
            IA_First_Name: data.iaFirstName || "",
            IA_Last_Name: data.iaLastName || "",
            IA_Phone: data.iaPhone || "",
            IA_Company: data.iaCompany || "",
            IA_Secondary_Recipients: (data.iaRecipients || []).map(r => r.email).filter(Boolean).join(", "),
            Policyholder_First_Name: data.policyholderFirstName || "",
            Policyholder_Last_Name: data.policyholderLastName || "",
            Policyholder_Phone_1: data.policyholderPhone1 || "",
            Spouse_or_Second_Policyholder_First_Name: data.spouseFirstName || "",
            Spouse_or_Second_Policyholder_Last_Name: data.spouseLastName || "",
            Policyholder_Phone_2: data.policyholderPhone2 || "",
            Street_Address: data.streetAddress || "",
            Address_Line_2: data.addressLine2 || "",
            City: data.city || "",
            State: data.state || "",
            Zip_Code: data.zip || "",
            Date_of_Loss: data.dateOfLoss || "",
            Policy_Number: data.policyNumber || "",
            Adjuster_Company: data.adjusterCompany || "",
            Roofer_Name: data.rooferName || "",
            Roofer_Company: data.rooferCompany || "",
            Roofer_Phone: data.rooferPhone || "",
            Inspection_Name: data.inspectionName || "",
            Public_Adjuster_Name: data.publicAdjusterName || "",
            Public_Adjuster_Company: data.publicAdjusterCompany || "",
            Public_Adjuster_Phone: data.publicAdjusterPhone || "",
            Public_Adjuster_Email: data.publicAdjusterEmail || ""
        }
    };
}

let cachedToken = null;
let tokenExpiry = 0;
let tokenPromise = null;

async function getNewAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    if (tokenPromise) {
        return tokenPromise;
    }

    tokenPromise = (async () => {
        try {
            const clientId = (process.env.ZOHO_CLIENT_ID || '').replace(/['"]/g, '').trim();
            const clientSecret = (process.env.ZOHO_CLIENT_SECRET || '').replace(/['"]/g, '').trim();
            const refreshToken = (process.env.ZOHO_REFRESH_TOKEN || '').replace(/['"]/g, '').trim();

            if (!clientId || !clientSecret || !refreshToken) {
                throw new Error("Missing OAuth credentials in environment variables (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN)");
            }

            const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;

            const response = await fetch(url, { method: 'POST' });
            const data = await response.json();

            if (data.error) {
                throw new Error(`Failed to refresh token: ${data.error}`);
            }

            cachedToken = data.access_token;
            tokenExpiry = Date.now() + (55 * 60 * 1000); // Cache for 55 mins

            return cachedToken;
        } finally {
            tokenPromise = null;
        }
    })();

    return tokenPromise;
}

module.exports = async (context, basicIO) => {
    try {
        const action = basicIO.getArgument('action');
        const catalystApp = catalyst.initialize(context);
        
        console.log("Environment Variable Keys:", Object.keys(process.env).filter(k => k.startsWith('ZOHO_')));

        // Removed ineffective manual CORS header assignment for BasicIO function


        if (action === 'submitInspection') {
            const data = basicIO.getArgument('data');

            // 1. Strict Backend Validation
            if (!data) {
                basicIO.write(JSON.stringify({ success: false, error: 'No data provided' }));
                context.close();
                return;
            }

            const requiredFields = [
                'inspectionType', 'claimNumber', 'adjusterEmail',
                'policyholderFirstName', 'policyholderLastName',
                'streetAddress', 'city', 'state', 'zip'
            ];

            const missingFields = requiredFields.filter(field => !data[field] || String(data[field]).trim() === "");

            if (missingFields.length > 0) {
                basicIO.write(JSON.stringify({
                    success: false,
                    error: `Validation Error: Missing required fields: ${missingFields.join(', ')}`
                }));
                context.close();
                return;
            }

            // Normalize claimNumber
            data.claimNumber = String(data.claimNumber).trim().toLowerCase();

            // 2. Flexible Duplicate Prevention (24h Window)
            try {
                const zcql = catalystApp.zcql();
                const safeClaim = data.claimNumber.replace(/'/g, "''");
                const query = `SELECT ROWID, CREATEDTIME FROM ProcessedClaims WHERE ClaimNumber = '${safeClaim}'`;
                const existing = await zcql.executeZCQLQuery(query);

                if (existing && existing.length > 0) {
                    const createdTime = new Date(existing[0].ProcessedClaims.CREATEDTIME).getTime();
                    const hours = parseFloat(process.env.DUPLICATE_WINDOW_HOURS) || 24;
                    const timeWindow = hours * 60 * 60 * 1000;

                    if (Date.now() - createdTime < timeWindow) {
                        basicIO.write(JSON.stringify({ success: false, error: `Duplicate Submission: A claim with this number has already been processed within the last ${hours} hours.` }));
                        context.close();
                        return;
                    }
                }
            } catch (err) {
                console.error("Duplicate check skipped (table may not exist yet or ZCQL error):", err.message);
            }

            const creatorPayload = mapFormDataToCreator(data);

            try {
                let token = await getNewAccessToken();

                async function submitToCreator(accessToken) {
                    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner').replace(/['"]/g, '').trim();
                    const appName = (process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app').replace(/['"]/g, '').trim();
                    const formName = (process.env.ZOHO_CREATOR_FORM_NAME || 'Inspection_Request_Public_Submission').replace(/['"]/g, '').trim();
                    const creatorUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;

                    console.log(`[Creator API] Submitting to URL: ${creatorUrl}`);
                    console.log(`[Creator API] Form Name used: ${formName}`);

                    return fetch(creatorUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Zoho-oauthtoken ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(creatorPayload)
                    });
                }

                let response = await submitToCreator(token);
                let responseData = await response.json();

                // 3. Token Refresh Logic
                // If token is rejected by Zoho despite cache validity, force a hard refresh
                if (response.status === 401 || (responseData.code && [1030, 2945].includes(responseData.code)) || JSON.stringify(responseData).includes("INVALID_OAUTH")) {
                    console.log("Token unexpectedly rejected by Zoho, forcing hard refresh...");
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    response = await submitToCreator(token);
                    responseData = await response.json();
                }

                if (!response.ok) {
                    throw new Error(`Creator API Error: ${JSON.stringify(responseData)}`);
                }

                // Success - Log to ProcessedClaims to prevent future duplicates
                try {
                    const processedTable = catalystApp.datastore().table('ProcessedClaims');
                    await processedTable.insertRow({ ClaimNumber: data.claimNumber });
                } catch (dbErr) {
                    console.error("Could not log processed claim:", dbErr.message);
                }

                basicIO.write(JSON.stringify({ success: true, message: 'Successfully submitted to Zoho Creator.' }));
                context.close();

            } catch (err) {
                console.error("Creator API Error, attempting to use Datastore fallback:", err);
                const table = catalystApp.datastore().table('FailedSubmissions');

                // Fallback attempt
                try {
                    await table.insertRow({
                        Payload: JSON.stringify(data),
                        ClaimNumber: data.claimNumber || 'Unknown',
                        AdjusterEmail: data.adjusterEmail || 'Unknown',
                        ErrorDetails: err.message || JSON.stringify(err),
                        Resolved: false
                    });
                } catch (dbErr) {
                    console.error("Failed to insert into Datastore:", dbErr);
                }

                // Email notification attempt
                try {
                    const email = catalystApp.email();
                    const adminEmail = process.env.ADMIN_EMAIL || 'support@trinitypllc.com';
                    const fromEmail = process.env.FROM_EMAIL || 'reports@trinitypllc.com';
                    await email.sendMail({
                        from_email: fromEmail,
                        to_email: [adminEmail],
                        subject: `Failure Alert: Inspection Request - Claim #${data.claimNumber || 'Unknown'}`,
                        content: `An error occurred while submitting inspection form to Zoho Creator.\n\nClaim: ${data.claimNumber || 'Unknown'}\nAdjuster Email: ${data.adjusterEmail || 'Unknown'}\nError details: ${err.message}\n\nThe payload has been saved in the Catalyst Datastore 'FailedSubmissions' table for retry.`
                    });
                } catch (emailErr) {
                    console.error("Failed to send fallback email alert:", emailErr);
                }

                basicIO.write(JSON.stringify({ success: false, message: 'Saved as fallback explicitly due to Creator API error.', isFallback: true, error: err.message }));
                context.close();
            }

        } else if (action === 'getFailedSubmissions') {
            const zcql = catalystApp.zcql();
            const query = "SELECT ROWID, Payload, ClaimNumber, AdjusterEmail, ErrorDetails, CREATEDTIME FROM FailedSubmissions WHERE Resolved = false ORDER BY CREATEDTIME DESC";

            try {
                const result = await zcql.executeZCQLQuery(query);
                const records = result.map(row => row.FailedSubmissions);
                basicIO.write(JSON.stringify({ success: true, data: records }));
            } catch (err) {
                console.error("ZCQL Fetch Error:", err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'retrySubmission') {
            const rowId = basicIO.getArgument('rowId');
            if (!rowId) {
                basicIO.write(JSON.stringify({ success: false, error: 'rowId is required for retries' }));
                context.close();
                return;
            }

            try {
                const table = catalystApp.datastore().table('FailedSubmissions');
                const row = await table.getRow(rowId);
                const data = JSON.parse(row.Payload);
                const creatorPayload = mapFormDataToCreator(data);

                let token = await getNewAccessToken();

                async function submitToCreator(accessToken) {
                    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner').replace(/['"]/g, '').trim();
                    const appName = (process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app').replace(/['"]/g, '').trim();
                    const formName = (process.env.ZOHO_CREATOR_FORM_NAME || 'Inspection_Request_Public_Submission').replace(/['"]/g, '').trim();
                    const creatorUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;
                    console.log(`[Creator API Retry] Submitting to URL: ${creatorUrl}`);
                    console.log(`[Creator API Retry] Form Name used: ${formName}`);
                    return fetch(creatorUrl, {
                        method: 'POST',
                        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(creatorPayload)
                    });
                }

                let response = await submitToCreator(token);
                let responseData = await response.json();

                // Retry specific Token Refresh logic
                if (response.status === 401 || (responseData.code && [1030, 2945].includes(responseData.code)) || JSON.stringify(responseData).includes("INVALID_OAUTH")) {
                    console.log("Token rejected on retry, forcing hard refresh...");
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    response = await submitToCreator(token);
                    responseData = await response.json();
                }

                if (!response.ok || responseData.code !== 3000) {
                    await table.updateRow({ ROWID: rowId, ErrorDetails: JSON.stringify(responseData) });
                    throw new Error(`Retry failed: ${JSON.stringify(responseData)}`);
                }

                // If successful, log to ProcessedClaims and mark Resolved
                try {
                    const processedTable = catalystApp.datastore().table('ProcessedClaims');
                    await processedTable.insertRow({ ClaimNumber: data.claimNumber });
                } catch (dbErr) { console.error("Could not log processed claim:", dbErr.message); }

                await table.updateRow({ ROWID: rowId, Resolved: true });

                basicIO.write(JSON.stringify({ success: true, message: 'Retry successful! Submission completed.' }));
                context.close();
            } catch (err) {
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }
            /* ================================================================ */
            /*  ACTION: searchInsuranceCompanies                                */
            /*  Searches both InsuranceCompanies.name and InsuranceAliases      */
            /*  Returns: { results: [{ id, name, zoho_creator_id }],           */
            /*            matchedBy: "name" | "alias" }                         */
            /* ================================================================ */
        } else if (action === 'searchInsuranceCompanies') {
            const search = (basicIO.getArgument('search') || '').trim();

            if (!search) {
                basicIO.write(JSON.stringify({ success: true, results: [], matchedBy: 'name' }));
                context.close();
                return;
            }

            const zcql = catalystApp.zcql();
            // ZCQL LIKE is case-sensitive and ZCQL does NOT support LOWER()/UPPER().
            // Fix: fetch all active rows and filter in JS for case-insensitive matching.
            const searchLower = search.toLowerCase();

            try {
                // 1. Fetch all active companies and filter in JS (case-insensitive)
                const nameQuery = `SELECT ROWID, name, zoho_creator_id, status FROM InsuranceCompanies WHERE status = 'Active'`;
                console.log(`[ZCQL Name Search] Executing query: ${nameQuery}`);
                const allCompanies = await zcql.executeZCQLQuery(nameQuery);
                console.log(`[ZCQL Name Search] Total active companies: ${allCompanies ? allCompanies.length : 0}`);

                // Case-insensitive filter in application code
                const nameMatches = (allCompanies || []).filter(row =>
                    (row.InsuranceCompanies.name || '').toLowerCase().includes(searchLower)
                );
                console.log(`[ZCQL Name Search] Matches for "${search}": ${nameMatches.length}`);

                if (nameMatches.length > 0) {
                    const results = nameMatches.map(row => ({
                        id: row.InsuranceCompanies.ROWID,
                        name: row.InsuranceCompanies.name,
                        zoho_creator_id: row.InsuranceCompanies.zoho_creator_id
                    }));
                    basicIO.write(JSON.stringify({ success: true, results, matchedBy: 'name' }));
                    context.close();
                    return;
                }

                // 2. If no name match, fetch all aliases and filter in JS (case-insensitive)
                const aliasQuery = `SELECT ROWID, alias, company_id FROM InsuranceAliases`;
                console.log(`[ZCQL Alias Search] Executing query: ${aliasQuery}`);
                let aliasMatches = [];
                try {
                    const allAliases = await zcql.executeZCQLQuery(aliasQuery);
                    console.log(`[ZCQL Alias Search] Total aliases: ${allAliases ? allAliases.length : 0}`);
                    aliasMatches = (allAliases || []).filter(row =>
                        (row.InsuranceAliases.alias || '').toLowerCase().includes(searchLower)
                    );
                    console.log(`[ZCQL Alias Search] Matches for "${search}": ${aliasMatches.length}`);
                } catch (aliasErr) {
                    // InsuranceAliases table may not exist yet — search still works via name
                    console.log("Alias search skipped (table may not exist):", aliasErr.message);
                }

                if (aliasMatches.length > 0) {
                    // Get the company details for each alias match
                    const companyIds = [...new Set(aliasMatches.map(r => r.InsuranceAliases.company_id))];
                    const results = [];

                    for (const companyId of companyIds) {
                        try {
                            // ROWID is numeric BigInt — do not wrap in single quotes
                            const companyQuery = `SELECT ROWID, name, zoho_creator_id, status FROM InsuranceCompanies WHERE ROWID = ${companyId} AND status = 'Active'`;
                            console.log(`[ZCQL Company Lookup] Query: ${companyQuery}`);
                            const companyResult = await zcql.executeZCQLQuery(companyQuery);
                            console.log(`[ZCQL Company Lookup] Result: ${companyResult ? companyResult.length : 0}`);
                            if (companyResult && companyResult.length > 0) {
                                results.push({
                                    id: companyResult[0].InsuranceCompanies.ROWID,
                                    name: companyResult[0].InsuranceCompanies.name,
                                    zoho_creator_id: companyResult[0].InsuranceCompanies.zoho_creator_id
                                });
                            }
                        } catch (lookupErr) {
                            console.error("Company lookup for alias failed:", lookupErr.message);
                        }
                    }

                    basicIO.write(JSON.stringify({ success: true, results, matchedBy: 'alias' }));
                    context.close();
                    return;
                }

                // 3. No matches at all
                basicIO.write(JSON.stringify({ success: true, results: [], matchedBy: 'name' }));
                context.close();

            } catch (err) {
                console.error("searchInsuranceCompanies Error:", err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            /* ================================================================ */
            /*  ACTION: resolveCompanyId                                        */
            /*  3-tier lookup: Local DB → Zoho Creator → Create new             */
            /*  ALWAYS returns zoho_creator_id (record ID), never name          */
            /* ================================================================ */
        } else if (action === 'resolveCompanyId') {
            const companyName = (basicIO.getArgument('companyName') || '').trim();

            if (!companyName) {
                basicIO.write(JSON.stringify({ success: false, error: 'companyName is required' }));
                context.close();
                return;
            }

            const zcql = catalystApp.zcql();
            const safeName = companyName.replace(/'/g, "''");

            try {
                // ── STEP 1: Search local DB ──
                const localQuery = `SELECT ROWID, name, zoho_creator_id, status FROM InsuranceCompanies WHERE name = '${safeName}'`;
                const localResult = await zcql.executeZCQLQuery(localQuery);

                if (localResult && localResult.length > 0) {
                    // Prioritize Active records
                    const activeRecord = localResult.find(r => r.InsuranceCompanies.status === 'Active') || localResult[0];
                    const resolvedId = activeRecord.InsuranceCompanies.zoho_creator_id;

                    console.log(`[resolveCompanyId] LOCAL_HIT | Company: "${companyName}" | ID: ${resolvedId}`);
                    basicIO.write(JSON.stringify({
                        success: true,
                        zoho_creator_id: resolvedId,
                        action: 'LOCAL_HIT',
                        companyName: activeRecord.InsuranceCompanies.name
                    }));
                    context.close();
                    return;
                }

                // ── STEP 2: Search Zoho Creator (all_companies report) ──
                let token = await getNewAccessToken();
                const owner = process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner';
                const appName = process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app';

                async function searchCreator(accessToken) {
                    const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies?criteria=(Insurance_Company_Name=="${companyName}")`;
                    console.log(`[resolveCompanyId] Searching Creator: ${reportUrl}`);
                    return fetch(reportUrl, {
                        method: 'GET',
                        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
                    });
                }

                let creatorResponse = await searchCreator(token);
                let creatorData = await creatorResponse.json();
                console.log(`[resolveCompanyId] Creator Response Status: ${creatorResponse.status}`, JSON.stringify(creatorData));

                // Handle token expiration
                if (creatorResponse.status === 401 || (creatorData.code && [1030, 2945].includes(creatorData.code))) {
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    creatorResponse = await searchCreator(token);
                    creatorData = await creatorResponse.json();
                }

                if (creatorData.data && creatorData.data.length > 0) {
                    // Prioritize Active company
                    const activeCompany = creatorData.data.find(c => c.Status === 'Active') || creatorData.data[0];
                    const creatorId = String(activeCompany.ID);

                    // Store in local DB for future lookups
                    try {
                        const table = catalystApp.datastore().table('InsuranceCompanies');
                        await table.insertRow({
                            name: activeCompany.Insurance_Company_Name || companyName,
                            zoho_creator_id: creatorId,
                            status: activeCompany.Status || 'Active'
                        });
                    } catch (dbErr) {
                        console.error("Failed to cache company in local DB:", dbErr.message);
                    }

                    console.log(`[resolveCompanyId] CREATOR_HIT | Company: "${companyName}" | ID: ${creatorId}`);
                    basicIO.write(JSON.stringify({
                        success: true,
                        zoho_creator_id: creatorId,
                        action: 'CREATOR_HIT',
                        companyName: activeCompany.Insurance_Company_Name || companyName
                    }));
                    context.close();
                    return;
                }

                // ── STEP 3: Create new company in Creator ──
                const formName = 'All_Companies1'; // Creator form for companies
                const createUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;
                const createPayload = {
                    data: {
                        Insurance_Company_Name: companyName,
                        Status: 'Pending'
                    }
                };

                let createResponse = await fetch(createUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Zoho-oauthtoken ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(createPayload)
                });
                let createData = await createResponse.json();

                if (createResponse.status === 401 || (createData.code && [1030, 2945].includes(createData.code)) || JSON.stringify(createData).includes("INVALID_OAUTH")) {
                    console.log("Token unexpectedly rejected by Zoho during company creation, forcing hard refresh...");
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    createResponse = await fetch(createUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Zoho-oauthtoken ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(createPayload)
                    });
                    createData = await createResponse.json();
                }

                if (!createResponse.ok || (createData.code && createData.code !== 3000)) {
                    // Creator POST failed — STOP submission entirely
                    console.error(`[resolveCompanyId] CREATION_FAILED | Company: "${companyName}" | Response:`, JSON.stringify(createData));
                    basicIO.write(JSON.stringify({
                        success: false,
                        error: `Failed to create company in Zoho Creator: ${JSON.stringify(createData)}`,
                        action: 'CREATION_FAILED'
                    }));
                    context.close();
                    return;
                }

                const newCreatorId = String(createData.data.ID);

                // Store new company in local DB
                try {
                    const table = catalystApp.datastore().table('InsuranceCompanies');
                    await table.insertRow({
                        name: companyName,
                        zoho_creator_id: newCreatorId,
                        status: 'Pending'
                    });
                } catch (dbErr) {
                    console.error("Failed to store new company in local DB:", dbErr.message);
                }

                console.log(`[resolveCompanyId] CREATED | Company: "${companyName}" | ID: ${newCreatorId}`);
                basicIO.write(JSON.stringify({
                    success: true,
                    zoho_creator_id: newCreatorId,
                    action: 'CREATED',
                    companyName: companyName
                }));
                context.close();

            } catch (err) {
                console.error("resolveCompanyId Error:", err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            /* ================================================================ */
            /*  ACTION: createCompany                                           */
            /*  Direct creation via User Modal                                  */
            /* ================================================================ */
        } else if (action === 'createCompany') {
            const data = basicIO.getArgument('data');

            if (!data || !data.name) {
                basicIO.write(JSON.stringify({ success: false, error: 'Company Name is required' }));
                context.close();
                return;
            }

            try {
                let token = await getNewAccessToken();
                const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || '').replace(/['"]/g, '').trim();
                const appName = (process.env.ZOHO_CREATOR_APP_NAME || '').replace(/['"]/g, '').trim();

                const createUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/All_Companies1`;
                const createPayload = {
                    data: {
                        Insurance_Company_Name: data.name,
                        CC_Invoices_To: data.ccInvoicesTo || "",
                        Invoice_Email: data.invoiceEmail || "",
                        Split_Invoice_from_Report: data.splitInvoice ? true : false,
                        Price_List: data.priceList || "2025 Prices",
                        Status: 'Pending'
                    }
                };

                console.log(`[createCompany] Creating Company: ${createUrl}`, JSON.stringify(createPayload));
                let response = await fetch(createUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Zoho-oauthtoken ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(createPayload)
                });
                let resData = await response.json();
                console.log(`[createCompany] Creator Response Status: ${response.status}`, JSON.stringify(resData));

                if (response.status === 401 || (resData.code && [1030, 2945].includes(resData.code)) || JSON.stringify(resData).includes("INVALID_OAUTH")) {
                    console.log("[createCompany] Token rejected by Zoho, forcing hard refresh...");
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    response = await fetch(createUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Zoho-oauthtoken ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(createPayload)
                    });
                    resData = await response.json();
                    console.log(`[createCompany] Creator Retry Response Status: ${response.status}`, JSON.stringify(resData));
                }

                if (!response.ok || (resData.code && resData.code !== 3000)) {
                    throw new Error(resData.error || `Zoho Creator Error: ${JSON.stringify(resData)}`);
                }

                const creatorId = String(resData.data.ID);

                // Store in local DB
                try {
                    const table = catalystApp.datastore().table('InsuranceCompanies');
                    await table.insertRow({
                        name: data.name,
                        zoho_creator_id: creatorId,
                        status: 'Pending'
                    });
                } catch (dbErr) {
                    console.error("[createCompany] DB Storage Failed:", dbErr.message);
                }

                basicIO.write(JSON.stringify({ success: true, zoho_creator_id: creatorId }));
                context.close();

            } catch (err) {
                console.error("createCompany Error:", err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            /* ================================================================ */
            /*  ACTION: syncInsuranceCompanies (Scheduler)                      */
            /*  Fetches all companies from Zoho Creator and syncs local DB      */
            /* ================================================================ */
        } else if (action === 'syncInsuranceCompanies') {
            try {
                let token = await getNewAccessToken();
                const owner = process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner';
                const appName = process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app';

                // Fetch all companies from Creator (paginated)
                let allCompanies = [];
                let from = 0;
                const limit = 200;
                let hasMore = true;

                while (hasMore) {
                    const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies?from=${from}&limit=${limit}`;
                    const response = await fetch(reportUrl, {
                        method: 'GET',
                        headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
                    });
                    const data = await response.json();

                    // Handle token refresh
                    if (response.status === 401) {
                        cachedToken = null;
                        tokenExpiry = 0;
                        token = await getNewAccessToken();
                        continue; // Retry same page
                    }

                    if (data.data && data.data.length > 0) {
                        allCompanies = allCompanies.concat(data.data);
                        from += limit;
                        if (data.data.length < limit) hasMore = false;
                    } else {
                        hasMore = false;
                    }
                }

                console.log(`[syncInsuranceCompanies] Fetched ${allCompanies.length} companies from Creator`);

                const zcql = catalystApp.zcql();
                const table = catalystApp.datastore().table('InsuranceCompanies');

                // Get all existing local records
                let existingRows = [];
                try {
                    const existingQuery = "SELECT ROWID, name, zoho_creator_id, status FROM InsuranceCompanies";
                    existingRows = await zcql.executeZCQLQuery(existingQuery);
                } catch (e) {
                    console.log("No existing rows or table not ready:", e.message);
                }

                // Build lookup map of existing records by zoho_creator_id
                const existingMap = new Map();
                if (existingRows) {
                    existingRows.forEach(row => {
                        existingMap.set(row.InsuranceCompanies.zoho_creator_id, row.InsuranceCompanies.ROWID);
                    });
                }

                // Build set of Creator IDs for deletion detection
                const creatorIdSet = new Set(allCompanies.map(c => String(c.ID)));

                let inserted = 0, updated = 0, deleted = 0;

                // Upsert: insert new, update existing
                for (const company of allCompanies) {
                    const creatorId = String(company.ID);
                    const companyName = company.Insurance_Company_Name || '';
                    const status = company.Status || 'Active';

                    if (existingMap.has(creatorId)) {
                        // Update existing record
                        try {
                            await table.updateRow({
                                ROWID: existingMap.get(creatorId),
                                name: companyName,
                                zoho_creator_id: creatorId,
                                status: status
                            });
                            updated++;
                        } catch (updateErr) {
                            console.error(`Failed to update company ${companyName}:`, updateErr.message);
                        }
                    } else {
                        // Insert new record
                        try {
                            await table.insertRow({
                                name: companyName,
                                zoho_creator_id: creatorId,
                                status: status
                            });
                            inserted++;
                        } catch (insertErr) {
                            console.error(`Failed to insert company ${companyName}:`, insertErr.message);
                        }
                    }
                }

                // Delete local records that no longer exist in Creator
                for (const [creatorId, rowId] of existingMap.entries()) {
                    if (!creatorIdSet.has(creatorId)) {
                        try {
                            await table.deleteRow(rowId);
                            deleted++;
                        } catch (delErr) {
                            console.error(`Failed to delete stale row ${rowId}:`, delErr.message);
                        }
                    }
                }

                console.log(`[syncInsuranceCompanies] Done — Inserted: ${inserted}, Updated: ${updated}, Deleted: ${deleted}`);
                basicIO.write(JSON.stringify({
                    success: true,
                    message: `Sync complete. Inserted: ${inserted}, Updated: ${updated}, Deleted: ${deleted}`,
                    totalFromCreator: allCompanies.length
                }));
                context.close();

            } catch (err) {
                console.error("syncInsuranceCompanies Error:", err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

        } else {
            basicIO.write(JSON.stringify({ success: false, error: 'Invalid or missing action parameter' }));
            context.close();
        }

    } catch (err) {
        console.error("Function Root Error:", err);
        basicIO.write(JSON.stringify({ success: false, error: "Internal Server Error: " + err.message }));
        context.close();
    }
};
