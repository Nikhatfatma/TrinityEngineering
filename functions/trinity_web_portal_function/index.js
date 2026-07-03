const catalyst = require('zcatalyst-sdk-node');
const portalAuth = require('./portalAuth');

// Helper to transform multi-select options for Zoho Creator
const formatSendCopy = (prefs = []) => {
    console.log("[formatSendCopy] INPUT:", prefs);

    if (!Array.isArray(prefs)) {
        console.log("[formatSendCopy] Warning: prefs is not an array:", prefs);
        return [];
    }

    const mapping = {
        "report": "Report",
        "invoice": "Invoice",
        "notifications": "Notifications",
        "notification": "Notifications"
    };

    const normalized = prefs.map(p => String(p).toLowerCase());

    // Expand "all" into individual options as Zoho Creator expects actual values
    if (normalized.includes("all")) {
        const out = ["Report", "Invoice", "Notifications"];
        console.log("[formatSendCopy] OUTPUT (all):", out);
        return out;
    }

    // Filter, map to correct capitalization, and ensure unique values
    const values = normalized
        .filter(p => p !== "all")
        .map(p => mapping[p] || (p.charAt(0).toUpperCase() + p.slice(1)))
        .filter(Boolean);

    const out = [...new Set(values)];
    console.log("[formatSendCopy] OUTPUT:", out);
    return out;
};

function mapFormDataToCreator(data) {
    // Collect all emails into a unified subform structure
    const unifiedEmails = data.contactEmails || [];

    // Fallback for transition period if old fields arrive
    if (unifiedEmails.length === 0) {
        if (data.iaRecipients) {
            data.iaRecipients.forEach(r => unifiedEmails.push({ ...r, contactType: "IA", sendCopy: r.notificationType }));
        }
        if (data.adjusterEmails) {
            data.adjusterEmails.forEach(r => unifiedEmails.push({ ...r, contactType: "Adjuster (Carrier)", sendCopy: r.sendCopyOf }));
        }
    }

    // Sort emails to group by type: Adjuster (Carrier) first, then IA
    const sortedEmails = [...unifiedEmails].sort((a, b) => {
        const typeA = a.contactType || "";
        const typeB = b.contactType || "";

        // Define priority: Adjuster (Carrier) = 1, IA = 2
        const priority = { "Adjuster (Carrier)": 1, "IA": 2 };
        return (priority[typeA] || 99) - (priority[typeB] || 99);
    });

    const contactSubform = sortedEmails.filter(r => r.email).map((r, i) => {
        const formatted = formatSendCopy(r.sendCopy || []);

        // Map frontend contact types to Zoho Creator pick-list options
        let typeMapping = r.contactType;
        if (r.contactType === "Adjuster (Carrier)") {
            typeMapping = "Ins Adjuster (Carrier)";
        } else if (r.contactType === "IA") {
            typeMapping = "Independent Adjuster";
        }

        return {
            "Email": r.email,
            "Type_field": typeMapping,
            "Send_Copy_Of": formatted
        };
    });


    // Exact matches for the Radio options in Zoho Creator (engineering-inspections)
    const inspectionMapping = {
        "storm-damage": "Residential Storm Damage",
        "commercial-municipal-industrial": "Commercial/Municipal/Ind",
        "structural-loss": "Structural Damage",
        "large-complex-loss": "Large / Complex Loss",
        "water-loss": "Water Loss",
        "interior-water-loss": "Water Loss",
        "plumbing-failure": "Water Loss",
        "Interior Water Loss": "Water Loss",
        "Plumbing Failure": "Water Loss",
        "lightning-damage": "Lightning Damage",
        "vandalism": "Vandalism",
        "chimney-fire-collapse": "Chimney Fire / Collapse",
        "component-failure": "Component Failure",
        "hvac-electrical": "HVAC/Electrical",
        "small-fire": "Small Fire",
    };

    const buildingMapping = {
        "residential": "Residential",
        "commercial-municipal-industrial": "Commercial/Municipal/Ind",
        "multiple-structures": "Multiple Structures"
    };

    const inspectionType = inspectionMapping[data.inspectionType] || data.inspectionType || "";
    const buildingType = buildingMapping[data.buildingType] || data.buildingType || "";

    const primaryAdjuster = data.contactEmails.find(c => c.contactType === "Adjuster (Carrier)") || {};
    const primaryIA = data.contactEmails.find(c => c.contactType === "IA") || {};

    // Combine all emails into a single subform as before
    const unifiedSubform = data.contactEmails.map(c => ({
        Email: c.email || "",
        Type_field: c.contactType === "IA" ? "Independent Adjuster" : "Ins Adjuster (Carrier)",
        Send_Copy_Of: formatSendCopy(c.sendCopy || [])
    }));

    return {
        data: {
            Inspection_Type: inspectionType,
            Building_Type: buildingType,
            Claim_Number: data.claimNumber || "",
            Insurance_Company: data.insuranceCompany || "",
            Client_Email: primaryAdjuster.email || "",
            IA_Email: primaryIA.email || "",
            Adjuster_Name: {
                first_name: data.adjusterFirstName || "",
                last_name: data.adjusterLastName || ""
            },
            Adjuster_Phone: data.adjusterPhone || "",
            Adjuster_Phone_Extension: data.adjusterPhoneExt || "",
            Second_Email_for_Report_Submission: data.secondEmailForReport || "",
            Adjuster_s_Comments_and_Special_Notes_or_Instructions: data.adjusterComments || "",
            This_Claim_Is_Being_Submitted_by_an_IA: data.isIAClaim ? "true" : "false",
            IA_Name: {
                first_name: data.iaFirstName || "",
                last_name: data.iaLastName || ""
            },
            IA_Phone: data.iaPhone || "",
            IA_Company_Name: data.iaCompany || "",
            IA_Company: data.iaCompanyName || "",
            Notification_Preferences: unifiedSubform,
            PH_Name_Individual: {
                first_name: data.policyholderFirstName || "",
                last_name: data.policyholderLastName || ""
            },
            PH_Name_Commercial: data.buildingType === 'commercial-municipal-industrial' ? (data.policyholderFirstName + " " + data.policyholderLastName).trim() : "",
            PH_Phone_1: [data.policyholderPhone1, data.policyholderPhone1Extra].filter(Boolean).join(", "),
            Property_Contact_Email: data.propertyContactEmail || "",
            Spouse_or_Second_Policyholder: {
                first_name: data.spouseFirstName || "",
                last_name: data.spouseLastName || ""
            },
            Policyholder_Phone_2: data.policyholderPhone2 || "",
            Inspection_Address: {
                address_line_1: data.streetAddress || "",
                address_line_2: data.addressLine2 || "",
                district_city: data.city || "",
                state_province: data.state || "",
                postal_code: data.zip || ""
            },
            Date_of_Loss: data.dateOfLoss || "",
            Policy_Number: data.policyNumber || "",
            ...(data.insuranceDocumentUrl ? { Insurance_Document_URL: data.insuranceDocumentUrl } : {}),
            Adjuster_Company: data.adjusterCompany || "",
            Primary_Client: data.primaryClientType || "",
            Primary_Client_Type_Selection: data.primaryClientType ? [data.primaryClientType] : [],
            Roofer_Name: {
                first_name: data.rooferName || "",
                last_name: ""
            },
            Roofer_Company: data.rooferCompany || "",
            Roofer_Phone: data.rooferPhone || "",
            Roofer_Email: data.rooferEmail || "",
            Public_Adjuster_Name: {
                first_name: data.publicAdjusterName || "",
                last_name: ""
            },
            Public_Adjuster_Company: data.publicAdjusterCompany || "",
            Public_Adjuster_Phone: data.publicAdjusterPhone || "",
            Public_Adjuster_Email: data.publicAdjusterEmail || "",
            // Inspection_Request: inspectionType, // Disabled: This is a Lookup field and needs an ID, not a string
            Inspection_Name: `${(data.policyholderFirstName + " " + data.policyholderLastName).trim()} - ${inspectionType}`
        }
    };
}

const IA_COMPANY_TYPE = 'IA Company';

function getRowCompanyType(row) {
    return String(row?.InsuranceCompanies?.company_type || '').trim();
}

function getZohoCompanyType(company) {
    return String(company?.Company_Type || '').trim();
}

function isInsuranceCompanyRow(row) {
    return getRowCompanyType(row) !== IA_COMPANY_TYPE;
}

function isIaCompanyRow(row) {
    return getRowCompanyType(row) === IA_COMPANY_TYPE;
}

async function fetchInsuranceCompanyRows(zcql, whereClause = '') {
    const baseFields = 'ROWID, name, zoho_creator_id, status';
    const where = whereClause ? ` WHERE ${whereClause}` : '';
    try {
        return await zcql.executeZCQLQuery(`SELECT ${baseFields}, company_type FROM InsuranceCompanies${where}`);
    } catch (err) {
        console.warn('[InsuranceCompanies] company_type unavailable, using legacy query:', err.message);
        return await zcql.executeZCQLQuery(`SELECT ${baseFields} FROM InsuranceCompanies${where}`);
    }
}

async function fetchIaCompaniesFromZoho() {
    let token = await getNewAccessToken();
    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'trinity5').trim();
    const appName = process.env.ZOHO_COMPANIES_APP_NAME || process.env.ZOHO_CREATOR_APP_NAME || 'engineering-inspections';

    let allIaCompanies = [];
    let from = 0;
    const limit = 200;
    let hasMore = true;

    while (hasMore) {
        const criteria = encodeURIComponent('((Company_Type=="IA Company")&&(Status=="Active"))');
        const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies_List?criteria=${criteria}&from=${from}&limit=${limit}`;
        let response = await fetch(reportUrl, {
            method: 'GET',
            headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
        });

        if (response.status === 401) {
            cachedToken = null;
            tokenExpiry = 0;
            token = await getNewAccessToken();
            response = await fetch(reportUrl, {
                method: 'GET',
                headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
            });
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Zoho report fetch failed (${response.status})`);
        }

        if (data.data && data.data.length > 0) {
            allIaCompanies = allIaCompanies.concat(data.data);
            from += limit;
            if (data.data.length < limit) hasMore = false;
        } else {
            hasMore = false;
        }
    }

    return allIaCompanies;
}

async function resolveIaCompanyIdFromZoho(companyName) {
    const safeIaName = companyName.replace(/'/g, "''");
    let token = await getNewAccessToken();
    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'trinity5').trim();
    const appName = process.env.ZOHO_COMPANIES_APP_NAME || process.env.ZOHO_CREATOR_APP_NAME || 'engineering-inspections';
    const criteria = encodeURIComponent(`((Company_Type=="IA Company")&&(Status=="Active")&&(Insurance_Company_Name=="${safeIaName}"))`);
    const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies_List?criteria=${criteria}&limit=1`;
    const response = await fetch(reportUrl, {
        method: 'GET',
        headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
    });
    const zohoData = await response.json();
    if (zohoData.data && zohoData.data.length > 0) {
        return String(zohoData.data[0].ID);
    }
    return null;
}

let cachedToken = null;
let tokenExpiry = 0;
let tokenPromise = null;

async function getNewAccessToken(forceRefresh = false) {
    if (!forceRefresh && cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }
    if (forceRefresh) {
        cachedToken = null;
        tokenExpiry = 0;
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

async function uploadFileToWorkDrive(accessToken, fileName, fileBuffer, mimeType, folderId) {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType || 'application/octet-stream' });
    formData.append('content', blob, fileName);

    const uploadUrl = `https://workdrive.zoho.com/api/v1/upload?filename=${encodeURIComponent(fileName)}&override-name-exist=true&parent_id=${encodeURIComponent(folderId)}`;
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        body: formData
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(`WorkDrive upload failed (HTTP ${response.status}): ${JSON.stringify(responseData)}`);
    }

    const resource = responseData?.data?.[0];
    const attrs = resource?.attributes || {};
    const documentUrl = attrs.permalink || attrs.Permalink || attrs.web_url || attrs.download_url;
    const fileId = attrs.resource_id || resource?.id;

    if (documentUrl) {
        return documentUrl;
    }
    if (fileId) {
        return `https://workdrive.zoho.com/file/${fileId}`;
    }

    throw new Error('WorkDrive upload succeeded but no document URL was returned.');
}

async function processInsuranceDocumentUpload(data, accessToken) {
    if (data?.insuranceDocument && (!data.insuranceDocuments || !Array.isArray(data.insuranceDocuments))) {
        data.insuranceDocuments = [data.insuranceDocument];
    }

    if (!data?.insuranceDocuments || !Array.isArray(data.insuranceDocuments) || data.insuranceDocuments.length === 0) {
        delete data.insuranceDocument;
        delete data.insuranceDocuments;
        return;
    }

    const folderId = (process.env.ZOHO_WORKDRIVE_FOLDER_ID || '').replace(/['"]/g, '').trim();
    if (!folderId) {
        throw new Error('Document upload is not configured. Please contact support.');
    }

    const uploadedUrls = [];
    const categoryCounts = {};

    for (const doc of data.insuranceDocuments) {
        if (!doc || !doc.base64 || !doc.fileName) continue;

        let categoryName = 'Other';
        if (doc.categories && Array.isArray(doc.categories) && doc.categories.length > 0) {
            categoryName = doc.categories.join('_');
            if (doc.categories.includes('Other') && doc.customCategory) {
                categoryName = categoryName.replace('Other', doc.customCategory.trim());
            }
        } else {
            categoryName = (doc.category || 'Other').trim();
            if (categoryName === 'Other' && doc.customCategory) {
                categoryName = doc.customCategory.trim();
            }
        }

        let cleanedCategory = categoryName
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_-]/g, '');

        if (!cleanedCategory) {
            cleanedCategory = 'Document';
        }

        categoryCounts[cleanedCategory] = (categoryCounts[cleanedCategory] || 0) + 1;
        const sequence = categoryCounts[cleanedCategory];

        const extMatch = doc.fileName.match(/\.[^.]+$/);
        const ext = extMatch ? extMatch[0] : '';

        const newFileName = `${cleanedCategory}_${sequence}${ext}`;

        const buffer = Buffer.from(doc.base64, 'base64');
        const fileUrl = await uploadFileToWorkDrive(
            accessToken,
            newFileName,
            buffer,
            doc.mimeType,
            folderId
        );
        
        uploadedUrls.push(fileUrl);
    }

    if (uploadedUrls.length > 0) {
        data.insuranceDocumentUrl = `https://workdrive.zoho.com/folder/${folderId}`;
        console.log('[WorkDrive] Uploaded documents successfully:', uploadedUrls);
    }

    delete data.insuranceDocument;
    delete data.insuranceDocuments;
}

async function notifyFailureOnCliq({ rowId, payload, claimNumber, adjusterEmail, errorDetails, createdTime }) {
    try {
        const zapiKey = (process.env.ZOHO_CRM_ZAPIKEY || '').trim();
        if (!zapiKey) {
            console.warn('[Cliq Notify] ZOHO_CRM_ZAPIKEY not set — skipping');
            return;
        }
        const adminUrl = process.env.ADMIN_PORTAL_URL || 'https://trinitypllc.com/admin/failed-submissions';
        const body = {
            message: `Trinity: Failure While Adding Record from Portal Error: ${errorDetails || 'Unknown error'}`,
            url: adminUrl,
            ROWID: String(rowId || ''),
            Payload: typeof payload === 'string' ? payload : JSON.stringify(payload || {}),
            ClaimNumber: claimNumber || 'Unknown',
            AdjusterEmail: adjusterEmail || 'Unknown',
            ErrorDetails: errorDetails || '',
            CREATEDTIME: createdTime || new Date().toISOString()
        };
        const crmFunctionUrl = `https://www.zohoapis.com/crm/v7/functions/restaurantcanadalogcliq1/actions/execute?auth_type=apikey&zapikey=${zapiKey}`;
        const res = await fetch(crmFunctionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        console.log('[Cliq Notify] Response:', JSON.stringify(await res.json()));
    } catch (err) {
        console.error('[Cliq Notify] Failed:', err.message);
    }
}

module.exports = async (context, basicIO) => {
    try {
        const catalystApp = catalyst.initialize(context);

        // Robust argument retrieval
        let body = {};
        try {
            let requestBody = null;
            // Check for different method names depending on Catalyst environment version
            if (typeof basicIO.getRequestBody === 'function') {
                requestBody = basicIO.getRequestBody();
            } else if (typeof basicIO.getRequestBodyAsString === 'function') {
                requestBody = basicIO.getRequestBodyAsString();
            }

            if (requestBody) body = JSON.parse(requestBody);
        } catch (e) {
            console.log("Body parse attempt failed or not available:", e.message);
        }

        const getParam = (key) => {
            let val = basicIO.getArgument(key);
            // If not found in arguments, look in the manually parsed body
            if (val === null || val === undefined || val === '') {
                val = body[key];
            }
            if (Array.isArray(val)) return val[0];
            return val;
        };

        const actionRaw = getParam('action');
        const action = String(actionRaw || '').replace(/['"]/g, '').trim();
        const getArg = (key) => getParam(key);

        console.log("Environment Variable Keys:", Object.keys(process.env).filter(k => k.startsWith('ZOHO_')));
        console.log("Final Action Parsed:", action);

        if (action === 'submitInspection') {
            const data = getArg('data');

            // STEP 1: Incoming Form Data
            console.log("STEP 1: Incoming Form Data:", JSON.stringify(data, null, 2));

            // 1. Strict Backend Validation
            if (!data) {
                basicIO.write(JSON.stringify({ success: false, error: 'No data provided' }));
                context.close();
                return;
            }

            const requiredFields = [
                'inspectionType', 'claimNumber',
                'policyholderFirstName', 'policyholderLastName',
                'streetAddress', 'city', 'state', 'zip'
            ];

            const missingFields = requiredFields.filter(field => !data[field] || String(data[field]).trim() === "");

            // Primary Adjuster Email check
            const primaryEmail = (data.contactEmails || []).find(c => c.contactType === "Adjuster (Carrier)")?.email;
            if (!primaryEmail || primaryEmail.trim() === "") {
                missingFields.push('adjusterEmail (Primary Carrier Adjuster)');
            }

            if (missingFields.length > 0) {
                basicIO.write(JSON.stringify({
                    success: false,
                    error: `Validation Error: Missing required fields: ${missingFields.join(', ')}`
                }));
                context.close();
                return;
            }

            // Normalize claimNumber
            data.claimNumber = String(data.claimNumber).trim();

            // Date of Loss format validation (MM/DD/YYYY)
            if (data.dateOfLoss) {
                const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                if (!dateRegex.test(data.dateOfLoss)) {
                    basicIO.write(JSON.stringify({
                        success: false,
                        error: `Validation Error: Date of Loss must be in MM/DD/YYYY format (received: ${data.dateOfLoss})`
                    }));
                    context.close();
                    return;
                }
            }

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
                        const dupErrMsg = `Duplicate Submission: Claim #${data.claimNumber} was already processed within the last ${hours} hours.`;
                        await notifyFailureOnCliq({
                            rowId: String(existing[0].ProcessedClaims.ROWID || ''),
                            payload: JSON.stringify(data),
                            claimNumber: data.claimNumber || 'Unknown',
                            adjusterEmail: (data.contactEmails || []).find(c => c.contactType === 'Adjuster (Carrier)')?.email || 'Unknown',
                            errorDetails: dupErrMsg,
                            createdTime: new Date().toISOString()
                        });
                        basicIO.write(JSON.stringify({ success: false, error: dupErrMsg }));
                        context.close();
                        return;
                    }
                }
            } catch (err) {
                console.error("Duplicate check skipped (table may not exist yet or ZCQL error):", err.message);
            }

            // FIX: The frontend sends zoho_creator_id directly. Look it up in DB to confirm it's valid.
            if (data.insuranceCompany && data.insuranceCompany.trim()) {
                const incomingValue = data.insuranceCompany.trim();
                let resolvedId = null;

                // Check if it's already a Zoho Creator ID (numeric string)
                if (/^\d+$/.test(incomingValue)) {
                    // It's already an ID — look it up in DB by zoho_creator_id to confirm
                    try {
                        const zcqlResolve = catalystApp.zcql();
                        const resolveQuery = `SELECT ROWID, name, zoho_creator_id, status FROM InsuranceCompanies WHERE zoho_creator_id = '${incomingValue}'`;
                        const resolveResult = await zcqlResolve.executeZCQLQuery(resolveQuery);
                        if (resolveResult && resolveResult.length > 0) {
                            resolvedId = incomingValue; // Already a valid Creator ID
                            console.log("[Insurance Resolve] DB HIT | ID:", resolvedId);
                        }
                    } catch (dbErr) {
                        console.error("[Insurance Resolve] DB lookup failed:", dbErr.message);
                    }

                    // If not in DB, trust it anyway (it came from the portal selection)
                    if (!resolvedId) {
                        resolvedId = incomingValue;
                        console.log("[Insurance Resolve] Using provided ID directly:", resolvedId);
                    }
                } else {
                    // It's a company name string — do the full name→ID resolve
                    const companyName = incomingValue;
                    try {
                        const zcqlResolve = catalystApp.zcql();
                        const safeCompanyName = companyName.replace(/'/g, "''");
                        const resolveResult = await fetchInsuranceCompanyRows(zcqlResolve, `name = '${safeCompanyName}'`);
                        const insuranceMatches = (resolveResult || []).filter(isInsuranceCompanyRow);
                        if (insuranceMatches.length > 0) {
                            const activeRecord = insuranceMatches.find(r => r.InsuranceCompanies.status === 'Active') || insuranceMatches[0];
                            resolvedId = activeRecord.InsuranceCompanies.zoho_creator_id || null;
                            if (resolvedId) console.log("[Insurance Resolve] DB HIT by name | ID:", resolvedId);
                        }
                    } catch (dbErr) {
                        console.error("[Insurance Resolve] DB lookup failed:", dbErr.message);
                    }
                }

                // STEP 4: Replace with resolved ID, or handle failure inline
                if (!resolvedId) {
                    const resolveErrMsg = `Insurance Company could not be resolved for value "${incomingValue}". Please verify the company name or contact support.`;
                    console.error('[Insurance Resolve]', resolveErrMsg);

                    // Save to FailedSubmissions so admin can retry
                    let savedRow = null;
                    try {
                        const failTable = catalystApp.datastore().table('FailedSubmissions');
                        savedRow = await failTable.insertRow({
                            Payload: JSON.stringify(data),
                            ClaimNumber: data.claimNumber || 'Unknown',
                            AdjusterEmail: (data.contactEmails || []).find(c => c.contactType === 'Adjuster (Carrier)')?.email || 'Unknown',
                            ErrorDetails: resolveErrMsg,
                            Resolved: false
                        });
                    } catch (dbErr) {
                        console.error('[Insurance Resolve] Could not save to FailedSubmissions:', dbErr.message);
                    }

                    await notifyFailureOnCliq({
                        rowId: savedRow?.ROWID,
                        payload: JSON.stringify(data),
                        claimNumber: data.claimNumber || 'Unknown',
                        adjusterEmail: (data.contactEmails || []).find(c => c.contactType === 'Adjuster (Carrier)')?.email || 'Unknown',
                        errorDetails: resolveErrMsg,
                        createdTime: new Date().toISOString()
                    });

                    basicIO.write(JSON.stringify({ success: false, error: resolveErrMsg }));
                    context.close();
                    return;
                }
                console.log("[Creator API] Resolved Insurance Company ID:", resolvedId);
                data.insuranceCompany = resolvedId;
            }

            if (data.isIAClaim && data.iaCompany && data.iaCompany.trim()) {
                const incomingIaValue = data.iaCompany.trim();
                let resolvedIaId = null;

                if (/^\d+$/.test(incomingIaValue)) {
                    resolvedIaId = incomingIaValue;
                    console.log("[IA Resolve] Using provided ID directly:", resolvedIaId);
                } else {
                    const safeIaName = incomingIaValue.replace(/'/g, "''");
                    try {
                        const zcqlResolve = catalystApp.zcql();
                        const resolveResult = await fetchInsuranceCompanyRows(zcqlResolve, `name = '${safeIaName}'`);
                        const iaMatches = (resolveResult || []).filter(isIaCompanyRow);
                        if (iaMatches.length > 0) {
                            const activeRecord = iaMatches.find(r => r.InsuranceCompanies.status === 'Active') || iaMatches[0];
                            resolvedIaId = activeRecord.InsuranceCompanies.zoho_creator_id || null;
                            if (resolvedIaId) console.log("[IA Resolve] DB HIT by name | ID:", resolvedIaId);
                        }
                    } catch (dbErr) {
                        console.error("[IA Resolve] DB lookup failed:", dbErr.message);
                    }

                    if (!resolvedIaId) {
                        try {
                            resolvedIaId = await resolveIaCompanyIdFromZoho(incomingIaValue);
                            if (resolvedIaId) console.log("[IA Resolve] Zoho HIT by name | ID:", resolvedIaId);
                        } catch (iaErr) {
                            console.error("[IA Resolve] Zoho lookup failed:", iaErr.message);
                        }
                    }
                }

                if (!resolvedIaId) {
                    const iaErrMsg = `IA Company could not be resolved for value "${incomingIaValue}". Please select a company from the list.`;
                    console.error('[IA Resolve]', iaErrMsg);
                    basicIO.write(JSON.stringify({ success: false, error: iaErrMsg }));
                    context.close();
                    return;
                }

                if (!data.iaCompanyName) {
                    data.iaCompanyName = incomingIaValue;
                }
                data.iaCompany = resolvedIaId;
            }

            console.log("Contact Emails RAW:", data.contactEmails);
            const primaryAdj = (data.contactEmails || []).find(c => c.contactType === "Adjuster (Carrier)");
            console.log("Primary Adjuster sendCopy RAW:", primaryAdj?.sendCopy);

            let token = await getNewAccessToken();
            try {
                await processInsuranceDocumentUpload(data, token);
            } catch (uploadErr) {
                basicIO.write(JSON.stringify({ success: false, error: uploadErr.message || 'Document upload failed.' }));
                context.close();
                return;
            }

            const creatorPayload = mapFormDataToCreator(data);

            // FINAL PAYLOAD LOGGING (VERY IMPORTANT FOR DEBUGGING)
            console.log("FINAL CREATOR PAYLOAD (MM/DD/YYYY):", JSON.stringify(creatorPayload, null, 2));
            console.log("Contact Emails Subform payload:", JSON.stringify((creatorPayload.data.Notification_Preferences || []).map(s => s.Send_Copy_Of)));

            // Check if Adjuster_Send_Copy_Of is empty or undefined
            if (!creatorPayload.data.Adjuster_Send_Copy_Of || creatorPayload.data.Adjuster_Send_Copy_Of.length === 0) {
                console.warn("WARNING: Adjuster_Send_Copy_Of is empty or not being set properly");
            }

            try {
                async function submitToCreator(accessToken) {
                    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner').replace(/['"]/g, '').trim();
                    const appName = (process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app').replace(/['"]/g, '').trim();
                    const formName = (process.env.ZOHO_CREATOR_FORM_NAME || 'Inspection_Request_Public_Submission').replace(/['"]/g, '').trim();
                    const creatorUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;

                    console.log(`[Creator API] Submitting to URL: ${creatorUrl}`);
                    console.log(`[Creator API] Form Name used: ${formName}`);

                    // FIX: Improved logging for debugging
                    console.log("[Creator API] Payload:", JSON.stringify(creatorPayload, null, 2));

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

                // STEP 6: Zoho Response
                console.log("STEP 6: Zoho Response:", JSON.stringify(responseData, null, 2));

                // FIX: Log response for debugging
                // console.log("[Creator API] Response Data:", JSON.stringify(responseData, null, 2)); // Duplicate of Step 6

                // 3. Token Refresh Logic
                // If token is rejected by Zoho despite cache validity, force a hard refresh
                if (response.status === 401 || (responseData.code && [1030, 2945].includes(responseData.code)) || JSON.stringify(responseData).includes("INVALID_OAUTH")) {
                    console.log("Token unexpectedly rejected by Zoho, forcing hard refresh...");
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    response = await submitToCreator(token);
                    responseData = await response.json();
                    console.log("[Creator API] Retry Response Data:", JSON.stringify(responseData, null, 2));
                }

                // FIX: Added Zoho response code validation (3000 = success)
                if (!response.ok || (responseData.code && responseData.code !== 3000)) {
                    throw new Error(`Creator API Error (HTTP ${response.status}): ${JSON.stringify(responseData)}`);
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
                let insertedRow = null;
                try {
                    insertedRow = await table.insertRow({
                        Payload: JSON.stringify(data),
                        ClaimNumber: data.claimNumber || 'Unknown',
                        AdjusterEmail: (data.contactEmails || []).find(c => c.contactType === 'Adjuster (Carrier)')?.email || 'Unknown',
                        ErrorDetails: err.message || JSON.stringify(err),
                        Resolved: false
                    });
                } catch (dbErr) {
                    console.error("Failed to insert into Datastore:", dbErr);
                }

                // Cliq notification
                await notifyFailureOnCliq({
                    rowId: insertedRow?.ROWID,
                    payload: JSON.stringify(data),
                    claimNumber: data.claimNumber || 'Unknown',
                    adjusterEmail: (data.contactEmails || []).find(c => c.contactType === 'Adjuster (Carrier)')?.email || 'Unknown',
                    errorDetails: err.message || JSON.stringify(err),
                    createdTime: new Date().toISOString()
                });

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
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: '',
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `getFailedSubmissions DB query failed: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'retrySubmission') {
            const rowId = getArg('rowId');
            if (!rowId) {
                basicIO.write(JSON.stringify({ success: false, error: 'rowId is required for retries' }));
                context.close();
                return;
            }

            let retryRow = null;
            let retryData = null;
            try {
                const table = catalystApp.datastore().table('FailedSubmissions');
                retryRow = await table.getRow(rowId);
                retryData = JSON.parse(retryRow.Payload);
                const row = retryRow;
                const data = retryData;
                const creatorPayload = mapFormDataToCreator(data);

                let token = await getNewAccessToken();

                async function submitToCreator(accessToken) {
                    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner').replace(/['"]/g, '').trim();
                    const appName = (process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app').replace(/['"]/g, '').trim();
                    const formName = (process.env.ZOHO_CREATOR_FORM_NAME || 'Inspection_Request_Public_Submission').replace(/['"]/g, '').trim();
                    const creatorUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;
                    console.log(`[Creator API Retry] Submitting to URL: ${creatorUrl}`);
                    console.log(`[Creator API Retry] Form Name used: ${formName}`);

                    // FIX: Improved logging for debugging
                    console.log("[Creator API Retry] Payload:", JSON.stringify(creatorPayload, null, 2));

                    return fetch(creatorUrl, {
                        method: 'POST',
                        headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(creatorPayload)
                    });
                }

                let response = await submitToCreator(token);
                let responseData = await response.json();

                // FIX: Log response for debugging
                console.log("[Creator API Retry] Response Data:", JSON.stringify(responseData, null, 2));

                // Retry specific Token Refresh logic
                if (response.status === 401 || (responseData.code && [1030, 2945].includes(responseData.code)) || JSON.stringify(responseData).includes("INVALID_OAUTH")) {
                    console.log("Token rejected on retry, forcing hard refresh...");
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    response = await submitToCreator(token);
                    responseData = await response.json();
                    console.log("[Creator API Retry] Retry Response Data:", JSON.stringify(responseData, null, 2));
                }

                // FIX: Improved error message for consistency
                if (!response.ok || (responseData.code && responseData.code !== 3000)) {
                    await table.updateRow({ ROWID: rowId, ErrorDetails: JSON.stringify(responseData) });
                    throw new Error(`Retry failed (HTTP ${response.status}): ${JSON.stringify(responseData)}`);
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
                await notifyFailureOnCliq({
                    rowId: rowId,
                    payload: retryRow?.Payload,
                    claimNumber: retryData?.claimNumber || 'Unknown',
                    adjusterEmail: (retryData?.contactEmails || []).find(c => c.contactType === 'Adjuster (Carrier)')?.email || 'Unknown',
                    errorDetails: err.message,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

        } else if (action === 'updateFailedSubmission') {
            const rowId = getArg('rowId');
            const newPayload = getArg('payload');

            if (!rowId || !newPayload) {
                basicIO.write(JSON.stringify({ success: false, error: 'rowId and payload are required' }));
                context.close();
                return;
            }

            try {
                const table = catalystApp.datastore().table('FailedSubmissions');
                await table.updateRow({
                    ROWID: rowId,
                    Payload: typeof newPayload === 'string' ? newPayload : JSON.stringify(newPayload)
                });
                basicIO.write(JSON.stringify({ success: true, message: 'Submission record updated successfully.' }));
            } catch (err) {
                console.error("Update Failed Submission Error:", err);
                await notifyFailureOnCliq({
                    rowId: String(rowId || ''),
                    payload: typeof newPayload === 'string' ? newPayload : JSON.stringify(newPayload || {}),
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `updateFailedSubmission DB update failed for ROWID ${rowId}: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'deleteFailedSubmission') {
            const rowId = getArg('rowId');

            if (!rowId) {
                basicIO.write(JSON.stringify({ success: false, error: 'rowId is required' }));
                context.close();
                return;
            }

            try {
                const table = catalystApp.datastore().table('FailedSubmissions');
                await table.deleteRow(rowId);
                basicIO.write(JSON.stringify({ success: true, message: 'Record deleted successfully.' }));
            } catch (err) {
                console.error("Delete Failed Submission Error:", err);
                await notifyFailureOnCliq({
                    rowId: String(rowId || ''),
                    payload: '',
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `deleteFailedSubmission DB delete failed for ROWID ${rowId}: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'getCompanyTypes') {
            const zcql = catalystApp.zcql();
            try {
                const allCompanies = await fetchInsuranceCompanyRows(zcql, "status = 'Active'");
                const typesSet = new Set();
                (allCompanies || []).forEach(row => {
                    const type = row.InsuranceCompanies.company_type;
                    if (type) {
                        typesSet.add(type.trim());
                    }
                });
                
                // Ensure default types are present just in case DB is empty for them
                ['Insurance Company', 'IA Company'].forEach(t => typesSet.add(t));
                
                const uniqueTypes = Array.from(typesSet).sort();
                
                basicIO.write(JSON.stringify({ success: true, results: uniqueTypes }));
            } catch (err) {
                console.error("getCompanyTypes Error:", err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

            /* ================================================================ */
            /*  ACTION: searchInsuranceCompanies                                */
            /*  Searches both InsuranceCompanies.name and InsuranceAliases      */
            /*  Returns: { results: [{ id, name, zoho_creator_id }],           */
            /*            matchedBy: "name" | "alias" }                         */
            /* ================================================================ */
        } else if (action === 'searchInsuranceCompanies') {
            const search = (getArg('search') || '').trim();

            const zcql = catalystApp.zcql();
            // ZCQL LIKE is case-sensitive and ZCQL does NOT support LOWER()/UPPER().
            // Fix: fetch all active rows and filter in JS for case-insensitive matching.
            const searchLower = search.toLowerCase();

            try {
                let results = [];
                let nameFound = false;
                let aliasFound = false;

                // 1. Fetch all active companies and filter in JS (case-insensitive)
                console.log(`[ZCQL Name Search] Fetching active companies for search: "${search}"`);
                const allCompanies = await fetchInsuranceCompanyRows(zcql, "status = 'Active'");
                console.log(`[ZCQL Name Search] Total active companies: ${allCompanies ? allCompanies.length : 0}`);

                // Case-insensitive filter in application code (exclude IA companies)
                const nameMatches = (allCompanies || []).filter(row =>
                    isInsuranceCompanyRow(row) &&
                    (row.InsuranceCompanies.name || '').toLowerCase().includes(searchLower)
                );
                console.log(`[ZCQL Name Search] Matches for "${search}": ${nameMatches.length}`);

                if (nameMatches.length > 0) {
                    nameFound = true;
                    results = nameMatches.map(row => ({
                        id: row.InsuranceCompanies.ROWID,
                        name: row.InsuranceCompanies.name,
                        zoho_creator_id: row.InsuranceCompanies.zoho_creator_id
                    }));
                }

                // 2. Fetch all aliases and filter in JS (case-insensitive)
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
                    const companyIds = [...new Set(aliasMatches.map(r => r.InsuranceAliases.company_id).filter(id => id !== null))];

                    for (const companyId of companyIds) {
                        try {
                            // Check if company already added by name match to avoid duplicates
                            if (results.some(r => String(r.id) === String(companyId))) {
                                aliasFound = true;
                                continue;
                            }

                            // ROWID is numeric BigInt — do not wrap in single quotes
                            const companyResult = await fetchInsuranceCompanyRows(zcql, `ROWID = ${companyId} AND status = 'Active'`);
                            console.log(`[ZCQL Company Lookup] Result: ${companyResult ? companyResult.length : 0}`);
                            if (companyResult && companyResult.length > 0 && isInsuranceCompanyRow(companyResult[0])) {
                                aliasFound = true;
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
                }

                // Determine matchedBy
                let matchedBy = 'name';
                if (nameFound && aliasFound) matchedBy = 'both';
                else if (aliasFound) matchedBy = 'alias';

                // Sort results alphabetically by name
                results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                basicIO.write(JSON.stringify({ success: true, results, matchedBy }));
                context.close();

            } catch (err) {
                console.error("searchInsuranceCompanies Error:", err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ search }),
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `searchInsuranceCompanies failed for query "${search}": ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            /* ================================================================ */
            /*  ACTION: searchIaCompanies                                       */
            /*  Local InsuranceCompanies cache (company_type = IA Company),     */
            /*  with Zoho fallback until sync populates local data              */
            /* ================================================================ */
        } else if (action === 'searchIaCompanies') {
            const search = (getArg('search') || '').trim().toLowerCase();

            try {
                const zcql = catalystApp.zcql();
                let results = [];
                let usedLocalDb = false;

                try {
                    const allActive = await fetchInsuranceCompanyRows(zcql, "status = 'Active'");
                    const hasLocalIaData = (allActive || []).some(isIaCompanyRow);

                    if (hasLocalIaData) {
                        usedLocalDb = true;
                        results = (allActive || [])
                            .filter(isIaCompanyRow)
                            .filter(row => !search || (row.InsuranceCompanies.name || '').toLowerCase().includes(search))
                            .map(row => ({
                                id: row.InsuranceCompanies.zoho_creator_id,
                                name: row.InsuranceCompanies.name,
                                zoho_creator_id: row.InsuranceCompanies.zoho_creator_id,
                                status: row.InsuranceCompanies.status
                            }))
                            .sort((a, b) => a.name.localeCompare(b.name));
                    }
                } catch (localErr) {
                    console.warn('[searchIaCompanies] Local lookup failed, falling back to Zoho:', localErr.message);
                }

                if (!usedLocalDb) {
                    const allIaCompanies = await fetchIaCompaniesFromZoho();
                    results = allIaCompanies
                        .map((row) => ({
                            id: String(row.ID),
                            name: String(row.Insurance_Company_Name || '').trim(),
                            zoho_creator_id: String(row.ID),
                            status: String(row.Status || '').trim(),
                        }))
                        .filter((row) => row.name)
                        .filter((row) => row.status === 'Active')
                        .filter((row) => !search || row.name.toLowerCase().includes(search))
                        .sort((a, b) => a.name.localeCompare(b.name));
                }

                console.log(`[searchIaCompanies] Returning ${results.length} IA companies for search "${search}" (source: ${usedLocalDb ? 'local' : 'zoho'})`);
                basicIO.write(JSON.stringify({ success: true, results, matchedBy: 'name' }));
                context.close();
            } catch (err) {
                console.error("searchIaCompanies Error:", err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ search }),
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `searchIaCompanies failed for query "${search}": ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            /* ================================================================ */
            /*  ACTION: resolveCompanyId                                        */
            /*  3-tier lookup: Local DB → Zoho Creator → Create new             */
            /*  ALWAYS returns zoho_creator_id (record ID), never name          */
            /* ================================================================ */
        } else if (action === 'resolveCompanyId') {
            const companyName = (getArg('companyName') || '').trim();

            if (!companyName) {
                basicIO.write(JSON.stringify({ success: false, error: 'companyName is required' }));
                context.close();
                return;
            }

            const zcql = catalystApp.zcql();
            const safeName = companyName.replace(/'/g, "''");

            try {
                // ── STEP 1: Search local DB (insurance companies only) ──
                const localResult = await fetchInsuranceCompanyRows(zcql, `name = '${safeName}'`);
                const insuranceMatches = (localResult || []).filter(isInsuranceCompanyRow);

                if (insuranceMatches.length > 0) {
                    // Prioritize Active records
                    const activeRecord = insuranceMatches.find(r => r.InsuranceCompanies.status === 'Active') || insuranceMatches[0];
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
                const appName = process.env.ZOHO_COMPANIES_APP_NAME || process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app';

                async function searchCreator(accessToken) {
                    const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies_List?criteria=(Insurance_Company_Name=="${companyName}")`;
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
                    // Prioritize Active company (exclude IA companies)
                    const insuranceCompanies = creatorData.data.filter(c => getZohoCompanyType(c) !== IA_COMPANY_TYPE);

                    if (insuranceCompanies.length > 0) {
                    const activeCompany = insuranceCompanies.find(c => c.Status === 'Active') || insuranceCompanies[0];
                    const creatorId = String(activeCompany.ID);
                    const companyType = getZohoCompanyType(activeCompany);

                    // Store in local DB for future lookups
                    try {
                        const table = catalystApp.datastore().table('InsuranceCompanies');
                        const cacheRow = {
                            name: activeCompany.Insurance_Company_Name || companyName,
                            zoho_creator_id: creatorId,
                            status: activeCompany.Status || 'Active'
                        };
                        if (companyType) cacheRow.company_type = companyType;
                        await table.insertRow(cacheRow);
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
                    await notifyFailureOnCliq({
                        rowId: '',
                        payload: JSON.stringify(createPayload),
                        claimNumber: 'N/A (Company Creation)',
                        adjusterEmail: 'N/A',
                        errorDetails: `Failed to create company "${companyName}": ${JSON.stringify(createData)}`,
                        createdTime: new Date().toISOString()
                    });
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
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ companyName }),
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `resolveCompanyId failed for company "${companyName}": ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            /* ================================================================ */
            /*  ACTION: createCompany                                           */
            /*  Direct creation via User Modal                                  */
            /* ================================================================ */
        } else if (action === 'createCompany') {
            let createCompanyName = '';
            try {
                let token = await getNewAccessToken();
                const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'trinity5').replace(/['"]/g, '').trim();
                const appName = (process.env.ZOHO_COMPANIES_APP_NAME || process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app').replace(/['"]/g, '').trim();

                // Support both flat and nested data from frontend
                const inputData = basicIO.getArgument('data') || {};
                const companyName = String(inputData.name || basicIO.getArgument('name') || '').trim();
                const companyType = String(inputData.companyType || basicIO.getArgument('company_type') || '').trim();
                createCompanyName = companyName;

                if (!companyName) {
                    basicIO.write(JSON.stringify({ success: false, error: 'Company Name is required' }));
                    context.close();
                    return;
                }

                const createUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/All_Companies`;
                const createPayload = {
                    data: {
                        Insurance_Company_Name: companyName,
                        CC_Invoices_to: inputData.ccInvoicesTo || basicIO.getArgument('cc_invoices') || "",
                        Invoice_Email: inputData.invoiceEmail || basicIO.getArgument('invoice_email') || "",
                        Split_Invoice_from_Report: (inputData.splitInvoice === true || basicIO.getArgument('split_invoice') === 'true'),
                        Price_List: inputData.priceList || basicIO.getArgument('price_list') || "",
                        Status: "Pending"
                    }
                };

                // Add Company_Type field to the Zoho payload if provided
                if (companyType) {
                    createPayload.data.Company_Type = companyType;
                }

                console.log(`[createCompany] Creating Company: ${createUrl}`, JSON.stringify(createPayload));

                const response = await fetch(createUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Zoho-oauthtoken ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(createPayload)
                });

                const resData = await response.json();
                console.log(`[createCompany] Creator Response: ${JSON.stringify(resData)}`);

                if (resData.code !== 3000) {
                    throw new Error(resData.error || `Zoho Error: ${JSON.stringify(resData)}`);
                }

                const creatorId = String(resData.data.ID);

                // Store in local DB for immediate search availability
                try {
                    const table = catalystApp.datastore().table('InsuranceCompanies');
                    const insertRow = {
                        name: companyName,
                        zoho_creator_id: creatorId,
                        status: 'Pending'
                    };
                    if (companyType) {
                        insertRow.company_type = companyType;
                    }
                    await table.insertRow(insertRow);
                } catch (dbErr) {
                    console.error("[createCompany] DB Storage Failed:", dbErr.message);
                }

                basicIO.write(JSON.stringify({ success: true, zoho_creator_id: creatorId }));
                context.close();

            } catch (err) {
                console.error("createCompany Error:", err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ companyName: createCompanyName }),
                    claimNumber: 'N/A (Company Creation)',
                    adjusterEmail: 'N/A',
                    errorDetails: `Failed to create company "${createCompanyName}": ${err.message}`,
                    createdTime: new Date().toISOString()
                });
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
                const appName = process.env.ZOHO_COMPANIES_APP_NAME || process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app';

                // Fetch all companies from Creator (paginated)
                let allCompanies = [];
                let from = 0;
                const limit = 200;
                let hasMore = true;

                while (hasMore) {
                    const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies_List?from=${from}&limit=${limit}`;
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
                if (allCompanies.length > 0) {
                    console.log("[syncInsuranceCompanies] DEBUG: First record keys:", Object.keys(allCompanies[0]));
                    console.log("[syncInsuranceCompanies] DEBUG: First record sample:", JSON.stringify(allCompanies[0]));
                }

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
                    const companyType = getZohoCompanyType(company);
                    const rowPayload = {
                        name: companyName,
                        zoho_creator_id: creatorId,
                        status: status
                    };
                    if (companyType) rowPayload.company_type = companyType;

                    if (existingMap.has(creatorId)) {
                        // Update existing record
                        try {
                            await table.updateRow({
                                ROWID: existingMap.get(creatorId),
                                ...rowPayload
                            });
                            updated++;
                        } catch (updateErr) {
                            console.error(`Failed to update company ${companyName}:`, updateErr.message);
                        }
                    } else {
                        // Insert new record
                        try {
                            await table.insertRow(rowPayload);
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

                // ── SYNC ALIASES ──────────────────────────────────────────────────
                // Re-fetch updated company ROWIDs after upsert
                let aliasInserted = 0, aliasDeleted = 0;
                try {
                    const aliasTable = catalystApp.datastore().table('InsuranceAliases');

                    // Step 1: Delete all existing aliases (full rebuild)
                    let existingAliasRows = [];
                    try {
                        existingAliasRows = await zcql.executeZCQLQuery('SELECT ROWID FROM InsuranceAliases');
                    } catch (e) { /* table may be empty */ }

                    for (const row of (existingAliasRows || [])) {
                        try { await aliasTable.deleteRow(row.InsuranceAliases.ROWID); aliasDeleted++; }
                        catch (e) { /* skip */ }
                    }

                    // Step 2: Re-fetch company ROWIDs from DB (needed to link aliases)
                    const freshRows = await zcql.executeZCQLQuery('SELECT ROWID, zoho_creator_id FROM InsuranceCompanies');
                    const creatorIdToRowId = new Map();
                    (freshRows || []).forEach(r => {
                        creatorIdToRowId.set(r.InsuranceCompanies.zoho_creator_id, r.InsuranceCompanies.ROWID);
                    });

                    // Step 3: Insert aliases from Zoho data
                    for (const company of allCompanies) {
                        const creatorId = String(company.ID);
                        const companyRowId = creatorIdToRowId.get(creatorId);
                        const aliases = company.Company_Aliases || [];

                        if (!companyRowId || !Array.isArray(aliases) || aliases.length === 0) continue;

                        for (const aliasEntry of aliases) {
                            // Zoho returns aliases as { display_value: "Alias Name", ID: "..." }
                            const aliasName = aliasEntry.display_value || aliasEntry.Alias || aliasEntry.name || '';
                            if (!aliasName) continue;

                            try {
                                await aliasTable.insertRow({
                                    alias: aliasName,
                                    company_id: companyRowId
                                });
                                aliasInserted++;
                            } catch (aliasInsertErr) {
                                console.error(`Failed to insert alias "${aliasName}":`, aliasInsertErr.message);
                            }
                        }
                    }

                    console.log(`[syncAliases] Done — Deleted: ${aliasDeleted}, Inserted: ${aliasInserted}`);
                } catch (aliasErr) {
                    console.error('[syncAliases] Error:', aliasErr.message);
                }
                // ─────────────────────────────────────────────────────────────────

                console.log(`[syncInsuranceCompanies] Done — Inserted: ${inserted}, Updated: ${updated}, Deleted: ${deleted}`);
                basicIO.write(JSON.stringify({
                    success: true,
                    message: `Sync complete. Companies — Inserted: ${inserted}, Updated: ${updated}, Deleted: ${deleted}. Aliases — Deleted: ${aliasDeleted}, Inserted: ${aliasInserted}`,
                    totalFromCreator: allCompanies.length
                }));
                context.close();

            } catch (err) {
                console.error("syncInsuranceCompanies Error:", err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: '',
                    claimNumber: 'N/A (Sync Job)',
                    adjusterEmail: 'N/A',
                    errorDetails: `syncInsuranceCompanies failed: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

        } else if (action === 'getCompanies') {
            try {
                let token = await getNewAccessToken();
                const owner = process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner';
                const appName = process.env.ZOHO_COMPANIES_APP_NAME || 'engineering-inspections';

                const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/All_Companies_List`;
                console.log(`[getCompanies] Fetching from: ${reportUrl}`);

                const response = await fetch(reportUrl, {
                    method: 'GET',
                    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
                });
                const data = await response.json();

                if (response.status === 401) {
                    cachedToken = null;
                    tokenExpiry = 0;
                    token = await getNewAccessToken();
                    // Retry once
                    const retryResponse = await fetch(reportUrl, {
                        method: 'GET',
                        headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
                    });
                    const retryData = await retryResponse.json();
                    basicIO.write(JSON.stringify({ success: true, data: retryData.data || [], count: (retryData.data || []).length }));
                } else {
                    basicIO.write(JSON.stringify({ success: true, data: data.data || [], count: (data.data || []).length }));
                }
                context.close();
            } catch (err) {
                console.error("getCompanies Error:", err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: '',
                    claimNumber: 'N/A',
                    adjusterEmail: 'N/A',
                    errorDetails: `getCompanies failed: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            // ================================================================
            // ACTION: webhookUpdateCompany
            // Real-time update triggered by Zoho Creator On Success Workflow
            // ================================================================
        } else if (action === 'webhookUpdateCompany') {
            try {
                let creatorId = String(basicIO.getArgument('zoho_creator_id') || '').trim();
                let status = basicIO.getArgument('status');
                let name = String(basicIO.getArgument('name') || '').trim();
                let companyType = String(basicIO.getArgument('company_type') || '').trim();

                console.log("[WEBHOOK] Incoming:", { creatorId, status, name, companyType });

                // ❌ Block invalid ID
                if (!creatorId) {
                    basicIO.write(JSON.stringify({ success: false, error: 'zoho_creator_id is required' }));
                    context.close();
                    return;
                }

                // ✅ IMPORTANT FIX: handle various empty states
                if (!status || status === "null" || status === "undefined" || status === "") {
                    console.log(`[WEBHOOK] Skipped due to empty or invalid status: "${status}"`);
                    basicIO.write(JSON.stringify({ success: true, message: "Skipped: Status was empty or invalid" }));
                    context.close();
                    return;
                }

                status = String(status).trim();

                // 🛡️ SAFETY FILTER: If name looks like a Zoho ID (19 digits), ignore the name update
                // This prevents CRM Sync workflows from overwriting names with IDs.
                let nameToUpdate = String(name || '').trim();
                if (/^\d{19}$/.test(nameToUpdate)) {
                    console.log(`[WEBHOOK] Name update blocked: "${nameToUpdate}" looks like a Zoho ID. Keeping existing name.`);
                    nameToUpdate = null; // Signal to skip name update
                }

                const zcql = catalystApp.zcql();
                const table = catalystApp.datastore().table('InsuranceCompanies');

                const query = `SELECT ROWID FROM InsuranceCompanies WHERE zoho_creator_id = '${creatorId}'`;
                const existing = await zcql.executeZCQLQuery(query);

                if (existing && existing.length > 0) {
                    // ✅ UPDATE
                    const updateData = {
                        ROWID: existing[0].InsuranceCompanies.ROWID,
                        status: status,
                        zoho_creator_id: creatorId
                    };

                    // Only update name if it's a real name (not an ID)
                    if (nameToUpdate) {
                        updateData.name = nameToUpdate;
                    }
                    if (companyType) {
                        updateData.company_type = companyType;
                    }

                    await table.updateRow(updateData);

                    console.log("[WEBHOOK] UPDATED:", creatorId);

                    basicIO.write(JSON.stringify({
                        success: true,
                        message: 'Successfully updated record'
                    }));
                } else {
                    // ✅ INSERT
                    const insertData = {
                        name: nameToUpdate || creatorId, // Use ID as fallback name if Zoho only sends ID
                        status: status,
                        zoho_creator_id: creatorId
                    };
                    if (companyType) insertData.company_type = companyType;
                    await table.insertRow(insertData);

                    console.log("[WEBHOOK] CREATED:", creatorId);

                    basicIO.write(JSON.stringify({
                        success: true,
                        message: 'Record created from webhook'
                    }));
                }

            } catch (err) {
                console.error("webhookUpdateCompany Error:", err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ creatorId: basicIO.getArgument('zoho_creator_id'), status: basicIO.getArgument('status'), name: basicIO.getArgument('name') }),
                    claimNumber: 'N/A (Webhook)',
                    adjusterEmail: 'N/A',
                    errorDetails: `webhookUpdateCompany failed for ID ${basicIO.getArgument('zoho_creator_id') || 'unknown'}: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }

            context.close();

        } else if (action === 'webhookUpdateAlias') {
            // ================================================================
            // ACTION: webhookUpdateAlias
            // Called by Zoho Creator workflow when a Company Alias is added/edited/deleted
            // Params: zoho_creator_id (company ID), alias (alias name), delete=true/false
            // ================================================================
            try {
                const companyCreatorId = String(basicIO.getArgument('zoho_creator_id') || '').trim();
                const aliasName = String(basicIO.getArgument('alias') || '').trim();
                const shouldDelete = basicIO.getArgument('delete') === 'true';

                console.log('[webhookUpdateAlias] Incoming:', { companyCreatorId, aliasName, shouldDelete });

                if (!companyCreatorId || !aliasName) {
                    basicIO.write(JSON.stringify({ success: false, error: 'zoho_creator_id and alias are required' }));
                    context.close();
                    return;
                }

                const zcql = catalystApp.zcql();

                // Step 1: Find the company ROWID from zoho_creator_id
                const companyQuery = `SELECT ROWID FROM InsuranceCompanies WHERE zoho_creator_id = '${companyCreatorId}'`;
                const companyResult = await zcql.executeZCQLQuery(companyQuery);

                if (!companyResult || companyResult.length === 0) {
                    console.log('[webhookUpdateAlias] Company not found in DB for ID:', companyCreatorId);
                    basicIO.write(JSON.stringify({ success: false, error: 'Company not found in local DB' }));
                    context.close();
                    return;
                }

                const companyRowId = companyResult[0].InsuranceCompanies.ROWID;
                const aliasTable = catalystApp.datastore().table('InsuranceAliases');
                const safeAlias = aliasName.replace(/'/g, "''");

                if (shouldDelete) {
                    // Delete the alias
                    const existingAlias = await zcql.executeZCQLQuery(
                        `SELECT ROWID FROM InsuranceAliases WHERE alias = '${safeAlias}' AND company_id = ${companyRowId}`
                    );
                    if (existingAlias && existingAlias.length > 0) {
                        await aliasTable.deleteRow(existingAlias[0].InsuranceAliases.ROWID);
                        console.log('[webhookUpdateAlias] DELETED alias:', aliasName);
                    }
                    basicIO.write(JSON.stringify({ success: true, message: 'Alias deleted' }));
                } else {
                    // Insert alias if it doesn't already exist
                    const existingAlias = await zcql.executeZCQLQuery(
                        `SELECT ROWID FROM InsuranceAliases WHERE alias = '${safeAlias}' AND company_id = ${companyRowId}`
                    );
                    if (!existingAlias || existingAlias.length === 0) {
                        await aliasTable.insertRow({ alias: aliasName, company_id: companyRowId });
                        console.log('[webhookUpdateAlias] INSERTED alias:', aliasName);
                        basicIO.write(JSON.stringify({ success: true, message: 'Alias added' }));
                    } else {
                        console.log('[webhookUpdateAlias] Alias already exists:', aliasName);
                        basicIO.write(JSON.stringify({ success: true, message: 'Alias already exists' }));
                    }
                }
                context.close();
            } catch (err) {
                console.error('webhookUpdateAlias Error:', err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ companyCreatorId: basicIO.getArgument('zoho_creator_id'), alias: basicIO.getArgument('alias') }),
                    claimNumber: 'N/A (Webhook)',
                    adjusterEmail: 'N/A',
                    errorDetails: `webhookUpdateAlias failed for company ${basicIO.getArgument('zoho_creator_id') || 'unknown'}, alias "${basicIO.getArgument('alias') || 'unknown'}": ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
                context.close();
            }

            // ================================================================
            // ACTION: webhookDeleteCompany
            // Real-time delete triggered by Zoho Creator On Delete Workflow
            // Params: zoho_creator_id
            // ================================================================
        } else if (action === 'webhookDeleteCompany') {
            try {
                const creatorId = String(basicIO.getArgument('zoho_creator_id') || '').trim();

                console.log('[webhookDeleteCompany] Incoming:', { creatorId });

                if (!creatorId) {
                    basicIO.write(JSON.stringify({ success: false, error: 'zoho_creator_id is required' }));
                    context.close();
                    return;
                }

                const zcql = catalystApp.zcql();
                const table = catalystApp.datastore().table('InsuranceCompanies');

                // Step 1: Find the company ROWID
                const query = `SELECT ROWID FROM InsuranceCompanies WHERE zoho_creator_id = '${creatorId}'`;
                const existing = await zcql.executeZCQLQuery(query);

                if (!existing || existing.length === 0) {
                    console.log('[webhookDeleteCompany] Company not found in local DB for ID:', creatorId);
                    basicIO.write(JSON.stringify({ success: false, error: 'Company not found in local DB' }));
                    context.close();
                    return;
                }

                const companyRowId = existing[0].InsuranceCompanies.ROWID;

                // Step 2: Delete all related aliases (cascade)
                let aliasesDeleted = 0;
                try {
                    const aliasTable = catalystApp.datastore().table('InsuranceAliases');
                    const aliasRows = await zcql.executeZCQLQuery(
                        `SELECT ROWID FROM InsuranceAliases WHERE company_id = ${companyRowId}`
                    );
                    for (const aliasRow of (aliasRows || [])) {
                        try {
                            await aliasTable.deleteRow(aliasRow.InsuranceAliases.ROWID);
                            aliasesDeleted++;
                        } catch (aliasDelErr) {
                            console.error('[webhookDeleteCompany] Failed to delete alias row:', aliasDelErr.message);
                        }
                    }
                    console.log(`[webhookDeleteCompany] Deleted ${aliasesDeleted} alias(es) for company ${creatorId}`);
                } catch (aliasErr) {
                    // Aliases table may not exist yet — proceed with company deletion
                    console.warn('[webhookDeleteCompany] Alias cleanup skipped (table may not exist):', aliasErr.message);
                }

                // Step 3: Delete the company row
                await table.deleteRow(companyRowId);

                console.log('[webhookDeleteCompany] DELETED company:', creatorId, '| Aliases removed:', aliasesDeleted);

                basicIO.write(JSON.stringify({
                    success: true,
                    message: 'Company deleted successfully',
                    aliasesDeleted
                }));

            } catch (err) {
                console.error('webhookDeleteCompany Error:', err);
                await notifyFailureOnCliq({
                    rowId: '',
                    payload: JSON.stringify({ zoho_creator_id: basicIO.getArgument('zoho_creator_id') }),
                    claimNumber: 'N/A (Webhook)',
                    adjusterEmail: 'N/A',
                    errorDetails: `webhookDeleteCompany failed for ID ${basicIO.getArgument('zoho_creator_id') || 'unknown'}: ${err.message}`,
                    createdTime: new Date().toISOString()
                });
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'createInvite') {
            const result = await portalAuth.handleCreateInvite(catalystApp, {
                role: getArg('role'),
                email: getArg('email'),
                name: getArg('name'),
                apiKey: getArg('apiKey') || getArg('api_key') || body.apiKey || body.api_key
            });
            basicIO.write(JSON.stringify(result));
            context.close();

        } else if (action === 'checkInvite') {
            const result = await portalAuth.handleCheckInvite(catalystApp, {
                email: getArg('email'),
                role: getArg('role')
            });
            basicIO.write(JSON.stringify(result));
            context.close();

        } else if (action === 'requestOtp') {
            try {
                const result = await portalAuth.handleRequestOtp(catalystApp, {
                    email: getArg('email'),
                    role: getArg('role')
                });
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('requestOtp Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'verifyOtp') {
            try {
                const result = await portalAuth.handleVerifyOtp(catalystApp, {
                    email: getArg('email'),
                    otp: getArg('otp') || getArg('code'),
                    role: getArg('role')
                });
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('verifyOtp Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'validateSession') {
            const result = await portalAuth.handleValidateSession(catalystApp, {
                sessionToken: getArg('sessionToken') || getArg('token')
            });
            basicIO.write(JSON.stringify(result));
            context.close();

        } else if (action === 'logout') {
            const result = await portalAuth.handleLogout(catalystApp, {
                sessionToken: getArg('sessionToken') || getArg('token')
            });
            basicIO.write(JSON.stringify(result));
            context.close();

        } else if (action === 'getMyClaims') {
            try {
                const result = await portalAuth.handleGetMyClaims(
                    catalystApp,
                    { sessionToken: getArg('sessionToken') || getArg('token') },
                    getNewAccessToken
                );
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('getMyClaims Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'getUserPreferences') {
            try {
                const result = await portalAuth.handleGetUserPreferences(catalystApp, {
                    sessionToken: getArg('sessionToken') || getArg('token'),
                    insuranceCompany: getArg('insuranceCompany'),
                    iaCompany: getArg('iaCompany')
                });
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('getUserPreferences Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'saveUserPreferences') {
            try {
                const result = await portalAuth.handleSaveUserPreferences(catalystApp, {
                    sessionToken: getArg('sessionToken') || getArg('token'),
                    insuranceCompany: getArg('insuranceCompany'),
                    iaCompany: getArg('iaCompany'),
                    preferences: body.preferences || getArg('preferences')
                });
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('saveUserPreferences Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'getCarrierContacts') {
            try {
                const result = await portalAuth.handleGetCarrierContacts(catalystApp, {
                    sessionToken: getArg('sessionToken') || getArg('token')
                });
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('getCarrierContacts Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else if (action === 'saveCarrierContact') {
            try {
                const result = await portalAuth.handleSaveCarrierContact(catalystApp, {
                    sessionToken: getArg('sessionToken') || getArg('token'),
                    adjusterEmail: getArg('adjusterEmail'),
                    contact: body.contact || getArg('contact')
                });
                basicIO.write(JSON.stringify(result));
            } catch (err) {
                console.error('saveCarrierContact Error:', err);
                basicIO.write(JSON.stringify({ success: false, error: err.message }));
            }
            context.close();

        } else {
            basicIO.write(JSON.stringify({ success: false, error: 'Invalid or missing action parameter' }));
            context.close();
        }

    } catch (err) {
        console.error("Function Root Error:", err);
        try {
            await notifyFailureOnCliq({
                rowId: '',
                payload: '',
                claimNumber: 'Unknown',
                adjusterEmail: 'Unknown',
                errorDetails: `Unexpected root-level error: ${err.message}`,
                createdTime: new Date().toISOString()
            });
        } catch (notifyErr) {
            console.error('[Cliq Notify] Failed in root catch:', notifyErr.message);
        }
        basicIO.write(JSON.stringify({ success: false, error: "Internal Server Error: " + err.message }));
        context.close();
    }
};