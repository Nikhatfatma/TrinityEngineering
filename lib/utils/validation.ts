/**
 * Standard email validation regex.
 */
export const isValidEmail = (value: string): boolean => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

/**
 * Validates date in MM/DD/YYYY format.
 */
export const isValidMMDDYYYY = (value: string): boolean => {
  if (!value) return false;
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!regex.test(value)) return false;

  const [m, d, y] = value.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

/**
 * Standard phone number validation (7-15 digits after stripping punctuation).
 */
export const isValidPhoneNumber = (value: string): boolean => {
  const v = (value || "").trim();
  const digits = v.replace(/\D/g, "");
  if (!digits) return false;
  return digits.length >= 7 && digits.length <= 15;
};

export interface IaRecipient {
  email: string;
  notificationType: string[];
}

/**
 * Standard Zip Code validation (4-10 digits).
 */
export const isValidZipCode = (value: string): boolean => {
  const v = (value || "").trim();
  if (!v) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 4 && digits.length <= 10;
};

/**
 * Validates a list of IA recipients for formatting and duplicates.
 */
export const validateIaRecipients = (recipients: IaRecipient[]) => {
  const errors = recipients.map(() => "");
  const seen = new Map<string, number>();

  recipients.forEach((recipient, index) => {
    const email = recipient.email.trim();

    if (!email) {
      errors[index] = "Email is required.";
      return;
    }

    if (!isValidEmail(email)) {
      errors[index] = "Enter a valid email address.";
    }

    const normalized = email.toLowerCase();
    if (seen.has(normalized)) {
      const firstIndex = seen.get(normalized)!;
      errors[index] = "Duplicate email.";
      if (!errors[firstIndex]) {
        errors[firstIndex] = "Duplicate email.";
      }
    } else {
      seen.set(normalized, index);
    }
  });

  const hasError = errors.some((e) => e !== "");
  return { errors, hasError };
};

export interface AdjusterEmail {
  email: string;
  sendCopyOf: string[];
}

export const validateAdjusterEmails = (recipients: AdjusterEmail[]) => {
  const errors = recipients.map(() => "");
  const seen = new Map<string, number>();

  recipients.forEach((recipient, index) => {
    const email = recipient.email.trim();

    if (!email) {
      errors[index] = "Email is required.";
      return;
    }

    if (!isValidEmail(email)) {
      errors[index] = "Enter a valid email address.";
    }

    const normalized = email.toLowerCase();
    if (seen.has(normalized)) {
      const firstIndex = seen.get(normalized)!;
      errors[index] = "Duplicate email.";
      if (!errors[firstIndex]) {
        errors[firstIndex] = "Duplicate email.";
      }
    } else {
      seen.set(normalized, index);
    }
  });

  const hasError = errors.some((e) => e !== "");
  return { errors, hasError };
};
export interface ContactEmail {
  email: string;
  contactType: "IA" | "Adjuster (Carrier)";
  sendCopy: string[];
}

export const validateContactEmails = (recipients: ContactEmail[]) => {
  const errors = recipients.map(() => "");
  const seen = new Map<string, number>();

  recipients.forEach((recipient, index) => {
    const email = recipient.email.trim();
    if (!email) {
      errors[index] = "Email is required.";
      return;
    }
    if (!isValidEmail(email)) {
      errors[index] = "Enter a valid email address.";
    }

    const normalized = email.toLowerCase();
    if (seen.has(normalized)) {
      const firstIndex = seen.get(normalized)!;
      errors[index] = "Duplicate email.";
      if (!errors[firstIndex]) {
        errors[firstIndex] = "Duplicate email.";
      }
    } else {
      seen.set(normalized, index);
    }
  });

  const hasError = errors.some((e) => e !== "");
  return { errors, hasError };
};
