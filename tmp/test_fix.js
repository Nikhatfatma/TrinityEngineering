const mapping = {
    "report": "Report",
    "invoice": "Invoice",
    "notifications": "Notifications",
    "notification": "Notifications"
};

const transformPreferences = (prefs = []) => {
    const normalized = prefs.map(p => p.toLowerCase());
    if (normalized.includes("all")) {
        return ["Report", "Invoice", "Notifications"];
    }
    const values = normalized.filter(p => p !== "all").map(p => mapping[p]).filter(Boolean);
    return [...new Set(values)];
};

function mapFormDataToCreator(data) {
    const iaSubform = (data.iaRecipients || []).filter(r => r.email).map(r => ({
        "Email": r.email,
        "Send_Copy_Of": transformPreferences(r.notificationType || [])
    }));

    const adjSubform = (data.adjusterEmails || []).filter(r => r.email).map(r => {
        const prefs = [];
        if (r.sendCopy?.report) prefs.push("report");
        if (r.sendCopy?.invoice) prefs.push("invoice");
        if (r.sendCopy?.notification) prefs.push("notifications");
        return {
            "Email": r.email,
            "Send_Copy_Of": transformPreferences(prefs)
        };
    });

    return {
        data: {
            Adjuster_Send_Copy_Of: transformPreferences(data.adjusterNotificationType || []).join(","),
            IA_Emails_Subform: iaSubform,
            Adjuster_Emails_Subform: adjSubform
        }
    };
}

// Mock test data
const mockData = {
    adjusterNotificationType: ["all", "report"],
    iaRecipients: [{ email: "ia@test.com", notificationType: ["report", "invoice"] }],
    adjusterEmails: [{ email: "adj@test.com", sendCopy: { report: true, invoice: true } }]
};

const result = mapFormDataToCreator(mockData);

console.log("--- TEST RESULTS ---");
console.log("Main Field (Adjuster_Send_Copy_Of):", JSON.stringify(result.data.Adjuster_Send_Copy_Of));
console.log("Subform Field (IA_Emails_Subform[0].Send_Copy_Of):", JSON.stringify(result.data.IA_Emails_Subform[0].Send_Copy_Of));
console.log("Subform Field (Adjuster_Emails_Subform[0].Send_Copy_Of):", JSON.stringify(result.data.Adjuster_Emails_Subform[0].Send_Copy_Of));

if (typeof result.data.Adjuster_Send_Copy_Of === 'string' && Array.isArray(result.data.IA_Emails_Subform[0].Send_Copy_Of)) {
    console.log("\nSUCCESS: Main field is a string, subforms are arrays.");
} else {
    console.error("\nFAILURE: Mixed types logic failed.");
}
