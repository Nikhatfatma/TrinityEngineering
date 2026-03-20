"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepProgressBar from "@/components/inspection-form/StepProgressBar";
import FormSection from "@/components/inspection-form/FormSection";
import InputField from "@/components/inspection-form/InputField";
import SelectCard from "@/components/inspection-form/SelectCard";
import CheckboxToggle from "@/components/inspection-form/CheckboxToggle";
import AddressGroup from "@/components/inspection-form/AddressGroup";
import SuccessMessage from "@/components/inspection-form/SuccessMessage";

/* ------------------------------------------------------------------ */
/*  Data Constants                                                     */
/* ------------------------------------------------------------------ */

const INSPECTION_TYPES = [
  { id: "storm-damage", title: "Residential Storm Damage", image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80" },
  { id: "structural-loss", title: "Structural Loss", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  { id: "large-complex-loss", title: "Large / Complex Loss", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" },
  { id: "interior-water-loss", title: "Interior Water Loss", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80" },
  { id: "lightning-damage", title: "Lightning Damage", image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80" },
  { id: "vandalism", title: "Vandalism", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80" },
  { id: "chimney-fire-collapse", title: "Chimney Fire / Collapse", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80" },
  { id: "component-failure", title: "Component Failure", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80" },
  { id: "hvac-electrical", title: "HVAC / Electrical", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" },
  { id: "small-fire", title: "Small Fire", image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80" },
  { id: "plumbing-failure", title: "Plumbing Failure", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80" },
];

const BUILDING_TYPES = [
  { id: "residential", title: "Residential", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
  { id: "commercial-municipal-industrial", title: "Commercial / Municipal / Industrial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { id: "multiple-structures", title: "Multiple Structures", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
];

const INSURANCE_COMPANIES = [
  "State Farm", "Allstate", "GEICO", "Progressive", "USAA",
  "Liberty Mutual", "Farmers Insurance", "Nationwide", "Travelers",
  "American Family", "Erie Insurance", "Auto-Owners Insurance",
  "Chubb", "Hartford", "Hanover Insurance", "Cincinnati Financial",
  "Amica Mutual", "Safeco", "MetLife", "AIG", "Other",
];

const MAX_IA_EMAILS = 3;

type IaNotificationType = "invoice" | "report" | "status";

interface IaRecipient {
  email: string;
  notificationType: IaNotificationType;
}

const WIZARD_STEPS = [
  { title: "Inspection", icon: "assignment" },
  { title: "Insurance", icon: "shield" },
  { title: "Adjuster", icon: "gavel" },
  { title: "Policy", icon: "person" },
  { title: "Roofer", icon: "roofing" },
  { title: "PA", icon: "front_hand" },
  { title: "Review", icon: "check_circle" },
];

/* ------------------------------------------------------------------ */
/*  Form Data Type                                                     */
/* ------------------------------------------------------------------ */

interface FormData {
  // Step 1
  inspectionType: string;
  buildingType: string;
  // Step 2
  claimNumber: string;
  insuranceCompany: string;
  adjusterEmail: string;
  adjusterFirstName: string;
  adjusterLastName: string;
  adjusterPhone: string;
  adjusterPhoneExt: string;
  secondEmailForReport: string;
  adjusterComments: string;
  isIAClaim: boolean;
  iaFirstName: string;
  iaLastName: string;
  iaPhone: string;
  iaCompany: string;
  iaRecipients: IaRecipient[];
  // Step 3
  policyholderFirstName: string;
  policyholderLastName: string;
  policyholderPhone1: string;
  spouseFirstName: string;
  spouseLastName: string;
  policyholderPhone2: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  // Step 4
  rooferName: string;
  rooferCompany: string;
  rooferPhone: string;
  inspectionName: string;
  // Step 5
  publicAdjusterName: string;
  publicAdjusterCompany: string;
  publicAdjusterPhone: string;
  publicAdjusterEmail: string;
}

const INITIAL_FORM_DATA: FormData = {
  inspectionType: "",
  buildingType: "",
  claimNumber: "",
  insuranceCompany: "",
  adjusterEmail: "",
  adjusterFirstName: "",
  adjusterLastName: "",
  adjusterPhone: "",
  adjusterPhoneExt: "",
  secondEmailForReport: "",
  adjusterComments: "",
  isIAClaim: false,
  iaFirstName: "",
  iaLastName: "",
  iaPhone: "",
  iaCompany: "",
  iaRecipients: [],
  policyholderFirstName: "",
  policyholderLastName: "",
  policyholderPhone1: "",
  spouseFirstName: "",
  spouseLastName: "",
  policyholderPhone2: "",
  streetAddress: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  rooferName: "",
  rooferCompany: "",
  rooferPhone: "",
  inspectionName: "",
  publicAdjusterName: "",
  publicAdjusterCompany: "",
  publicAdjusterPhone: "",
  publicAdjusterEmail: "",
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function SubmitInspectionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [iaEmailErrors, setIaEmailErrors] = useState<string[]>([]);
  const [iaSectionError, setIaSectionError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [insuranceCompanyQuery, setInsuranceCompanyQuery] = useState("");
  const [insuranceCompanyOpen, setInsuranceCompanyOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({ name: "", ccInvoicesTo: "", splitInvoice: false, invoiceEmail: "", priceList: "2025 Prices" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleAddNewCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyData.name.trim()) {
      alert("Company Name is required.");
      return;
    }
    const newName = newCompanyData.name.trim();
    setInsuranceCompanyQuery(newName);
    setFormData((prev) => ({ ...prev, insuranceCompany: newName }));
    setFieldErrors((prev) => { const next = { ...prev }; delete next.insuranceCompany; return next; });
    setIsAddCompanyModalOpen(false);
  };

  const handleAddNewCompanyReset = () => {
    setNewCompanyData({ name: "", ccInvoicesTo: "", splitInvoice: false, invoiceEmail: "", priceList: "2025 Prices" });
  };

  // keep query in sync when form state changes (eg. reset/back)
  useEffect(() => {
    setInsuranceCompanyQuery(formData.insuranceCompany ?? "");
  }, [formData.insuranceCompany]);

  /* ---- handlers ---- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      setFieldErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        const err = validateField(name, value, next);
        if (err) nextErrors[name] = err;
        else delete nextErrors[name];
        return nextErrors;
      });
      return next;
    });
  };

  /* Scroll to first invalid field helper */
  const scrollToFirstInvalidField = (
    errors: Record<string, string>,
    iaErrors: string[] = []
  ) => {
    // Check for field errors first
    for (const fieldName of Object.keys(errors)) {
      const element = document.getElementById(fieldName);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
        return;
      }
    }

    // Check for IA email errors
    for (let index = 0; index < iaErrors.length; index++) {
      if (iaErrors[index]) {
        const element = document.getElementById(`ia-recipient-${index}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Focus the email input within this element
          const emailInput = element.querySelector(
            'input[name^="iaRecipientEmail_"]'
          ) as HTMLInputElement;
          if (emailInput) emailInput.focus();
          return;
        }
      }
    }
  };

  const handleNext = () => {
    // Validation for Step 1 (Inspection & optional Building Type)
    if (currentStep === 0) {
      if (!formData.inspectionType) {
        setShowErrors(true);
        const errorElement = document.querySelector("[data-field-name='inspectionType']");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return; // Prevent proceeding
      }
      setShowErrors(false); // Clear errors if valid
    }

    // Validation for Step 2 (Insurance)
    if (currentStep === 1) {
      const errors = validateInsuranceStep(formData);
      setFieldErrors(errors);

      let hasStepErrors = Object.keys(errors).length > 0;

      // Validation for IA emails (when IA claim is enabled)
      if (formData.isIAClaim) {
        const recipients = formData.iaRecipients;

        if (!recipients || recipients.length === 0) {
          setIaEmailErrors([]);
          setIaSectionError("At least one IA email is required.");
          hasStepErrors = true;
        } else {
          const { errors: iaErrs, hasError } = validateIaRecipients(recipients);
          setIaEmailErrors(iaErrs);
          if (hasError) {
            setIaSectionError("Please fix the errors in the IA email recipients.");
            hasStepErrors = true;
          } else {
            setIaSectionError("");
          }
        }
      } else {
        // IA hidden => clear IA errors
        setIaEmailErrors([]);
        setIaSectionError("");
      }

      if (hasStepErrors) {
        scrollToFirstInvalidField(errors, formData.isIAClaim ? formData.iaRecipients.map((_, i) => {
          const { errors: iaErrs } = validateIaRecipients(formData.iaRecipients);
          return iaErrs[i] || "";
        }) : []);
        return;
      }

      setFieldErrors({});
    }

    // Validation for Step 3 (Adjuster)
    if (currentStep === 2) {
      const errors = validateAdjusterStep(formData);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        scrollToFirstInvalidField(errors);
        return;
      }
      setFieldErrors({});
    }

    // Validation for Step 4 (Policyholder)
    if (currentStep === 3) {
      const errors = validatePolicyholderStep(formData);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        scrollToFirstInvalidField(errors);
        return;
      }
      setFieldErrors({});
    }

    // Validation for Step 5 (Roofer)
    if (currentStep === 4) {
      const errors = validateRooferStep(formData);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        scrollToFirstInvalidField(errors);
        return;
      }
      setFieldErrors({});
    }

    // Validation for Step 6 (Public Adjuster)
    if (currentStep === 5) {
      const errors = validatePublicAdjusterStep(formData);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        scrollToFirstInvalidField(errors);
        return;
      }
      setFieldErrors({});
    }

    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    // Validate Step 1 selection
    const step1Valid = !!formData.inspectionType; // Building type optional

    if (!step1Valid) {
      setShowErrors(true);
      const errorElement = document.querySelector("[data-field-name='inspectionType']");
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setShowErrors(false);

    // Validate all remaining steps (required + formatting for provided optional)
    const combinedErrors = {
      ...validateInsuranceStep(formData),
      ...validateAdjusterStep(formData),
      ...validatePolicyholderStep(formData),
      ...validateRooferStep(formData),
      ...validatePublicAdjusterStep(formData),
    };

    setFieldErrors(combinedErrors);

    let hasErrors = Object.keys(combinedErrors).length > 0;
    let iaErrs: string[] = [];

    // Validate IA recipients if enabled
    if (formData.isIAClaim) {
      const recipients = formData.iaRecipients;
      if (!recipients || recipients.length === 0) {
        setIaEmailErrors([]);
        setIaSectionError("At least one IA email is required.");
        hasErrors = true;
      } else {
        const { errors: iaErrors, hasError } = validateIaRecipients(recipients);
        iaErrs = iaErrors;
        setIaEmailErrors(iaErrors);
        if (hasError) {
          setIaSectionError("Please fix the errors in the IA email recipients.");
          hasErrors = true;
        } else {
          setIaSectionError("");
        }
      }
    } else {
      setIaEmailErrors([]);
      setIaSectionError("");
    }

    if (hasErrors) {
      scrollToFirstInvalidField(combinedErrors, iaErrs);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const functionUrl = process.env.NEXT_PUBLIC_CATALYST_FUNCTION_URL || '/server/trinity_web_portal_function/execute';
      fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submitInspection', data: formData })
      })
      .then(async (res) => {
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.error || result.message || "An unknown error occurred");
        }
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => {
        console.error("Submission error:", err);
        setSubmitError(err.message || "Failed to submit. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    } catch (err: any) {
      console.error("Submission failed:", err);
      setSubmitError(err.message || "Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
    setIsSubmitted(false);
    setShowErrors(false);
    setIaEmailErrors([]);
    setIaSectionError("");
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---- helpers ---- */

  const labelFor = (id: string, list: { id: string; title: string }[]) =>
    list.find((i) => i.id === id)?.title ?? "—";

  const filteredInsuranceCompanies = useMemo(() => {
    const q = insuranceCompanyQuery.trim().toLowerCase();
    if (!q) return INSURANCE_COMPANIES;
    return INSURANCE_COMPANIES.filter((c) => c.toLowerCase().includes(q));
  }, [insuranceCompanyQuery]);

  const canCreateInsuranceCompany = useMemo(() => {
    const trimmed = insuranceCompanyQuery.trim();
    if (!trimmed) return false;
    const normalized = trimmed.toLowerCase();
    return !INSURANCE_COMPANIES.some((c) => c.toLowerCase() === normalized);
  }, [insuranceCompanyQuery]);

  const commitInsuranceCompanyValue = (value: string) => {
    const trimmed = value.trim();
    const normalized = trimmed.toLowerCase();
    const match = INSURANCE_COMPANIES.find((c) => c.toLowerCase() === normalized);
    const next = match ?? trimmed;
    setFormData((prev) => ({ ...prev, insuranceCompany: next }));
    setInsuranceCompanyQuery(next);
    setFieldErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };
      const err = validateField(
        "insuranceCompany",
        next,
        { ...formData, insuranceCompany: next }
      );
      if (err) nextErrors.insuranceCompany = err;
      else delete nextErrors.insuranceCompany;
      return nextErrors;
    });
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validateIaRecipients = (recipients: IaRecipient[]) => {
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

  const isValidPhoneNumber = (value: string) => {
    const v = value.trim();
    if (!v) return false;
    // Allow common phone punctuation, validate by digit count
    const digits = v.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const isValidZipCode = (value: string) => {
    const v = value.trim();
    if (!v) return false;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 4 && digits.length <= 10;
  };

  const validateField = (
    name: string,
    value: string,
    data: FormData
  ): string => {
    const v = value.trim();

    switch (name) {
      case "claimNumber":
        return v ? "" : "Claim Number is required.";
      case "insuranceCompany":
        return v ? "" : "Insurance Company is required.";
      case "adjusterEmail":
        if (!v) return "Adjuster Email is required.";
        return isValidEmail(v) ? "" : "Enter a valid email address.";
      case "secondEmailForReport":
        if (!v) return "";
        return isValidEmail(v) ? "" : "Enter a valid email address.";
      case "adjusterPhone":
        if (!v) return "Adjuster Phone is required.";
        return isValidPhoneNumber(v) ? "" : "Enter a valid phone number.";
      case "adjusterPhoneExt": {
        if (!v) return "";
        const digits = v.replace(/\D/g, "");
        if (!digits) return "Enter a valid extension.";
        return digits.length <= 6 ? "" : "Enter a valid extension.";
      }
      case "iaPhone":
        if (!v) return "";
        return isValidPhoneNumber(v) ? "" : "Enter a valid phone number.";
      case "policyholderFirstName":
        return v ? "" : "Policyholder First Name is required.";
      case "policyholderLastName":
        return v ? "" : "Policyholder Last Name is required.";
      case "policyholderPhone1":
        if (!v) return "Policyholder Phone 1 is required.";
        return isValidPhoneNumber(v) ? "" : "Enter a valid phone number.";
      case "policyholderPhone2":
        if (!v) return "";
        return isValidPhoneNumber(v) ? "" : "Enter a valid phone number.";
      case "streetAddress":
        return v ? "" : "Street Address is required.";
      case "city":
        return v ? "" : "City is required.";
      case "state":
        return v ? "" : "State is required.";
      case "zip":
        if (!v) return "Zip Code is required.";
        return isValidZipCode(v) ? "" : "Enter a valid Zip Code.";
      case "rooferPhone":
        if (!v) return "";
        return isValidPhoneNumber(v) ? "" : "Enter a valid phone number.";
      case "publicAdjusterPhone":
        if (!v) return "";
        return isValidPhoneNumber(v) ? "" : "Enter a valid phone number.";
      case "publicAdjusterEmail":
        if (!v) return "";
        return isValidEmail(v) ? "" : "Enter a valid email address.";
      default:
        return "";
    }
  };

  const validateInsuranceStep = (data: FormData) => {
    const fieldsToCheck: Array<keyof FormData> = [
      "claimNumber",
      "insuranceCompany",
      "iaPhone",
    ];

    const errors: Record<string, string> = {};
    fieldsToCheck.forEach((f) => {
      const err = validateField(f as string, String(data[f] || ""), data);
      if (err) errors[f as string] = err;
    });
    return errors;
  };

  const validateAdjusterStep = (data: FormData) => {
    const fieldsToCheck: Array<keyof FormData> = [
      "adjusterEmail",
      "secondEmailForReport",
      "adjusterPhone",
      "adjusterPhoneExt",
    ];

    const errors: Record<string, string> = {};
    fieldsToCheck.forEach((f) => {
      const err = validateField(f as string, String(data[f] || ""), data);
      if (err) errors[f as string] = err;
    });
    return errors;
  };

  const validatePolicyholderStep = (data: FormData) => {
    const fieldsToCheck: Array<keyof FormData> = [
      "policyholderFirstName",
      "policyholderLastName",
      "policyholderPhone1",
      "policyholderPhone2",
      "streetAddress",
      "city",
      "state",
      "zip",
    ];

    const errors: Record<string, string> = {};
    fieldsToCheck.forEach((f) => {
      const err = validateField(f as string, String(data[f]), data);
      if (err) errors[f as string] = err;
    });
    return errors;
  };

  const validateRooferStep = (data: FormData) => {
    const errors: Record<string, string> = {};
    const err = validateField("rooferPhone", data.rooferPhone, data);
    if (err) errors.rooferPhone = err;
    return errors;
  };

  const validatePublicAdjusterStep = (data: FormData) => {
    const errors: Record<string, string> = {};
    const phoneErr = validateField(
      "publicAdjusterPhone",
      data.publicAdjusterPhone,
      data
    );
    if (phoneErr) errors.publicAdjusterPhone = phoneErr;
    const emailErr = validateField(
      "publicAdjusterEmail",
      data.publicAdjusterEmail,
      data
    );
    if (emailErr) errors.publicAdjusterEmail = emailErr;
    return errors;
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* ── Header ── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-5 py-3 rounded-full mb-6 border border-primary/20">
              <span className="material-symbols-outlined text-base">send</span>
              <span className="font-bold text-sm uppercase tracking-wider">
                New Investigation Request
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Submit Inspection Request
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete the form below and our PE engineers will respond within 24
              hours
            </p>
          </div>

          {/* ── Progress Bar ── */}
          {!isSubmitted && (
            <StepProgressBar
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              onStepClick={(s) => s < currentStep && goToStep(s)}
            />
          )}

          {/* ── Form Card ── */}
          <div className="bg-white dark:bg-section-dark rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 md:p-6 shadow-xl">
            {isSubmitted ? (
               <SuccessMessage onReset={handleReset} />
            ) : (
              <>
                {/* =============================== */}
                {/*  STEP 1 – Inspection Request    */}
                {/* =============================== */}
                {currentStep === 0 && (
              <FormSection
                title="Inspection Request"
                icon="assignment"
                subtitle="Select the inspection type and building type"
              >
                {/* Inspection Type */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Inspection Type <span className="text-red-500">*</span>
                  </h3>
                  <div
                    data-error-type="step1"
                    data-field-name="inspectionType"
                    className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-1 rounded-2xl transition-colors ${showErrors && !formData.inspectionType ? "border-2 border-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-2 border-transparent"}`}
                  >
                    {INSPECTION_TYPES.map((t) => (
                      <SelectCard
                        key={t.id}
                        label={t.title}
                        value={t.id}
                        image={t.image}
                        selected={formData.inspectionType === t.id}
                        dimmed={!!formData.inspectionType && formData.inspectionType !== t.id}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            inspectionType: t.id,
                            buildingType: t.id === "component-failure" ? "" : formData.buildingType,
                          });
                          setShowErrors(false);
                        }}
                      />
                    ))}
                  </div>
                  {showErrors && !formData.inspectionType && (
                    <p className="text-red-500 text-xs font-semibold mt-1 ml-1 animate-fadeIn">
                      Please select an inspection type.
                    </p>
                  )}
                </div>

                {/* Building Type — hidden for Component Failure */}
                {formData.inspectionType !== "component-failure" && (
                <div>
                  <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Building Type <span className="text-xs font-normal text-gray-400 ml-1">(Optional)</span>
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-1 rounded-2xl transition-colors border-2 border-transparent">
                    {BUILDING_TYPES.map((b) => (
                      <SelectCard
                        key={b.id}
                        label={b.title}
                        value={b.id}
                        image={b.image}
                        selected={formData.buildingType === b.id}
                        dimmed={!!formData.buildingType && formData.buildingType !== b.id}
                        onSelect={() => {
                          setFormData({ ...formData, buildingType: b.id });
                        }}
                      />
                    ))}
                  </div>
                </div>
                )}
              </FormSection>
            )}

            {/* ======================================= */}
            {/*  STEP 2 – Insurance Carrier Information */}
            {/* ======================================= */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LEFT COLUMN — IA Section */}
                  <div className="space-y-6">
                    {/* IA Toggle */}
                    <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-3">IA&apos;s submitting claims on behalf of the carrier, please check the box below:</p>
                    <CheckboxToggle
                      label="This claim is being submitted by an IA"
                      checked={formData.isIAClaim}
                      onChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          isIAClaim: checked,
                          iaRecipients:
                            checked && prev.iaRecipients.length === 0
                              ? [
                                  {
                                    email: "",
                                    notificationType: "report",
                                  },
                                ]
                              : checked
                              ? prev.iaRecipients
                              : [],
                        }));
                        if (!checked) {
                          setIaEmailErrors([]);
                          setIaSectionError("");
                        }
                      }}
                    >
                      <div className="bg-white dark:bg-section-dark rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-3">
                        <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Independent Adjuster Information
                        </h4>
                        <InputField
                          label="IA Company"
                          name="iaCompany"
                          value={formData.iaCompany}
                          onChange={handleChange}
                          placeholder="Company Name"
                          icon="business"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField
                            label="IA First Name"
                            name="iaFirstName"
                            value={formData.iaFirstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            icon="badge"
                          />
                          <InputField
                            label="IA Last Name"
                            name="iaLastName"
                            value={formData.iaLastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            icon="badge"
                          />
                        </div>
                        <InputField
                          label="IA Phone"
                          name="iaPhone"
                          value={formData.iaPhone}
                          onChange={handleChange}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          icon="phone"
                          invalid={!!fieldErrors.iaPhone}
                          error={fieldErrors.iaPhone}
                        />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              IA Email Recipients
                            </h5>
                            <button
                              type="button"
                              onClick={() => {
                                if (formData.iaRecipients.length >= MAX_IA_EMAILS) return;
                                const nextRecipients: IaRecipient[] = [
                                  ...formData.iaRecipients,
                                  {
                                    email: "",
                                    notificationType: "report",
                                  },
                                ];
                                setFormData({
                                  ...formData,
                                  iaRecipients: nextRecipients,
                                });
                                const { errors } = validateIaRecipients(nextRecipients);
                                setIaEmailErrors(errors);
                                setIaSectionError("");

                                const index = nextRecipients.length - 1;
                                const elementId = `ia-recipient-${index}`;
                                // Allow DOM to update then scroll the new recipient into view
                                setTimeout(() => {
                                  const el = document.getElementById(elementId);
                                  if (el) {
                                    el.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                  }
                                }, 0);
                              }}
                              disabled={formData.iaRecipients.length >= MAX_IA_EMAILS}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">
                                add
                              </span>
                              Add Email
                            </button>
                          </div>

                          <div className="space-y-4">
                            {formData.iaRecipients.map((recipient, index) => (
                              <div
                                key={index}
                                id={`ia-recipient-${index}`}
                                className={`rounded-xl border p-4 bg-gray-50 dark:bg-background-dark/60 ${
                                  iaEmailErrors[index]
                                    ? "border-red-400 bg-red-50/60 dark:bg-red-900/20"
                                    : "border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)] gap-4 items-start">
                                  <InputField
                                    label={`IA Email ${formData.iaRecipients.length > 1 ? `#${index + 1}` : ""}`}
                                    name={`iaRecipientEmail_${index}`}
                                    value={recipient.email}
                                    onChange={(e) => {
                                      const nextRecipients = formData.iaRecipients.map(
                                        (r, i) =>
                                          i === index ? { ...r, email: e.target.value } : r
                                      );
                                      setFormData({
                                        ...formData,
                                        iaRecipients: nextRecipients,
                                      });
                                      const { errors } = validateIaRecipients(nextRecipients);
                                      setIaEmailErrors(errors);
                                      setIaSectionError("");
                                    }}
                                    type="email"
                                    placeholder="ia@company.com"
                                    icon="email"
                                  />

                                  <div className="flex flex-col gap-2">
                                    <div className="space-y-1">
                                      <label
                                        htmlFor={`iaNotificationType_${index}`}
                                        className="text-xs font-semibold text-gray-600 dark:text-gray-300"
                                      >
                                        Delivery Preference
                                      </label>
                                      <select
                                        id={`iaNotificationType_${index}`}
                                        name={`iaNotificationType_${index}`}
                                        value={recipient.notificationType}
                                        onChange={(e) => {
                                          const nextRecipients = formData.iaRecipients.map(
                                            (r, i) =>
                                              i === index
                                                ? {
                                                    ...r,
                                                    notificationType:
                                                      e.target.value as IaNotificationType,
                                                  }
                                                : r
                                          );
                                          setFormData({
                                            ...formData,
                                            iaRecipients: nextRecipients,
                                          });
                                        }}
                                        className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                                      >
                                        <option value="invoice">Send Invoice</option>
                                        <option value="report">Send Report</option>
                                        <option value="status">Send Status Notifications</option>
                                      </select>
                                    </div>

                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextRecipients = formData.iaRecipients.filter(
                                            (_, i) => i !== index
                                          );
                                          setFormData({
                                            ...formData,
                                            iaRecipients: nextRecipients,
                                          });
                                          const { errors } =
                                            validateIaRecipients(nextRecipients);
                                          setIaEmailErrors(errors);
                                          if (nextRecipients.length === 0) {
                                            setIaSectionError(
                                              "At least one IA email is required."
                                            );
                                          }
                                        }}
                                        className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      >
                                        <span className="material-symbols-outlined text-sm">
                                          remove
                                        </span>
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {iaSectionError && (
                              <p className="text-xs text-red-500 font-semibold pt-1">
                                {iaSectionError}
                              </p>
                            )}
                            {formData.iaRecipients.length >= MAX_IA_EMAILS && (
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                You have reached the maximum of {MAX_IA_EMAILS} IA email
                                recipients.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CheckboxToggle>
                  </div>
                  </div>

                  {/* RIGHT COLUMN — Claim Details */}
                  <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700 space-y-3">
                    <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Claim Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Claim Number"
                      name="claimNumber"
                      value={formData.claimNumber}
                      onChange={handleChange}
                      placeholder="CLM-123456"
                      required
                      icon="tag"
                      invalid={!!fieldErrors.claimNumber}
                      error={fieldErrors.claimNumber}
                    />

                    {/* Insurance Company Search + Create */}
                    <div className="space-y-1 relative">
                      <label
                        htmlFor="insuranceCompany"
                        className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">business</span>
                        Insurance Company
                      </label>
                      <input
                        id="insuranceCompany"
                        name="insuranceCompany"
                        value={insuranceCompanyQuery}
                        onChange={(e) => {
                          const next = e.target.value;
                          setInsuranceCompanyQuery(next);
                          setFormData((prev) => ({ ...prev, insuranceCompany: next }));
                          setFieldErrors((prevErrors) => {
                            const nextErrors = { ...prevErrors };
                            const err = validateField(
                              "insuranceCompany",
                              next,
                              { ...formData, insuranceCompany: next }
                            );
                            if (err) nextErrors.insuranceCompany = err;
                            else delete nextErrors.insuranceCompany;
                            return nextErrors;
                          });
                          setInsuranceCompanyOpen(true);
                        }}
                        onFocus={() => setInsuranceCompanyOpen(true)}
                        onBlur={() => {
                          setTimeout(() => setInsuranceCompanyOpen(false), 120);
                          commitInsuranceCompanyValue(insuranceCompanyQuery);
                        }}
                        placeholder="Search or type a company..."
                        className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                          fieldErrors.insuranceCompany
                            ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                            : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
                        }`}
                      />
                      {fieldErrors.insuranceCompany && (
                        <p className="text-xs text-red-500 font-semibold -mt-1">
                          {fieldErrors.insuranceCompany}
                        </p>
                      )}
                      {insuranceCompanyOpen && (
                        <div className="absolute z-20 mt-2 w-full max-h-56 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-section-dark shadow-xl">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setInsuranceCompanyOpen(false);
                              setIsAddCompanyModalOpen(true);
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
                          >
                            Add New Company
                            <span className="material-symbols-outlined text-base">domain_add</span>
                          </button>
                          {filteredInsuranceCompanies.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                commitInsuranceCompanyValue(c);
                                setInsuranceCompanyOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${
                                formData.insuranceCompany === c
                                  ? "font-bold text-primary dark:text-accent"
                                  : "text-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* ======================================= */}
            {/*  STEP 3 – Adjuster Information          */}
            {/* ======================================= */}
            {currentStep === 2 && (
              <FormSection
                title="Adjuster Details"
                icon="gavel"
                subtitle="Provide the adjuster's contact information"
              >
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700 space-y-3">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Adjuster Email"
                      name="adjusterEmail"
                      value={formData.adjusterEmail}
                      onChange={handleChange}
                      type="email"
                      placeholder="adjuster@insurance.com"
                      required
                      icon="email"
                      invalid={!!fieldErrors.adjusterEmail}
                      error={fieldErrors.adjusterEmail}
                    />
                    {formData.adjusterEmail && (
                      <InputField
                        label="Second Email for Report"
                        name="secondEmailForReport"
                        value={formData.secondEmailForReport}
                        onChange={handleChange}
                        type="email"
                        placeholder="optional@email.com"
                        icon="alternate_email"
                        invalid={!!fieldErrors.secondEmailForReport}
                        error={fieldErrors.secondEmailForReport}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Adjuster First Name"
                      name="adjusterFirstName"
                      value={formData.adjusterFirstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      icon="badge"
                    />
                    <InputField
                      label="Adjuster Last Name"
                      name="adjusterLastName"
                      value={formData.adjusterLastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      icon="badge"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Adjuster Phone"
                      name="adjusterPhone"
                      value={formData.adjusterPhone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      icon="phone"
                      invalid={!!fieldErrors.adjusterPhone}
                      error={fieldErrors.adjusterPhone}
                    />
                    <InputField
                      label="Adjuster Phone Extension"
                      name="adjusterPhoneExt"
                      value={formData.adjusterPhoneExt}
                      onChange={handleChange}
                      placeholder="Ext. 123"
                      icon="dialpad"
                      invalid={!!fieldErrors.adjusterPhoneExt}
                      error={fieldErrors.adjusterPhoneExt}
                    />
                  </div>

                  {/* Adjuster Comments */}
                  <div className="space-y-2">
                    <label
                      htmlFor="adjusterComments"
                      className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-primary dark:text-accent text-sm">comment</span>
                      Adjuster&apos;s Comments
                    </label>
                    <textarea
                      id="adjusterComments"
                      name="adjusterComments"
                      value={formData.adjusterComments}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any additional comments from the adjuster..."
                      className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none transition-all"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">All damage sources are automatically checked - you do not need to enter whether fraud or any other source of damage is suspected.</p>
                  </div>
                </div>
                </div>
              </FormSection>
            )}

            {/* ====================================== */}
            {/*  STEP 4 – Policyholder Information     */}
            {/* ====================================== */}
            {currentStep === 3 && (
              <FormSection
                title="Policyholder Information"
                icon="person"
                subtitle="Enter the policyholder and property details"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Policyholder First Name"
                      name="policyholderFirstName"
                      value={formData.policyholderFirstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                      icon="badge"
                      invalid={!!fieldErrors.policyholderFirstName}
                      error={fieldErrors.policyholderFirstName}
                    />
                    <InputField
                      label="Policyholder Last Name"
                      name="policyholderLastName"
                      value={formData.policyholderLastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                      icon="badge"
                      invalid={!!fieldErrors.policyholderLastName}
                      error={fieldErrors.policyholderLastName}
                    />
                  </div>
                  <InputField
                    label="Policyholder Phone 1"
                    name="policyholderPhone1"
                    value={formData.policyholderPhone1}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    icon="phone"
                    invalid={!!fieldErrors.policyholderPhone1}
                    error={fieldErrors.policyholderPhone1}
                  />

                  {/* Spouse / Second Policyholder */}
                  <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary dark:text-accent text-sm">group</span>
                      Spouse / Second Policyholder
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField label="First Name" name="spouseFirstName" value={formData.spouseFirstName} onChange={handleChange} placeholder="First Name" icon="badge" />
                      <InputField label="Last Name" name="spouseLastName" value={formData.spouseLastName} onChange={handleChange} placeholder="Last Name" icon="badge" />
                    </div>
                  </div>

                  <InputField
                    label="Policyholder Phone 2"
                    name="policyholderPhone2"
                    value={formData.policyholderPhone2}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    icon="phone"
                    invalid={!!fieldErrors.policyholderPhone2}
                    error={fieldErrors.policyholderPhone2}
                  />

                  {/* Address */}
                  <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                    <AddressGroup
                      streetAddress={formData.streetAddress}
                      addressLine2={formData.addressLine2}
                      city={formData.city}
                      state={formData.state}
                      zip={formData.zip}
                      onChange={handleChange}
                      errors={fieldErrors}
                    />
                  </div>
                </div>
              </FormSection>
            )}

            {/* ============================== */}
            {/*  STEP 5 – Roofer Information   */}
            {/* ============================== */}
            {currentStep === 4 && (
              <FormSection
                title="Roofer Information"
                icon="roofing"
                subtitle="Provide roofer details if applicable"
                optional
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField label="Roofer Name" name="rooferName" value={formData.rooferName} onChange={handleChange} placeholder="Full Name" icon="badge" />
                    <InputField label="Roofer Company" name="rooferCompany" value={formData.rooferCompany} onChange={handleChange} placeholder="Company Name" icon="business" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Roofer Phone"
                      name="rooferPhone"
                      value={formData.rooferPhone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      icon="phone"
                      invalid={!!fieldErrors.rooferPhone}
                      error={fieldErrors.rooferPhone}
                    />
                    <InputField label="Inspection Name" name="inspectionName" value={formData.inspectionName} onChange={handleChange} placeholder="Inspection Name" icon="description" />
                  </div>
                </div>
              </FormSection>
            )}

            {/* ======================================== */}
            {/*  STEP 6 – Public Adjuster Information    */}
            {/* ======================================== */}
            {currentStep === 5 && (
              <FormSection
                title="Public Adjuster Information"
                icon="gavel"
                subtitle="Provide public adjuster details if applicable"
                optional
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField label="Public Adjuster Name" name="publicAdjusterName" value={formData.publicAdjusterName} onChange={handleChange} placeholder="Full Name" icon="badge" />
                    <InputField label="Public Adjuster Company" name="publicAdjusterCompany" value={formData.publicAdjusterCompany} onChange={handleChange} placeholder="Company Name" icon="business" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Public Adjuster Phone"
                      name="publicAdjusterPhone"
                      value={formData.publicAdjusterPhone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      icon="phone"
                      invalid={!!fieldErrors.publicAdjusterPhone}
                      error={fieldErrors.publicAdjusterPhone}
                    />
                    <InputField
                      label="Public Adjuster Email"
                      name="publicAdjusterEmail"
                      value={formData.publicAdjusterEmail}
                      onChange={handleChange}
                      type="email"
                      placeholder="adjuster@company.com"
                      icon="email"
                      invalid={!!fieldErrors.publicAdjusterEmail}
                      error={fieldErrors.publicAdjusterEmail}
                    />
                  </div>
                </div>
              </FormSection>
            )}

            {/* ========================= */}
            {/*  STEP 7 – Review & Submit */}
            {/* ========================= */}
            {currentStep === 6 && (
              <FormSection
                title="Review & Submit"
                icon="check_circle"
                subtitle="Review your information before submitting"
              >
                <div className="space-y-3">
                  {/* Section 1 – Inspection Request */}
                  <ReviewBlock
                    title="Inspection Request"
                    icon="assignment"
                    onEdit={() => goToStep(0)}
                  >
                    <ReviewRow label="Inspection Type" value={labelFor(formData.inspectionType, INSPECTION_TYPES)} />
                    <ReviewRow label="Building Type" value={labelFor(formData.buildingType, BUILDING_TYPES)} />
                  </ReviewBlock>

                  {/* Section 2 – Insurance Carrier */}
                  <ReviewBlock
                    title="Insurance Carrier"
                    icon="shield"
                    onEdit={() => goToStep(1)}
                  >
                    <ReviewRow label="Claim Number" value={formData.claimNumber} />
                    <ReviewRow label="Insurance Company" value={formData.insuranceCompany} />
                    <ReviewRow label="Adjuster" value={`${formData.adjusterFirstName} ${formData.adjusterLastName}`.trim()} />
                    <ReviewRow label="Adjuster Email" value={formData.adjusterEmail} />
                    <ReviewRow label="Adjuster Phone" value={formData.adjusterPhone} />
                    {formData.adjusterPhoneExt && <ReviewRow label="Extension" value={formData.adjusterPhoneExt} />}
                    {formData.secondEmailForReport && <ReviewRow label="Second Email" value={formData.secondEmailForReport} />}
                    {formData.adjusterComments && <ReviewRow label="Comments" value={formData.adjusterComments} />}
                    {formData.isIAClaim && (
                      <>
                        <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-3 mt-1">
                          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">IA Information</span>
                        </div>
                        <ReviewRow label="IA Name" value={`${formData.iaFirstName} ${formData.iaLastName}`.trim()} />
                        <ReviewRow label="IA Company" value={formData.iaCompany} />
                        <ReviewRow label="IA Phone" value={formData.iaPhone} />
                        {formData.iaRecipients.length > 0 && (
                          <ReviewRow
                            label="IA Email Recipients"
                            value={formData.iaRecipients
                              .map((r) => {
                                const label =
                                  r.notificationType === "invoice"
                                    ? "Invoice"
                                    : r.notificationType === "status"
                                    ? "Status Notifications"
                                    : "Report";
                                return `${r.email} (${label})`;
                              })
                              .join("; ")}
                          />
                        )}
                      </>
                    )}
                  </ReviewBlock>

                  {/* Section 3 – Policyholder */}
                  <ReviewBlock
                    title="Policyholder"
                    icon="person"
                    onEdit={() => goToStep(2)}
                  >
                    <ReviewRow label="Policyholder" value={`${formData.policyholderFirstName} ${formData.policyholderLastName}`.trim()} />
                    <ReviewRow label="Phone 1" value={formData.policyholderPhone1} />
                    {(formData.spouseFirstName || formData.spouseLastName) && (
                      <ReviewRow label="Spouse" value={`${formData.spouseFirstName} ${formData.spouseLastName}`.trim()} />
                    )}
                    {formData.policyholderPhone2 && <ReviewRow label="Phone 2" value={formData.policyholderPhone2} />}
                    <ReviewRow label="Address" value={[formData.streetAddress, formData.addressLine2, formData.city, formData.state, formData.zip].filter(Boolean).join(", ")} />
                  </ReviewBlock>

                  {/* Section 4 – Roofer */}
                  <ReviewBlock
                    title="Roofer Information"
                    icon="roofing"
                    onEdit={() => goToStep(3)}
                    optional
                  >
                    <ReviewRow label="Roofer Name" value={formData.rooferName} />
                    <ReviewRow label="Company" value={formData.rooferCompany} />
                    <ReviewRow label="Phone" value={formData.rooferPhone} />
                    <ReviewRow label="Inspection Name" value={formData.inspectionName} />
                  </ReviewBlock>

                  {/* Section 5 – Public Adjuster */}
                  <ReviewBlock
                    title="Public Adjuster"
                    icon="gavel"
                    onEdit={() => goToStep(4)}
                    optional
                  >
                    <ReviewRow label="Name" value={formData.publicAdjusterName} />
                    <ReviewRow label="Company" value={formData.publicAdjusterCompany} />
                    <ReviewRow label="Phone" value={formData.publicAdjusterPhone} />
                    <ReviewRow label="Email" value={formData.publicAdjusterEmail} />
                  </ReviewBlock>
                </div>
              </FormSection>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < WIZARD_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Next
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {submitError && (
                    <div className="text-red-500 text-sm font-semibold max-w-md text-right bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
                      {submitError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white border-t-transparent inline-block"></span>
                    ) : (
                      <span className="material-symbols-outlined">send</span>
                    )}
                    {isSubmitting ? "Submitting..." : "Send Inspection"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </main>

      <Footer />

      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-section-dark w-full max-w-[420px] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-fadeIn">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-background-dark/50">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">domain_add</span>
                Add New Company
              </h3>
              <button onClick={() => setIsAddCompanyModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleAddNewCompanySubmit} className="px-4 py-3 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Company Name <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Insurance Co. Name" value={newCompanyData.name} onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">CC Invoices To</label>
                <input type="email" placeholder="email@company.com" value={newCompanyData.ccInvoicesTo} onChange={(e) => setNewCompanyData({ ...newCompanyData, ccInvoicesTo: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="splitInvoiceCheck" checked={newCompanyData.splitInvoice} onChange={(e) => setNewCompanyData({ ...newCompanyData, splitInvoice: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="splitInvoiceCheck" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Split Invoice from Report</label>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Invoice Email</label>
                <input type="email" placeholder="invoice@company.com" value={newCompanyData.invoiceEmail} onChange={(e) => setNewCompanyData({ ...newCompanyData, invoiceEmail: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Price List</label>
                <select value={newCompanyData.priceList} onChange={(e) => setNewCompanyData({ ...newCompanyData, priceList: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent cursor-pointer">
                  <option value="2025 Prices">2025 Prices</option>
                  <option value="2022 Prices">2022 Prices</option>
                  <option value="Do Not Send Fee Schedule">Do Not Send Fee Schedule</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={handleAddNewCompanyReset} className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Reset</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm">Add Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.45s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review sub-components                                              */
/* ------------------------------------------------------------------ */

function ReviewBlock({
  title,
  icon,
  onEdit,
  optional,
  children,
}: {
  title: string;
  icon: string;
  onEdit: () => void;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-5 md:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary dark:text-accent text-xl">
            {icon}
          </span>
          <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
          {optional && (
            <span className="text-[10px] font-semibold bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary dark:text-accent hover:underline transition-all"
        >
          <span className="material-symbols-outlined text-base">edit</span>
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white break-words">{value}</p>
    </div>
  );
}
