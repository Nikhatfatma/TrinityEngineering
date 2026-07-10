const crypto = require('crypto');

const ALLOWED_ROLES = ['IA', 'Adjuster'];
const INVITE_STATUS_ACTIVE = 'Invited';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = (Number(process.env.PORTAL_OTP_EXPIRY_MINUTES) || 10) * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = (Number(process.env.PORTAL_OTP_RESEND_COOLDOWN_SECONDS) || 60) * 1000;
const OTP_MAX_SEND_PER_HOUR = Number(process.env.PORTAL_OTP_MAX_SEND_PER_HOUR) || 5;
const OTP_MAX_VERIFY_ATTEMPTS = Number(process.env.PORTAL_OTP_MAX_VERIFY_ATTEMPTS) || 5;
const SESSION_TTL_MS = (Number(process.env.PORTAL_SESSION_HOURS) || 24) * 60 * 60 * 1000;

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function isValidEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeZcql(value) {
    return String(value || '').replace(/'/g, "''");
}

function hashOtp(code) {
    return crypto.createHash('sha256').update(String(code)).digest('hex');
}

function generateOtp() {
    const max = Math.pow(10, OTP_LENGTH);
    const num = crypto.randomInt(0, max);
    return String(num).padStart(OTP_LENGTH, '0');
}

function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

function isInviteActive(status) {
    const normalized = String(status || INVITE_STATUS_ACTIVE).trim().toLowerCase();
    const blocked = ['removed', 'revoked', 'inactive', 'cancelled', 'deleted'];
    return !blocked.includes(normalized);
}

function normalizePortalRole(role) {
    const trimmed = String(role || '').trim();
    if (trimmed === 'IA') return 'IA';
    if (trimmed === 'Adjuster') return 'Adjuster';
    return '';
}

function getRoleLabel(role) {
    return role === 'IA' ? 'Independent Adjuster (IA)' : 'Adjuster (Carrier)';
}

function validateSelectedRole(selectedRole, inviteRole) {
    const selected = normalizePortalRole(selectedRole);
    const invited = normalizePortalRole(inviteRole);

    if (!selected || !ALLOWED_ROLES.includes(selected)) {
        return { ok: false, error: 'Invalid role selected.' };
    }

    if (selected !== invited) {
        return {
            ok: false,
            roleMismatch: true,
            expectedRole: invited,
            error: `This email is registered as ${getRoleLabel(invited)}. Please go back and select the correct role.`
        };
    }

    return { ok: true };
}

function hasActiveOtpRecord(otpRecord) {
    if (!otpRecord?.code_hash || otpRecord.code_hash === 'pending') return false;
    const expiresAt = otpRecord.expires_at ? new Date(otpRecord.expires_at).getTime() : 0;
    return expiresAt > Date.now();
}

const OTP_PLACEHOLDER_EXPIRES = '1970-01-01T00:00:00.000Z';
const OTP_PLACEHOLDER_SENT = '1970-01-01T00:00:00.000Z';

function getInviteApiSecret() {
    return String(process.env.PORTAL_INVITE_API_SECRET || process.env.INVITE_API_SECRET || '').trim();
}

function verifyInviteApiKey(providedKey) {
    const secret = getInviteApiSecret();
    if (!secret) {
        return { ok: false, error: 'Invite API is not configured (missing PORTAL_INVITE_API_SECRET)' };
    }
    const a = Buffer.from(String(providedKey || ''));
    const b = Buffer.from(secret);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return { ok: false, error: 'Unauthorized' };
    }
    return { ok: true };
}

async function findInvitation(zcql, email) {
    const safeEmail = escapeZcql(email);
    const rows = await zcql.executeZCQLQuery(
        `SELECT ROWID, email, role, name, status FROM Invitations WHERE email = '${safeEmail}' LIMIT 1`
    );
    if (!rows || rows.length === 0) return null;
    return rows[0].Invitations;
}

async function handleCreateInvite(catalystApp, { role, email, name, apiKey }) {
    const auth = verifyInviteApiKey(apiKey);
    if (!auth.ok) {
        return { success: false, error: auth.error, statusCode: auth.error === 'Unauthorized' ? 401 : 500 };
    }

    const normalizedEmail = normalizeEmail(email);
    const trimmedName = String(name || '').trim();
    const trimmedRole = String(role || '').trim();

    if (!normalizedEmail) {
        return { success: false, error: 'Email is required' };
    }
    if (!isValidEmailFormat(normalizedEmail)) {
        return { success: false, error: 'Email must be a valid email address' };
    }
    if (!trimmedName) {
        return { success: false, error: 'Name is required' };
    }
    if (!trimmedRole) {
        return { success: false, error: 'Role is required' };
    }
    if (!ALLOWED_ROLES.includes(trimmedRole)) {
        return { success: false, error: `Role must be one of: ${ALLOWED_ROLES.join(', ')}` };
    }

    const zcql = catalystApp.zcql();
    const existing = await findInvitation(zcql, normalizedEmail);
    const table = catalystApp.datastore().table('Invitations');

    if (existing) {
        if (existing.role === trimmedRole) {
            return {
                success: true,
                message: 'This email has already been invited with this role',
                email: normalizedEmail,
                role: trimmedRole
            };
        } else {
            await table.updateRow({
                ROWID: existing.ROWID,
                role: trimmedRole,
                name: trimmedName,
                status: INVITE_STATUS_ACTIVE
            });
            return {
                success: true,
                message: 'Invitation updated successfully',
                email: normalizedEmail,
                role: trimmedRole
            };
        }
    }

    await table.insertRow({
        email: normalizedEmail,
        role: trimmedRole,
        name: trimmedName,
        status: INVITE_STATUS_ACTIVE
    });

    return {
        success: true,
        message: 'Invitation created successfully',
        email: normalizedEmail,
        role: trimmedRole
    };
}

async function handleCheckInvite(catalystApp, { email, role }) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
        return { success: false, invited: false, error: 'Invalid email address' };
    }

    const invite = await findInvitation(catalystApp.zcql(), normalizedEmail);
    if (!invite || !isInviteActive(invite.status)) {
        return { success: true, invited: false, message: 'You have not yet been invited.' };
    }

    if (role) {
        const roleCheck = validateSelectedRole(role, invite.role);
        if (!roleCheck.ok) {
            return {
                success: false,
                invited: true,
                roleMismatch: true,
                expectedRole: roleCheck.expectedRole,
                error: roleCheck.error
            };
        }
    }

    return {
        success: true,
        invited: true,
        role: invite.role,
        name: invite.name
    };
}

async function getOrCreateOtpRecord(zcql, otpTable, email) {
    const safeEmail = escapeZcql(email);
    const rows = await zcql.executeZCQLQuery(
        `SELECT ROWID, email, code_hash, expires_at, send_count, verify_attempts, last_sent_at FROM OtpCodes WHERE email = '${safeEmail}' LIMIT 1`
    );
    if (rows && rows.length > 0) {
        return rows[0].OtpCodes;
    }
    const inserted = await otpTable.insertRow({
        email,
        code_hash: 'pending',
        expires_at: OTP_PLACEHOLDER_EXPIRES,
        send_count: 0,
        verify_attempts: 0,
        last_sent_at: OTP_PLACEHOLDER_SENT
    });
    const rowId = inserted?.ROWID || inserted;
    return {
        ROWID: rowId,
        email,
        code_hash: 'pending',
        expires_at: OTP_PLACEHOLDER_EXPIRES,
        send_count: 0,
        verify_attempts: 0,
        last_sent_at: OTP_PLACEHOLDER_SENT
    };
}

async function sendOtpEmail(catalystApp, { toEmail, inviteName, otp, expiryMinutes }) {
    const fromEmail = (process.env.FROM_EMAIL || 'nikhatabrtrial@gmail.com').trim();
    const subject = 'Your Trinity Client Portal sign-in code';
    const text = `Hello ${inviteName},\n\nYour one-time sign-in code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes. If you did not request this, you can ignore this email.\n\n— Trinity Engineering`;
    const html = `<div style="font-family:sans-serif;max-width:480px"><p>Hello ${inviteName},</p><p>Your one-time sign-in code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${otp}</p><p>This code expires in ${expiryMinutes} minutes.</p><p style="color:#666;font-size:12px">If you did not request this, you can ignore this email.</p></div>`;

    try {
        await catalystApp.email().sendMail({
            from_email: fromEmail,
            to_email: [toEmail],
            subject,
            content: html,
            html_mode: true,
            display_name: 'Trinity Portal'
        });
        console.log('[sendOtpEmail] Sent via Catalyst to', toEmail);
        return { sent: true, provider: 'catalyst' };
    } catch (catalystErr) {
        console.error('[sendOtpEmail] Catalyst failed:', catalystErr.message);
    }

    const smtpUser = (process.env.SMTP_USER || fromEmail).trim();
    const smtpPass = (process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').trim();
    if (!smtpUser || !smtpPass) {
        return {
            sent: false,
            error: 'SMTP not configured. Add SMTP_PASSWORD (Gmail App Password) in Catalyst env variables.'
        };
    }

    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: String(process.env.SMTP_SECURE || 'true') !== 'false',
            auth: { user: smtpUser, pass: smtpPass }
        });
        await transporter.sendMail({
            from: `"Trinity Portal" <${fromEmail}>`,
            to: toEmail,
            subject,
            text,
            html
        });
        console.log('[sendOtpEmail] Sent via SMTP to', toEmail);
        return { sent: true, provider: 'smtp' };
    } catch (smtpErr) {
        console.error('[sendOtpEmail] SMTP failed:', smtpErr.message);
        return { sent: false, error: smtpErr.message };
    }
}

async function handleRequestOtp(catalystApp, { email, role }) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
        return { success: false, error: 'Invalid email address' };
    }

    const invite = await findInvitation(catalystApp.zcql(), normalizedEmail);
    if (!invite || !isInviteActive(invite.status)) {
        return { success: false, notInvited: true, error: 'You have not yet been invited.' };
    }

    // When role is not provided by the user, use the invite's role directly
    const effectiveRole = role ? normalizePortalRole(role) : normalizePortalRole(invite.role);
    if (role) {
        // Only validate role mismatch when user explicitly provided one
        const roleCheck = validateSelectedRole(effectiveRole, invite.role);
        if (!roleCheck.ok) {
            return {
                success: false,
                roleMismatch: true,
                expectedRole: roleCheck.expectedRole,
                error: roleCheck.error
            };
        }
    }

    const zcql = catalystApp.zcql();
    const otpTable = catalystApp.datastore().table('OtpCodes');
    let otpRecord = await getOrCreateOtpRecord(zcql, otpTable, normalizedEmail);

    const now = Date.now();
    const lastSentRaw = otpRecord.last_sent_at;
    const lastSent = lastSentRaw && lastSentRaw !== OTP_PLACEHOLDER_SENT
        ? new Date(lastSentRaw).getTime()
        : 0;

    if (lastSent && now - lastSent < OTP_RESEND_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - (now - lastSent)) / 1000);
        if (hasActiveOtpRecord(otpRecord)) {
            return {
                success: true,
                message: 'Please enter the verification code sent to your email.',
                email: normalizedEmail,
                cooldownSeconds: waitSeconds,
                emailSent: false,
                existingOtp: true
            };
        }
        return {
            success: false,
            error: `Please wait ${waitSeconds} seconds before requesting a new code`,
            cooldownSeconds: waitSeconds
        };
    }

    const sendCount = Number(otpRecord.send_count) || 0;
    if (lastSent) {
        const hourAgo = now - (60 * 60 * 1000);
        if (lastSent > hourAgo && sendCount >= OTP_MAX_SEND_PER_HOUR) {
            if (hasActiveOtpRecord(otpRecord)) {
                return {
                    success: true,
                    message: 'Please enter the verification code sent to your email.',
                    email: normalizedEmail,
                    emailSent: false,
                    existingOtp: true
                };
            }
            return { success: false, error: 'Too many code requests. Please try again later.' };
        }
    }

    const otp = generateOtp();
    const expiresAt = new Date(now + OTP_EXPIRY_MS).toISOString();
    const newSendCount = (lastSent && (now - lastSent) < 60 * 60 * 1000)
        ? sendCount + 1
        : 1;

    await otpTable.updateRow({
        ROWID: otpRecord.ROWID,
        email: normalizedEmail,
        code_hash: hashOtp(otp),
        expires_at: expiresAt,
        send_count: newSendCount,
        verify_attempts: 0,
        last_sent_at: new Date(now).toISOString()
    });

    const mailResult = await sendOtpEmail(catalystApp, {
        toEmail: normalizedEmail,
        inviteName: invite.name || 'there',
        otp,
        expiryMinutes: OTP_EXPIRY_MS / 60000
    });

    return {
        success: true,
        message: mailResult.sent
            ? 'Verification code sent to your email.'
            : 'Verification code generated. Email could not be delivered — contact support or try Resend.',
        email: normalizedEmail,
        cooldownSeconds: Math.ceil(OTP_RESEND_COOLDOWN_MS / 1000),
        emailSent: mailResult.sent,
        emailProvider: mailResult.provider || null,
        ...(mailResult.error ? { emailError: mailResult.error } : {})
    };
}

async function handleVerifyOtp(catalystApp, { email, otp, role }) {
    const normalizedEmail = normalizeEmail(email);
    const code = String(otp || '').trim();

    if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
        return { success: false, error: 'Invalid email address' };
    }
    if (!/^\d{6}$/.test(code)) {
        return { success: false, error: 'Invalid verification code' };
    }

    const invite = await findInvitation(catalystApp.zcql(), normalizedEmail);
    if (!invite || !isInviteActive(invite.status)) {
        return { success: false, notInvited: true, error: 'You have not yet been invited.' };
    }

    // When role is not provided by the user, use the invite's role directly
    const effectiveRole = role ? normalizePortalRole(role) : normalizePortalRole(invite.role);
    if (role) {
        // Only validate role mismatch when user explicitly provided one
        const roleCheck = validateSelectedRole(effectiveRole, invite.role);
        if (!roleCheck.ok) {
            return {
                success: false,
                roleMismatch: true,
                expectedRole: roleCheck.expectedRole,
                error: roleCheck.error
            };
        }
    }

    const zcql = catalystApp.zcql();
    const safeEmail = escapeZcql(normalizedEmail);
    const rows = await zcql.executeZCQLQuery(
        `SELECT ROWID, code_hash, expires_at, verify_attempts FROM OtpCodes WHERE email = '${safeEmail}' LIMIT 1`
    );

    if (!rows || rows.length === 0) {
        return { success: false, error: 'No verification code found. Please request a new code.' };
    }

    const otpRecord = rows[0].OtpCodes;
    const attempts = Number(otpRecord.verify_attempts) || 0;
    if (attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
        return { success: false, error: 'Too many failed attempts. Please request a new code.' };
    }

    const expiresAt = new Date(otpRecord.expires_at).getTime();
    if (!otpRecord.expires_at || Date.now() > expiresAt) {
        return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }

    if (hashOtp(code) !== otpRecord.code_hash) {
        const otpTable = catalystApp.datastore().table('OtpCodes');
        await otpTable.updateRow({
            ROWID: otpRecord.ROWID,
            verify_attempts: attempts + 1
        });
        return { success: false, error: 'Incorrect verification code. Please try again.' };
    }

    const sessionToken = generateSessionToken();
    const sessionExpires = new Date(Date.now() + SESSION_TTL_MS).toISOString();
    const sessionsTable = catalystApp.datastore().table('PortalSessions');

    const existingSessions = await zcql.executeZCQLQuery(
        `SELECT ROWID FROM PortalSessions WHERE email = '${safeEmail}'`
    );
    if (existingSessions && existingSessions.length > 0) {
        for (const row of existingSessions) {
            await sessionsTable.deleteRow(row.PortalSessions.ROWID);
        }
    }

    await sessionsTable.insertRow({
        token: sessionToken,
        email: normalizedEmail,
        role: invite.role,
        name: invite.name,
        expires_at: sessionExpires
    });

    const otpTable = catalystApp.datastore().table('OtpCodes');
    await otpTable.updateRow({
        ROWID: otpRecord.ROWID,
        code_hash: '',
        expires_at: '',
        verify_attempts: 0
    });

    return {
        success: true,
        message: 'Signed in successfully',
        sessionToken,
        sessionExpires,
        user: {
            email: normalizedEmail,
            role: invite.role,
            name: invite.name
        }
    };
}

async function handleValidateSession(catalystApp, { sessionToken }) {
    const token = String(sessionToken || '').trim();
    if (!token) {
        return { success: false, valid: false, error: 'No session' };
    }

    const zcql = catalystApp.zcql();
    const safeToken = escapeZcql(token);
    const rows = await zcql.executeZCQLQuery(
        `SELECT ROWID, token, email, role, name, expires_at FROM PortalSessions WHERE token = '${safeToken}' LIMIT 1`
    );

    if (!rows || rows.length === 0) {
        return { success: false, valid: false, error: 'Session not found' };
    }

    const session = rows[0].PortalSessions;
    if (Date.now() > new Date(session.expires_at).getTime()) {
        await catalystApp.datastore().table('PortalSessions').deleteRow(session.ROWID);
        return { success: false, valid: false, error: 'Session expired' };
    }

    const invite = await findInvitation(zcql, session.email);
    if (!invite || !isInviteActive(invite.status)) {
        await catalystApp.datastore().table('PortalSessions').deleteRow(session.ROWID);
        return { success: false, valid: false, error: 'Access revoked' };
    }

    return {
        success: true,
        valid: true,
        user: {
            email: session.email,
            role: session.role,
            name: session.name
        }
    };
}

async function handleLogout(catalystApp, { sessionToken }) {
    const token = String(sessionToken || '').trim();
    if (!token) {
        return { success: true, message: 'Logged out' };
    }

    const zcql = catalystApp.zcql();
    const safeToken = escapeZcql(token);
    const rows = await zcql.executeZCQLQuery(
        `SELECT ROWID FROM PortalSessions WHERE token = '${safeToken}' LIMIT 1`
    );
    if (rows && rows.length > 0) {
        await catalystApp.datastore().table('PortalSessions').deleteRow(rows[0].PortalSessions.ROWID);
    }

    return { success: true, message: 'Logged out' };
}

function isZohoNoRecordsResponse(response, data) {
    const message = String(data?.message || data?.error || '').toLowerCase();
    return (
        response.status === 404 ||
        data?.code === 9280 ||
        message.includes('no records') ||
        message.includes('no data') ||
        message.includes('no matching')
    );
}

async function fetchClaimsForUser(email, role, getNewAccessToken) {
    const normalizedEmail = normalizeEmail(email);
    const owner = (process.env.ZOHO_CREATOR_ACCOUNT_OWNER || 'trinity5').trim();
    const appName = (process.env.ZOHO_CREATOR_APP_NAME || 'engineering-inspections').replace(/['"]/g, '').trim();
    const reportName = (process.env.ZOHO_CREATOR_CLAIMS_REPORT || 'All_Inspection_Requests').replace(/['"]/g, '').trim();
    const safeEmail = normalizedEmail.replace(/"/g, '\\"');

    let criteria;
    if (role === 'IA') {
        criteria = `(Independent_Adjuster_Email=="${safeEmail}")`;
    } else {
        criteria = `(Adjuster_Email=="${safeEmail}")`;
    }

    let token = await getNewAccessToken();
    let allClaims = [];
    let from = 0;
    const limit = 200;
    let hasMore = true;

    while (hasMore) {
        const reportUrl = `https://creator.zoho.com/api/v2/${owner}/${appName}/report/${reportName}?criteria=${encodeURIComponent(criteria)}&from=${from}&limit=${limit}`;
        let response = await fetch(reportUrl, {
            method: 'GET',
            headers: { Authorization: `Zoho-oauthtoken ${token}` }
        });

        if (response.status === 401) {
            token = await getNewAccessToken(true);
            response = await fetch(reportUrl, {
                method: 'GET',
                headers: { Authorization: `Zoho-oauthtoken ${token}` }
            });
        }

        const data = await response.json();
        if (!response.ok) {
            if (isZohoNoRecordsResponse(response, data)) {
                hasMore = false;
                break;
            }
            throw new Error(data.message || `Failed to fetch claims (${response.status})`);
        }

        if (data.code && data.code !== 3000 && isZohoNoRecordsResponse(response, data)) {
            hasMore = false;
            break;
        }

        const batch = data.data || [];
        if (batch.length > 0) {
            allClaims = allClaims.concat(batch);
            from += limit;
            if (batch.length < limit) hasMore = false;
        } else {
            hasMore = false;
        }
    }

    return allClaims.map((row) => {
        console.log("RAW CLAIM ROW:", JSON.stringify(row, null, 2));
        return {
        id: row.ID || row.id || '',
        claimNumber: row.Claim_Number || row.claim_number || '',
        inspectionType: row.Service_Requested || row.Inspection_Type || row.inspection_type || '',
        status: row.Inspection_Status || row.inspection_status || row.Status || row.status || '',
        dateOfLoss: row.Date_of_Loss || row.date_of_loss || '',
        policyholderName: formatPolicyholderName(row),
        submittedAt: row.Added_Time || row.added_time || row.Created_Time || '',
        insuranceCompany: (row.Insurance_Company_List && row.Insurance_Company_List.display_value) || row.Insurance_Company || row.insurance_company || ''
    };
    });
}

function parsePolicyholderNameParts(value) {
    if (!value) return null;

    if (typeof value === 'object') {
        const first = String(value.first_name || value.First_Name || '').trim();
        const last = String(value.last_name || value.Last_Name || '').trim();
        if (first || last) return { first, last };
        if (value.display_value) return parsePolicyholderNameParts(value.display_value);
        return null;
    }

    const trimmed = String(value).trim();
    if (!trimmed) return null;

    const commaMatch = trimmed.match(/^([^,]+),\s*(.+)$/);
    if (commaMatch) {
        return { first: commaMatch[2].trim(), last: commaMatch[1].trim() };
    }

    return { first: trimmed, last: '' };
}

function formatPolicyholderNameParts(parts) {
    if (!parts) return '';
    return [parts.first, parts.last].filter(Boolean).join(' ').trim();
}

function formatPolicyholderName(row) {
    const phName = row.PH_Name_Individual || row.ph_name_individual;
    const fromPhName = formatPolicyholderNameParts(parsePolicyholderNameParts(phName));
    if (fromPhName) return fromPhName;

    const fromPolicyholderName = formatPolicyholderNameParts(parsePolicyholderNameParts(row.Policyholder_Name));
    if (fromPolicyholderName) return fromPolicyholderName;

    const inspectionName = String(row.Inspection_Name || '').trim();
    if (inspectionName) {
        const dashIdx = inspectionName.lastIndexOf(' - ');
        const nameOnly = dashIdx > 0 ? inspectionName.slice(0, dashIdx).trim() : inspectionName;
        return formatPolicyholderNameParts(parsePolicyholderNameParts(nameOnly)) || nameOnly;
    }

    return '';
}

async function handleGetMyClaims(catalystApp, { sessionToken }, getNewAccessToken) {
    const sessionResult = await handleValidateSession(catalystApp, { sessionToken });
    if (!sessionResult.valid) {
        return { success: false, error: sessionResult.error || 'Unauthorized', unauthorized: true };
    }

    try {
        const claims = await fetchClaimsForUser(
            sessionResult.user.email,
            sessionResult.user.role,
            getNewAccessToken
        );
        return {
            success: true,
            claims,
            user: sessionResult.user
        };
    } catch (err) {
        const msg = String(err.message || '').toLowerCase();
        if (
            msg.includes('no records') ||
            msg.includes('no data') ||
            msg.includes('9280')
        ) {
            return {
                success: true,
                claims: [],
                user: sessionResult.user
            };
        }
        console.error('[getMyClaims] Error:', err.message);
        return { success: false, error: err.message };
    }
}

async function handleGetUserPreferences(catalystApp, { sessionToken, insuranceCompany, iaCompany }) {
    const sessionResult = await handleValidateSession(catalystApp, { sessionToken });
    if (!sessionResult.valid) {
        return { success: false, error: sessionResult.error || 'Unauthorized', unauthorized: true };
    }

    const { email, role } = sessionResult.user;
    const zcql = catalystApp.zcql();

    let company;
    if (role === 'IA') {
        company = iaCompany;
    } else if (role === 'Adjuster') {
        company = insuranceCompany;
    }

    const safeEmail = escapeZcql(email);

    // No company specified (e.g. on login) — return the user's most recent saved preferences
    // so their own details (name, phone, email, extension, email preferences) can prepopulate.
    const query = (!company || !String(company).trim())
        ? `SELECT ROWID, user_email, scoping_company, preferences_json FROM UserPreferences WHERE user_email = '${safeEmail}' ORDER BY ROWID DESC LIMIT 1`
        : `SELECT ROWID, user_email, scoping_company, preferences_json FROM UserPreferences WHERE user_email = '${safeEmail}' AND scoping_company = '${escapeZcql(String(company).trim())}' LIMIT 1`;

    try {
        const rows = await zcql.executeZCQLQuery(query);
        if (!rows || rows.length === 0) {
            return { success: true, preferences: null };
        }
        const row = rows[0].UserPreferences;
        let preferences = {};
        if (row.preferences_json) {
            try {
                preferences = JSON.parse(row.preferences_json);
            } catch (err) {
                console.error('[getUserPreferences] Failed to parse preferences JSON:', err);
            }
        }
        return { success: true, preferences };
    } catch (err) {
        console.error('[getUserPreferences] Error fetching preferences:', err.message);
        if (err.message && (err.message.includes('not exist') || err.message.includes('not found') || err.message.includes('Table'))) {
            return { success: true, preferences: null };
        }
        return { success: false, error: err.message };
    }
}

async function handleSaveUserPreferences(catalystApp, { sessionToken, insuranceCompany, iaCompany, preferences }) {
    const sessionResult = await handleValidateSession(catalystApp, { sessionToken });
    if (!sessionResult.valid) {
        return { success: false, error: sessionResult.error || 'Unauthorized', unauthorized: true };
    }

    const { email, role } = sessionResult.user;
    const zcql = catalystApp.zcql();
    const table = catalystApp.datastore().table('UserPreferences');

    if (!preferences || typeof preferences !== 'object') {
        return { success: false, error: 'Invalid preferences payload' };
    }

    let company;
    if (role === 'IA') {
        company = iaCompany;
    } else if (role === 'Adjuster') {
        company = insuranceCompany;
    }

    if (!company || !String(company).trim()) {
        return { success: false, error: 'Scoping company is required to save preferences' };
    }

    const cleanCompany = String(company).trim();
    const safeCompany = escapeZcql(cleanCompany);
    const safeEmail = escapeZcql(email);

    const query = `SELECT ROWID FROM UserPreferences WHERE user_email = '${safeEmail}' AND scoping_company = '${safeCompany}' LIMIT 1`;
    const identifier = { user_email: email, scoping_company: cleanCompany };

    const preferencesJson = JSON.stringify(preferences);

    try {
        const rows = await zcql.executeZCQLQuery(query);
        if (rows && rows.length > 0) {
            const rowId = rows[0].UserPreferences.ROWID;
            await table.updateRow({
                ROWID: rowId,
                ...identifier,
                preferences_json: preferencesJson
            });
            return { success: true, message: 'Preferences updated successfully' };
        } else {
            await table.insertRow({
                ...identifier,
                preferences_json: preferencesJson
            });
            return { success: true, message: 'Preferences created successfully' };
        }
    } catch (err) {
        console.error('[saveUserPreferences] Error saving preferences:', err.message);
        return { success: false, error: err.message };
    }
}

// ---------------------------------------------------------------
// Layer 2: IA-added Carrier Adjuster Contacts
// Table: IACarrierContacts
//   Columns: user_email, adjuster_email, contact_json
// ---------------------------------------------------------------

async function handleGetCarrierContacts(catalystApp, { sessionToken }) {
    const sessionResult = await handleValidateSession(catalystApp, { sessionToken });
    if (!sessionResult.valid) {
        return { success: false, error: sessionResult.error || 'Unauthorized', unauthorized: true };
    }

    const { email, role } = sessionResult.user;
    if (role !== 'IA' && role !== 'Adjuster') {
        // Only IA and Adjuster users maintain a carrier contacts list
        return { success: true, contacts: [] };
    }

    const zcql = catalystApp.zcql();
    const safeEmail = escapeZcql(email);

    try {
        const query = `SELECT ROWID, user_email, adjuster_email, contact_json FROM IACarrierContacts WHERE user_email = '${safeEmail}' LIMIT 100`;
        const rows = await zcql.executeZCQLQuery(query);
        if (!rows || rows.length === 0) {
            return { success: true, contacts: [] };
        }

        const contacts = rows.map(r => {
            const row = r.IACarrierContacts;
            let contact = {};
            try {
                contact = JSON.parse(row.contact_json || '{}');
            } catch (e) {
                console.error('[getCarrierContacts] Failed to parse contact_json for', row.adjuster_email);
            }
            return { adjusterEmail: row.adjuster_email, ...contact };
        });

        return { success: true, contacts };
    } catch (err) {
        console.error('[getCarrierContacts] Error:', err.message);
        if (err.message && (err.message.includes('not exist') || err.message.includes('not found') || err.message.includes('Table'))) {
            return { success: true, contacts: [] };
        }
        return { success: false, error: err.message };
    }
}

async function handleSaveCarrierContact(catalystApp, { sessionToken, adjusterEmail, contact }) {
    const sessionResult = await handleValidateSession(catalystApp, { sessionToken });
    if (!sessionResult.valid) {
        return { success: false, error: sessionResult.error || 'Unauthorized', unauthorized: true };
    }

    const { email, role } = sessionResult.user;
    if (role !== 'IA' && role !== 'Adjuster') {
        return { success: false, error: 'Only IA and Adjuster users can save carrier contacts' };
    }

    const normalizedAdjEmail = normalizeEmail(adjusterEmail);
    if (!normalizedAdjEmail || !isValidEmailFormat(normalizedAdjEmail)) {
        return { success: false, error: 'Valid adjuster email is required' };
    }
    if (!contact || typeof contact !== 'object') {
        return { success: false, error: 'Invalid contact payload' };
    }

    const zcql = catalystApp.zcql();
    const table = catalystApp.datastore().table('IACarrierContacts');
    const safeIaEmail = escapeZcql(email);
    const contactJson = JSON.stringify(contact);

    // Dedup identity for a saved carrier contact = scoping company + adjuster first name + last name.
    const targetCompany = String(contact.scopingCompany || '').trim().toLowerCase();
    const targetFirst = String(contact.adjusterFirstName || '').trim().toLowerCase();
    const targetLast = String(contact.adjusterLastName || '').trim().toLowerCase();

    try {
        // Find an existing contact for this user that matches company + first name + last name.
        const rows = await zcql.executeZCQLQuery(
            `SELECT ROWID, contact_json FROM IACarrierContacts WHERE user_email = '${safeIaEmail}' LIMIT 200`
        );

        let matchRowId = null;
        if (rows && rows.length > 0) {
            for (const r of rows) {
                const row = r.IACarrierContacts;
                let parsed = {};
                try {
                    parsed = JSON.parse(row.contact_json || '{}');
                } catch (e) {
                    continue;
                }
                const c = String(parsed.scopingCompany || '').trim().toLowerCase();
                const f = String(parsed.adjusterFirstName || '').trim().toLowerCase();
                const l = String(parsed.adjusterLastName || '').trim().toLowerCase();
                if (c === targetCompany && f === targetFirst && l === targetLast) {
                    matchRowId = row.ROWID;
                    break;
                }
            }
        }

        if (matchRowId) {
            await table.updateRow({
                ROWID: matchRowId,
                user_email: email,
                adjuster_email: normalizedAdjEmail,
                contact_json: contactJson
            });
            return { success: true, message: 'Carrier contact updated successfully' };
        } else {
            await table.insertRow({
                user_email: email,
                adjuster_email: normalizedAdjEmail,
                contact_json: contactJson
            });
            return { success: true, message: 'Carrier contact created successfully' };
        }
    } catch (err) {
        console.error('[saveCarrierContact] Error:', err.message);
        return { success: false, error: err.message };
    }
}

module.exports = {
    ALLOWED_ROLES,
    handleCreateInvite,
    handleCheckInvite,
    handleRequestOtp,
    handleVerifyOtp,
    handleValidateSession,
    handleLogout,
    handleGetMyClaims,
    handleGetUserPreferences,
    handleSaveUserPreferences,
    handleGetCarrierContacts,
    handleSaveCarrierContact
};
