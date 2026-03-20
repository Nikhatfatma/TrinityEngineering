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
            Is_IA_Claim: data.isIAClaim || false,
            IA_First_Name: data.iaFirstName || "",
            IA_Last_Name: data.iaLastName || "",
            IA_Phone: data.iaPhone || "",
            IA_Company: data.iaCompany || "",
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

async function getNewAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

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
}

module.exports = async (context, basicIO) => {
    try {
        const action = basicIO.getArgument('action');
        const catalystApp = catalyst.initialize(context);
        
        // Ensure proper headers for external fetch calls
        context.getHeaders = () => ({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });

        if (action === 'submitInspection') {
            const data = basicIO.getArgument('data');
            
            // 1. Strict Backend Validation
            if (!data) {
                basicIO.write(JSON.stringify({ success: false, error: 'No data provided in the payload' }));
                context.close();
                return;
            }
            if (!data.inspectionType || !data.claimNumber || !data.adjusterEmail) {
                basicIO.write(JSON.stringify({ success: false, error: 'Validation Error: Missing required fields (Inspection Type, Claim Number, or Adjuster Email).' }));
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
            let token = await getNewAccessToken();

            async function submitToCreator(accessToken) {
                const owner = process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner';
                const appName = process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app';
                const formName = process.env.ZOHO_CREATOR_FORM_NAME || 'inspection-form';
                const creatorUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;
                
                return fetch(creatorUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Zoho-oauthtoken ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(creatorPayload)
                });
            }

            try {
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

                if (!response.ok || responseData.code !== 3000) {
                    throw new Error(`Creator API Error: ${JSON.stringify(responseData)}`);
                }

                // Success - Log to ProcessedClaims to prevent future duplicates
                try {
                    const processedTable = catalystApp.datastore().table('ProcessedClaims');
                    await processedTable.insertRow({ ClaimNumber: data.claimNumber });
                } catch(dbErr) { 
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
                } catch(emailErr) { 
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
                    const owner = process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'owner';
                    const appName = process.env.ZOHO_CREATOR_APP_NAME || 'inspection-app';
                    const formName = process.env.ZOHO_CREATOR_FORM_NAME || 'inspection-form';
                    const creatorUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/form/${formName}`;
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
                } catch(dbErr) { console.error("Could not log processed claim:", dbErr.message); }

                await table.updateRow({ ROWID: rowId, Resolved: true }); 
                
                basicIO.write(JSON.stringify({ success: true, message: 'Retry successful! Submission completed.' }));
                context.close();
            } catch (err) {
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
