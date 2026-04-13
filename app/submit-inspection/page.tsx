"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import StepProgressBar from "@/components/inspection-form/StepProgressBar";
import FormSection from "@/components/inspection-form/FormSection";
import SectionHeader from "@/components/inspection-form/SectionHeader";
import InputField from "@/components/inspection-form/InputField";
import SelectCard from "@/components/inspection-form/SelectCard";
import CheckboxToggle from "@/components/inspection-form/CheckboxToggle";
import AddressGroup from "@/components/inspection-form/AddressGroup";
import SuccessMessage from "@/components/inspection-form/SuccessMessage";
import PhoneInputField from "@/components/inspection-form/PhoneInputField";
import {
  ClipboardList,
  Shield,
  User,
  Home,
  Hand,
  CheckCircle,
  Tag,
  Building2,
  UserRound,
  Phone,
  Mail,
  Hash,
  MessageSquare,
  Edit2,
  ArrowLeft,
  ArrowRight,
  Send,
  X,
  Plus,
  Gavel,
  Settings, // fallback for component failure
  FileText,
  BadgeAlert,
  MapPin,
  Loader2,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { isValidEmail, isValidPhoneNumber, isValidZipCode, validateIaRecipients, type IaRecipient, validateAdjusterEmails, type AdjusterEmail } from "@/lib/utils/validation";

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

/* Insurance companies are now fetched from the database via API — no hardcoded list */

const MAX_IA_EMAILS = 3;
const MAX_ADJ_EMAILS = 3;

const SEND_COPY_OPTIONS = ["all", "report", "invoice", "notifications"] as const;



const WIZARD_STEPS = [
  { title: "Inspection & Property", icon: ClipboardList },
  { title: "Insurance & Adjuster", icon: Shield },
  { title: "Property Contact Info", icon: User },
  { title: "Roofer & Public Adjuster", icon: Home },
  { title: "Review Your Submission", icon: CheckCircle },
];

/**
 * DOM-order priority for required fields per step.
 * scrollToFirstInvalidField iterates this list so it always
 * focuses the first *visible* invalid field, regardless of
 * JS object key order.
 */
const STEP_FIELD_ORDER: Record<number, string[]> = {
  1: ["claimNumber", "adjusterFirstName", "adjusterLastName", "adjusterPhone", "adjusterEmail" as any, "iaCompany", "iaFirstName", "iaLastName", "iaPhone"],
  2: ["policyholderFirstName", "policyholderLastName", "streetAddress", "city", "state", "zip"],
};

/* ------------------------------------------------------------------ */
/*  Form Data Type                                                     */
/* ------------------------------------------------------------------ */

interface FormData {
  // Step 1
  inspectionType: string;
  buildingType: string;
  claimNumber: string;
  insuranceCompany: string;
  dateOfLoss: string;
  policyNumber: string;
  adjusterCompany: string;
  adjusterFirstName: string;
  adjusterLastName: string;
  adjusterPhone: string;
  adjusterPhoneExt: string;
  secondEmailForReport: string;
  adjusterEmails: AdjusterEmail[];
  adjusterComments: string;
  isIAClaim: boolean;
  iaFirstName: string;
  iaLastName: string;
  iaPhone: string;
  iaCompany: string;
  iaRecipients: IaRecipient[];
  // Step 2 - Policy & Address
  policyholderFirstName: string;
  policyholderLastName: string;
  policyholderPhone1: string;
  policyholderPhone1Extra: string;
  propertyContactEmail: string;
  spouseFirstName: string;
  spouseLastName: string;
  policyholderPhone2: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  // Step 3 - Roofer
  rooferName: string;
  rooferCompany: string;
  rooferPhone: string;
  rooferEmail: string;
  // Step 4 - Public Adjuster
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
  dateOfLoss: "",
  policyNumber: "",
  adjusterCompany: "",
  adjusterFirstName: "",
  adjusterLastName: "",
  adjusterPhone: "",
  adjusterPhoneExt: "",
  secondEmailForReport: "",
  adjusterEmails: [{ email: "", sendCopyOf: ["all", "report", "invoice", "notifications"] }],
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
  policyholderPhone1Extra: "",
  propertyContactEmail: "",
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
  rooferEmail: "",
  publicAdjusterName: "",
  publicAdjusterCompany: "",
  publicAdjusterPhone: "",
  publicAdjusterEmail: "",
};

const isPhoneEmpty = (val: string) => {
  const v = (val || "").trim();
  const digits = v.replace(/\D/g, "");
  // Treat as empty if it has no digits, or only the country code (1 digit for US default)
  return digits.length <= 1;
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function SubmitInspectionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [iaEmailErrors, setIaEmailErrors] = useState<string[]>([]);
  const [iaSectionError, setIaSectionError] = useState("");
  const [adjusterEmailErrors, setAdjusterEmailErrors] = useState<string[]>([]);
  const [adjusterSectionError, setAdjusterSectionError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [insuranceCompanyQuery, setInsuranceCompanyQuery] = useState("");
  const [insuranceCompanyOpen, setInsuranceCompanyOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({ name: "", ccInvoicesTo: "", splitInvoice: false, invoiceEmail: "", priceList: "2025 Prices" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [hasSentCompany, setHasSentCompany] = useState(false);
  const [createCompanyMessage, setCreateCompanyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // DISABLED: Secondary primary phone feature — uncomment to restore
  // const [showPrimaryPhone2, setShowPrimaryPhone2] = useState(false);
  
  const [skipRooferValidation, setSkipRooferValidation] = useState(false);
  const [skipAdjusterValidation, setSkipAdjusterValidation] = useState(false);
  const [lastButtonState, setLastButtonState] = useState("Next");
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationQueue, setValidationQueue] = useState<('roofer' | 'adjuster')[]>([]);

  const getStep3ValidationConfig = (type: 'roofer' | 'adjuster' | null) => {
    if (type === 'roofer') {
      return {
        message: "If a roofer is involved, please provide their phone number for scheduling",
        missingFields: ["rooferPhone"]
      };
    }
    if (type === 'adjuster') {
      const missing = [];
      if (!formData.publicAdjusterEmail.trim()) missing.push("publicAdjusterEmail");
      if (isPhoneEmpty(formData.publicAdjusterPhone)) missing.push("publicAdjusterPhone");
      
      return {
        message: "If a public adjuster is involved, please provide both their phone number and email for scheduling",
        missingFields: missing
      };
    }
    return { message: "", missingFields: [] };
  };

  const validationModalConfig = getStep3ValidationConfig(validationQueue[0] || null);

  /* ── Insurance Company API Search State ── */
  const [insuranceSearchResults, setInsuranceSearchResults] = useState<{ id: string; name: string; zoho_creator_id: string }[]>([]);
  const [insuranceSearchLoading, setInsuranceSearchLoading] = useState(false);
  const [aliasMatch, setAliasMatch] = useState<{ matchedBy: string; results: { id: string; name: string; zoho_creator_id: string }[] } | null>(null);
  const [aliasDismissed, setAliasDismissed] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [masterInsuranceList, setMasterInsuranceList] = useState<{ id: string; name: string; zoho_creator_id: string }[]>([]);
  const insuranceCacheRef = useRef<Record<string, { results: any[], matchedBy?: string }>>({});

  useEffect(() => {
    fetch('/api/insurance-companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'searchInsuranceCompanies', search: '' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.results) {
          setMasterInsuranceList(data.results);
          setInsuranceSearchResults(data.results);
        }
      })
      .catch(err => console.error('Failed to fetch insurance companies:', err));
  }, []);

  /** Debounced API call to search insurance companies */
  const searchInsuranceCompanies = useCallback((query: string) => {
    const trimmed = query.trim();
    
    // Clear any pending debounce
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // If master list is already loaded, filter locally for instant results
    if (masterInsuranceList.length > 0) {
      setInsuranceSearchLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        if (!trimmed) {
          setInsuranceSearchResults(masterInsuranceList);
        } else {
          const lowerQuery = trimmed.toLowerCase();
          const filtered = masterInsuranceList.filter(c => 
            c.name.toLowerCase().includes(lowerQuery)
          );
          setInsuranceSearchResults(filtered);
        }
        setAliasMatch(null); // Local search doesn't support sophisticated alias mapping yet
        setInsuranceSearchLoading(false);
      }, 50); // Minimal debounce for local filtering
      return;
    }

    // Fallback: Check cache
    if (insuranceCacheRef.current[trimmed]) {
      const cached = insuranceCacheRef.current[trimmed];
      setInsuranceSearchResults(cached.results);
      if (cached.matchedBy === 'alias' && cached.results.length > 0) {
        setAliasMatch({ matchedBy: cached.matchedBy, results: cached.results });
        setAliasDismissed(false);
      } else {
        setAliasMatch(null);
      }
      setInsuranceSearchLoading(false);
      return;
    }

    setInsuranceSearchLoading(true);

    // Debounce 300ms for remote API fallback
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/insurance-companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'searchInsuranceCompanies', search: trimmed }),
        });
        const data = await res.json();

        if (data.success) {
          const results = data.results || [];
          setInsuranceSearchResults(results);
          
          // Cache the results locally
          insuranceCacheRef.current[trimmed] = { results, matchedBy: data.matchedBy };

          // If matched by alias, show "Did you mean" suggestion
          if (data.matchedBy === 'alias' && results.length > 0) {
            setAliasMatch({ matchedBy: data.matchedBy, results: results });
            setAliasDismissed(false);
          } else {
            setAliasMatch(null);
          }
        } else {
          setInsuranceSearchResults([]);
          setAliasMatch(null);
        }
      } catch (err) {
        console.error('Insurance search error:', err);
        setInsuranceSearchResults([]);
      } finally {
        setInsuranceSearchLoading(false);
      }
    }, 300);
  }, [masterInsuranceList]);

  /* ── Step 3 Helper Logic ── */
  const isStep3FieldsEmpty = useCallback(() => {
    try {
      const { 
        rooferName, rooferCompany, rooferPhone, rooferEmail, 
        publicAdjusterName, publicAdjusterCompany, publicAdjusterPhone, publicAdjusterEmail 
      } = formData;
      
      return (
        !rooferName.trim() && !rooferCompany.trim() && isPhoneEmpty(rooferPhone) && !rooferEmail.trim() &&
        !publicAdjusterName.trim() && !publicAdjusterCompany.trim() && isPhoneEmpty(publicAdjusterPhone) && !publicAdjusterEmail.trim()
      );
    } catch (err) {
      console.error("Error checking Step 3 fields:", err);
      return false;
    }
  }, [formData]);

  // Log Skip/Next button state changes
  useEffect(() => {
    if (currentStep === 3) {
      const isEmpty = isStep3FieldsEmpty();
      const currentState = isEmpty ? "Skip" : "Next";
      if (currentState !== lastButtonState) {
        console.info(`[Step 3] Button state changed to: ${currentState}`);
        setLastButtonState(currentState);
      }
    } else {
      // Reset tracker when leaving step 3
      if (lastButtonState !== "Next") setLastButtonState("Next");
    }
  }, [formData, currentStep, isStep3FieldsEmpty, lastButtonState]);

  const handleAddNewCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingCompany || hasSentCompany) return;
    
    setHasSentCompany(true);
    if (!newCompanyData.name.trim()) {
      setCreateCompanyMessage({ type: 'error', text: "Company Name is required." });
      return;
    }

    setIsCreatingCompany(true);
    setCreateCompanyMessage(null);

    try {
      const res = await fetch('/api/insurance-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createCompany', data: newCompanyData }),
      });
      const data = await res.json();

      if (data.success) {
        setCreateCompanyMessage({ type: 'success', text: "Company submitted for approval. You will be able to select it once it becomes active." });

        const dynamicValue = newCompanyData.name;
        setFormData(prev => ({ ...prev, insuranceCompany: dynamicValue }));
        setInsuranceCompanyQuery(dynamicValue);

        // Reset form after a delay then close
        setTimeout(() => {
          handleAddNewCompanyReset();
          setIsAddCompanyModalOpen(false);
          setCreateCompanyMessage(null);
        }, 3000);
      } else {
        setCreateCompanyMessage({ type: 'error', text: data.error || "Failed to create company." });
      }
    } catch (err) {
      console.error('Failed to create company:', err);
      setCreateCompanyMessage({ type: 'error', text: "An error occurred. Please try again." });
    } finally {
      setIsCreatingCompany(false);
    }
  };

  const handleAddNewCompanyReset = () => {
    setNewCompanyData({ name: "", ccInvoicesTo: "", splitInvoice: false, invoiceEmail: "", priceList: "2025 Prices" });
    setHasSentCompany(false);
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
    
    // Auto-resize textarea for Adjuster Comments
    if (name === "adjusterComments") {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    }

    // Reset skip flags if name fields are modified
    if (name === "rooferName") setSkipRooferValidation(false);
    if (name === "publicAdjusterName") setSkipAdjusterValidation(false);

    setFormData((prev) => {
      let next = { ...prev, [name]: value };
      
      // Special routing for adjusterEmail -> adjusterEmails[0]
      if (name === "adjusterEmail") {
        const nextEmails = [...prev.adjusterEmails];
        if (nextEmails.length === 0) {
          nextEmails.push({ email: value, sendCopyOf: ["all", "report", "invoice", "notifications"] });
        } else {
          nextEmails[0] = { ...nextEmails[0], email: value };
        }
        next = { ...next, adjusterEmails: nextEmails };
      }

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

  /**
   * Blur handler for required fields.
   * Validates the field immediately when the user leaves it so that
   * inline error messages appear without waiting for the Next button.
   */
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const err = validateField(name, value, formData);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
  };

  /* Scroll to first invalid field helper.
   * Uses STEP_FIELD_ORDER to ensure the first *DOM-visible* required field
   * is focused, rather than relying on unordered JS object key iteration.
   */
  const scrollToFirstInvalidField = (
    errors: Record<string, string>,
    iaErrors: string[] = [],
    adjErrors: string[] = [],
    step?: number
  ) => {
    // Use priority-ordered list when available, else fall back to Object.keys
    const orderedKeys =
      step !== undefined && STEP_FIELD_ORDER[step]
        ? [
            ...STEP_FIELD_ORDER[step].filter((k) => errors[k]),
            ...Object.keys(errors).filter(
              (k) => !STEP_FIELD_ORDER[step].includes(k)
            ),
          ]
        : Object.keys(errors);

    // Focus first field with an error
    for (const fieldName of orderedKeys) {
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
          const emailInput = element.querySelector(
            'input[name^="iaRecipientEmail_"]'
          ) as HTMLInputElement;
          if (emailInput) emailInput.focus();
          return;
        }
      }
    }

    // Check for Adjuster email errors
    for (let index = 0; index < adjErrors.length; index++) {
      if (adjErrors[index]) {
        const element = document.getElementById(`adj-recipient-${index}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          const emailInput = element.querySelector(
            'input[name^="adjRecipientEmail_"]'
          ) as HTMLInputElement;
          if (emailInput) emailInput.focus();
          return;
        }
      }
    }
  };

  const handleNext = () => {
    // Step 0: Inspection & Property
    if (currentStep === 0) {
      if (!formData.inspectionType) {
        setShowErrors(true);
        const errorElement = document.querySelector("[data-field-name='inspectionType']");
        if (errorElement) errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setShowErrors(false);
      setCurrentStep(1);
      setMaxCompletedStep((prev) => Math.max(prev, 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Step 1: Insurance & Adjuster (merged validation)
    if (currentStep === 1) {
      const insuranceErrors = validateInsuranceStep(formData);
      const adjusterErrors = validateAdjusterStep(formData);
      const errors = { ...insuranceErrors, ...adjusterErrors };
      setFieldErrors(errors);
      setShowErrors(Object.keys(errors).length > 0);

      let hasStepErrors = Object.keys(errors).length > 0;

      // Validate Adjuster extra emails
      const { errors: adjErrs } = validateAdjusterEmails(formData.adjusterEmails);
      setAdjusterEmailErrors(adjErrs);
      // Secondary adjuster recipients start from index 1. Index 0 is the primary adjuster.
      const hasSecondaryAdjusterError = adjErrs.slice(1).some(e => e !== "");
      if (hasSecondaryAdjusterError) {
        const hasDuplicate = adjErrs.some(e => e === "Duplicate email.");
        setAdjusterSectionError(hasDuplicate ? "Duplicate email addresses found." : "Please fix the errors in the secondary adjuster recipients.");
        hasStepErrors = true;
      } else {
        setAdjusterSectionError("");
      }

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
            const hasDuplicate = iaErrs.some(e => e === "Duplicate email.");
            setIaSectionError(hasDuplicate ? "Duplicate email addresses found." : "Please fix the errors in the IA email recipients.");
            hasStepErrors = true;
          } else {
            setIaSectionError("");
          }
        }
      } else {
        setIaEmailErrors([]);
        setIaSectionError("");
      }

      if (hasStepErrors) {
        scrollToFirstInvalidField(
          errors,
          formData.isIAClaim ? formData.iaRecipients.map((_, i) => {
            const { errors: iaErrs } = validateIaRecipients(formData.iaRecipients);
            return iaErrs[i] || "";
          }) : [],
          formData.adjusterEmails.map((_, i) => {
            const { errors: aErrs } = validateAdjusterEmails(formData.adjusterEmails);
            return aErrs[i] || "";
          }),
          1 // step index for priority ordering
        );
        return;
      }
      setFieldErrors({});
    }

    // Step 2: Policy & Address (merged validation)
    if (currentStep === 2) {
      const policyErrors = validatePolicyholderStep(formData);
      const addressErrors = validateAddressStep(formData);
      const errors = { ...policyErrors, ...addressErrors };
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setShowErrors(true);
        scrollToFirstInvalidField(errors, [], [], 2);
        return;
      }
      setShowErrors(false);
      setFieldErrors({});
    }

    // Step 3: Roofer & Public Adjuster
    if (currentStep === 3) {
      try {
        const queue: ('roofer' | 'adjuster')[] = [];

        // Check Roofer FIRST (User preference)
        if (formData.rooferName.trim() && isPhoneEmpty(formData.rooferPhone) && !skipRooferValidation) {
          queue.push('roofer');
        }

        // Check or Next: Public Adjuster
        const missingPAFields: string[] = [];
        if (formData.publicAdjusterName.trim() && !skipAdjusterValidation) {
          if (!formData.publicAdjusterEmail.trim()) missingPAFields.push("publicAdjusterEmail");
          if (isPhoneEmpty(formData.publicAdjusterPhone)) missingPAFields.push("publicAdjusterPhone");
          if (missingPAFields.length > 0) {
            queue.push('adjuster');
          }
        }

        if (queue.length > 0) {
          console.info("[Step 3] Validation required. Queue initialized:", queue);
          
          // Set field errors immediately so they appear when the user is sent back
          const newErrors: Record<string, string> = { ...fieldErrors };
          queue.forEach(type => {
            if (type === 'roofer') {
              newErrors.rooferPhone = "Roofer phone is required for scheduling";
            } else if (type === 'adjuster') {
              if (!formData.publicAdjusterEmail.trim()) {
                newErrors.publicAdjusterEmail = "Public Adjuster email is required";
              }
              if (isPhoneEmpty(formData.publicAdjusterPhone)) {
                newErrors.publicAdjusterPhone = "Public Adjuster phone is required";
              }
            }
          });
          setFieldErrors(newErrors);
          setShowErrors(true);

          setValidationQueue(queue);
          setIsValidationModalOpen(true);
          return; // Stop here
        }

        // If no queue (bypass or already complete), perform final formatting check
        const rooferErrors = validateRooferStep(formData);
        const paErrors = validatePublicAdjusterStep(formData);
        const errors = { ...rooferErrors, ...paErrors };
        
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) {
          console.info("[Step 3] Formatting errors detected:", errors);
          scrollToFirstInvalidField(errors);
          return;
        }
        setFieldErrors({});
      } catch (err) {
        console.error("Error during Step 3 validation:", err);
      }
    }

    if (currentStep < WIZARD_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxCompletedStep((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setFieldErrors({});
    setShowErrors(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      // 1. Initial Step 1 Validation Check
      if (!formData.inspectionType) {
        setShowErrors(true);
        setSubmitError("Please select an Inspection Type before submitting.");
        const errorElement = document.querySelector("[data-field-name='inspectionType']");
        if (errorElement) errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // 2. Comprehensive Validation Check
      const combinedErrors = {
        ...validateInsuranceStep(formData),
        ...validateAdjusterStep(formData),
        ...validatePolicyholderStep(formData),
        ...validateAddressStep(formData),
        ...validateRooferStep(formData),
        ...validatePublicAdjusterStep(formData),
      };

      setFieldErrors(combinedErrors);
      let hasErrors = Object.keys(combinedErrors).length > 0;
      let iaErrs: string[] = [];
      let adjErrs: string[] = [];

      // Validate IA recipients
      if (formData.isIAClaim) {
        const recipients = formData.iaRecipients;
        if (!recipients || recipients.length === 0) {
          setIaSectionError("At least one IA email is required.");
          hasErrors = true;
        } else {
          const { errors: iaErrors, hasError } = validateIaRecipients(recipients);
          iaErrs = iaErrors;
          setIaEmailErrors(iaErrors);
          if (hasError) {
            const hasDuplicate = iaErrors.some(e => e === "Duplicate email.");
            setIaSectionError(hasDuplicate ? "Duplicate email addresses found." : "Please fix the errors in the IA email recipients.");
            hasErrors = true;
          }
        }
      }

      // Validate Adjuster extra emails
      const { errors: aErrors } = validateAdjusterEmails(formData.adjusterEmails);
      adjErrs = aErrors;
      setAdjusterEmailErrors(aErrors);
      // Secondary adjuster recipients start from index 1. Index 0 is the primary adjuster.
      const hasSecondaryAdjusterError = aErrors.slice(1).some(e => e !== "");
      if (hasSecondaryAdjusterError) {
        const hasDuplicate = aErrors.some(e => e === "Duplicate email.");
        setAdjusterSectionError(hasDuplicate ? "Duplicate email addresses found." : "Please fix the errors in the secondary adjuster recipients.");
        hasErrors = true;
      }

      // 3. Block and Scroll on Validation Error
      if (hasErrors) {
        setShowErrors(true);
        setSubmitError("Please fix the highlighted fields in the form to continue.");
        scrollToFirstInvalidField(combinedErrors, iaErrs, adjErrs);
        return;
      }

      // 4. Submission Payload Preparation
      const functionUrl = '/api/submit-inspection';
      let submissionData = { ...formData };

      // Format Date of Loss for Zoho Creator (MM/dd/yyyy)
      if (submissionData.dateOfLoss && submissionData.dateOfLoss.includes("-")) {
        try {
          const [y, m, d] = submissionData.dateOfLoss.split("-");
          if (y && m && d && y.length === 4) {
            submissionData.dateOfLoss = `${m.padStart(2, "0")}/${d.padStart(2, "0")}/${y}`;
          }
        } catch (e) {
          console.warn("[Submission Prep] Failed to reformat date:", e);
        }
      }

      console.group("Form Submission Triggered");
      console.log("Payload:", submissionData);
      console.groupEnd();

      // 5. API Submission
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submitInspection', data: submissionData })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "The server encountered an error while processing your request.");
      }

      console.info("Form submitted successfully");
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err: any) {
      console.error("Submission error catch block:", err);
      setSubmitError(err.message || "We encountered a problem submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
    setMaxCompletedStep(0);
    setIsSubmitted(false);
    // DISABLED: setShowPrimaryPhone2(false);
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

  const scrollToField = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  const labelFor = (id: string, list: { id: string; title: string }[]) =>
    list.find((i) => i.id === id)?.title ?? "—";

  /* Insurance search results come from API, not from a hardcoded list */
  const filteredInsuranceCompanies = insuranceSearchResults;

  /* Show "Add New Company" option when query doesn't exactly match an existing result */
  const canCreateInsuranceCompany = useMemo(() => {
    const trimmed = insuranceCompanyQuery.trim();
    if (!trimmed) return false;
    const normalized = trimmed.toLowerCase();
    return !insuranceSearchResults.some((c) => c.name.toLowerCase() === normalized);
  }, [insuranceCompanyQuery, insuranceSearchResults]);

  const commitInsuranceCompanyValue = (value: string) => {
    const trimmed = value.trim();
    const normalized = trimmed.toLowerCase();
    // Match against API search results instead of hardcoded list
    const match = insuranceSearchResults.find((c) => c.name.toLowerCase() === normalized);
    const next = match ? match.name : trimmed;
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

  /* ---- validation helpers ---- */

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
        return ""; // Optional field — no validation needed
      case "adjusterEmail": {
        const email = data.adjusterEmails[0]?.email || "";
        if (!email.trim()) return "Adjuster Email is required.";
        return isValidEmail(email) ? "" : "Enter a valid email address.";
      }
      case "adjusterFirstName":
        return v ? "" : "Adjuster First Name is required.";
      case "adjusterLastName":
        return v ? "" : "Adjuster Last Name is required.";
      case "secondEmailForReport":
        if (!v) return "";
        return isValidEmail(v) ? "" : "Enter a valid email address.";
      case "adjusterPhone":
        if (isPhoneEmpty(v)) {
          return "Adjuster Phone is required.";
        }
        if (!isValidPhoneNumber(v)) {
          return "Enter a valid phone number.";
        }
        return "";
      case "adjusterPhoneExt": {
        if (!v) return "";
        const digits = v.replace(/\D/g, "");
        if (!digits) return "Enter a valid extension.";
        return digits.length <= 6 ? "" : "Enter a valid extension.";
      }
      case "iaPhone":
        if (isPhoneEmpty(v)) {
          return "IA Phone Number is required.";
        }
        if (!isValidPhoneNumber(v)) {
          return "Enter a valid phone number.";
        }
        return "";
      case "iaFirstName":
        return v ? "" : "IA First Name is required.";
      case "iaLastName":
        return v ? "" : "IA Last Name is required.";
      case "iaCompany":
        return v ? "" : "IA Company Name is required.";
      case "policyholderFirstName":
        return v ? "" : "Policyholder First Name is required.";
      case "policyholderLastName":
        return v ? "" : "Policyholder Last Name is required.";
      case "policyholderPhone1":
        if (isPhoneEmpty(v)) {
          console.info("Phone validation skipped (empty field): policyholderPhone1");
          return "";
        }
        if (!isValidPhoneNumber(v)) {
          console.warn("Invalid phone number entered: policyholderPhone1");
          return "Enter a valid phone number.";
        }
        return "";
      case "policyholderPhone2":
        if (isPhoneEmpty(v)) {
          console.info("Phone field cleared, removing error: policyholderPhone2");
          return "";
        }
        if (!isValidPhoneNumber(v)) {
          console.warn("Invalid phone number entered: policyholderPhone2");
          return "Enter a valid phone number.";
        }
        return "";
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
        if (isPhoneEmpty(v)) {
          console.info("Phone field cleared, removing error: rooferPhone");
          return "";
        }
        if (!isValidPhoneNumber(v)) {
          console.warn("Invalid phone number entered: rooferPhone");
          return "Enter a valid phone number.";
        }
        return "";
      case "publicAdjusterPhone":
        if (isPhoneEmpty(v)) {
          console.info("Phone field cleared, removing error: publicAdjusterPhone");
          return "";
        }
        if (!isValidPhoneNumber(v)) {
          console.warn("Invalid phone number entered: publicAdjusterPhone");
          return "Enter a valid phone number.";
        }
        return "";
      case "publicAdjusterEmail":
        if (!v) return "";
        return isValidEmail(v) ? "" : "Enter a valid email address.";
      default:
        return "";
    }
  };

  const validateFields = (data: FormData, fields: (keyof FormData)[]) => {
    const errors: Record<string, string> = {};
    fields.forEach((f) => {
      const err = validateField(f as string, String(data[f] || ""), data);
      if (err) errors[f as string] = err;
    });
    return errors;
  };

  const validateInsuranceStep = (data: FormData) => {
    const fields: (keyof FormData)[] = ["claimNumber"];
    if (data.isIAClaim) {
      fields.push("iaCompany", "iaFirstName", "iaLastName", "iaPhone");
    }
    return validateFields(data, fields);
  };

  const validateAdjusterStep = (data: FormData) => {
    return validateFields(data, [
      "adjusterFirstName",
      "adjusterLastName",
      "adjusterEmail" as any,
      "secondEmailForReport",
      "adjusterPhone",
      "adjusterPhoneExt",
    ]);
  };

  const validatePolicyholderStep = (data: FormData) => {
    // Only validate backend-required fields: firstName + lastName.
    // Phone fields are optional (format-checked only when filled) and
    // are NOT in the backend required list — they must NOT block navigation.
    return validateFields(data, [
      "policyholderFirstName",
      "policyholderLastName",
    ]);
  };

  const validateAddressStep = (data: FormData) => {
    return validateFields(data, ["streetAddress", "city", "state", "zip"]);
  };

  const validateRooferStep = (data: FormData) => {
    const errors: Record<string, string> = {};
    if (skipRooferValidation) return errors;

    // Validate Roofer Phone — only if name is entered OR if number is entered
    const isNameEntered = !!data.rooferName.trim();
    const isPhoneEntered = !isPhoneEmpty(data.rooferPhone);

    if (isNameEntered && !isPhoneEntered) {
      errors.rooferPhone = "Roofer Phone is required.";
    } else if (isPhoneEntered) {
      const err = validateField("rooferPhone", data.rooferPhone, data);
      if (err) errors.rooferPhone = err;
    }
    
    return errors;
  };

  const validatePublicAdjusterStep = (data: FormData) => {
    const errors: Record<string, string> = {};
    if (skipAdjusterValidation) return errors;
    
    const isNameEntered = !!data.publicAdjusterName.trim();
    const isPhoneEntered = !isPhoneEmpty(data.publicAdjusterPhone);
    const isEmailEntered = !!data.publicAdjusterEmail.trim();

    if (isNameEntered) {
      if (!isPhoneEntered) errors.publicAdjusterPhone = "Public Adjuster Phone is required.";
      if (!isEmailEntered) errors.publicAdjusterEmail = "Public Adjuster Email is required.";
    }

    if (isPhoneEntered) {
      const phoneErr = validateField(
        "publicAdjusterPhone",
        data.publicAdjusterPhone,
        data
      );
      if (phoneErr) errors.publicAdjusterPhone = phoneErr;
    }

    if (isEmailEntered) {
      const emailErr = validateField(
        "publicAdjusterEmail",
        data.publicAdjusterEmail,
        data
      );
      if (emailErr) errors.publicAdjusterEmail = emailErr;
    }

    return errors;
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
      {/* ── Navbar ── */}
      <div className="z-50">
        <Navbar />
      </div>

      <main className="pt-16 pb-8">
        <div className={`${isSubmitted ? "max-w-xl" : "max-w-5xl"} mx-auto px-6`}>

          {/* ── Sticky Wrapper to prevent scrolling content from showing through the gap ── */}
          <div className="sticky top-16 z-40 bg-gray-50 dark:bg-background-dark pt-2 pb-4 mb-2 -mx-6 px-6">
            <div className={`bg-white dark:bg-section-dark px-1 py-0 shadow-md rounded-full border border-gray-200 dark:border-gray-800 flex flex-col justify-center ${isSubmitted ? "max-w-xl" : "max-w-5xl"} mx-auto w-full`}>
              <div className="text-center mb-0.5 flex justify-center items-center gap-2">
                {(() => {
                  const Icon = WIZARD_STEPS[currentStep]?.icon;
                  return !isSubmitted && Icon ? <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-accent" /> : null;
                })()}
                <h1 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-0">
                  {isSubmitted ? "Submission Successful" : WIZARD_STEPS[currentStep].title}
                </h1>
              </div>

              {/* ── Progress Bar ── */}
              {!isSubmitted && (
                <StepProgressBar
                  steps={WIZARD_STEPS}
                  currentStep={currentStep}
                  onStepClick={(s) => {
                    if (s <= maxCompletedStep) goToStep(s);
                  }}
                />
              )}
            </div>
          </div>

          {/* ── Form Card ── */}
          <div className={`bg-white dark:bg-section-dark rounded-xl border border-gray-200 dark:border-gray-800 ${isSubmitted ? "p-0" : "p-3"} shadow-md overflow-hidden`}>
            {isSubmitted ? (
              <SuccessMessage onReset={handleReset} />
            ) : (
              <>
                {/* =========================================== */}
                {/*  STEP 0 – Inspection & Property (merged)   */}
                {/* =========================================== */}
                {currentStep === 0 && (
                  <FormSection>
                    {(() => {
                      const showBuildingType = !!formData.inspectionType && !["Component Failure", "Residential Storm Damage", "Structural Loss", "Large / Complex Loss", "Interior Water Loss"].includes(formData.inspectionType);
                      return (
                        <div className={`grid grid-cols-1 gap-4 items-start animate-fadeIn ${showBuildingType ? "md:grid-cols-4" : ""}`}>
                          {/* Left: Inspection Type */}
                          <div className={`space-y-2.5 ${showBuildingType ? "md:col-span-3" : "md:col-span-4"}`}>
                            <SectionHeader title="Inspection Type" icon={ClipboardList} required />
                            <div
                              data-error-type="step1"
                              data-field-name="inspectionType"
                              className={`grid gap-2 p-2 rounded-xl transition-all grid-cols-2 ${showBuildingType ? "sm:grid-cols-3" : "sm:grid-cols-4"} ${showErrors && !formData.inspectionType
                                ? "bg-gray-100/50 dark:bg-gray-800/10 ring-1 ring-gray-300"
                                : "bg-gray-50/30 dark:bg-white/5"
                                }`}
                            >
                              {INSPECTION_TYPES.map((t) => (
                                <SelectCard
                                  key={t.id}
                                  label={t.title}
                                  value={t.id}
                                  image={t.image}
                                  selected={formData.inspectionType === t.title}
                                  dimmed={!!formData.inspectionType && formData.inspectionType !== t.title}
                                  onSelect={() => {
                                    setFormData({
                                      ...formData,
                                      inspectionType: t.title,
                                      buildingType: t.id === "component-failure" ? "" : formData.buildingType,
                                    });
                                    setShowErrors(false);
                                  }}
                                />
                              ))}
                            </div>
                            {showErrors && !formData.inspectionType && (
                              <p className="text-gray-900 text-sm font-black mt-2 flex items-center gap-2 animate-bounce">
                                <BadgeAlert className="w-4 h-4 text-gray-600" />
                                Please select an inspection type to continue.
                              </p>
                            )}
                          </div>

                          {/* Right: Building Type — only shown if required */}
                          {showBuildingType && (
                            <div className="space-y-2.5 md:col-span-1 animate-fadeIn">
                              <SectionHeader title="Building Type" icon={Building2} />
                              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 p-2 rounded-xl bg-gray-50/30 dark:bg-white/5">
                                {BUILDING_TYPES.map((b) => (
                                  <SelectCard
                                    key={b.id}
                                    label={b.title}
                                    value={b.id}
                                    image={b.image}
                                    selected={formData.buildingType === b.title}
                                    dimmed={!!formData.buildingType && formData.buildingType !== b.title}
                                    onSelect={() => {
                                      setFormData({ ...formData, buildingType: b.title });
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </FormSection>
                )}

                {/* ================================================ */}
                {/*  STEP 1 – Insurance & Adjuster (merged)        */}
                {/* ================================================ */}
                {currentStep === 1 && (
                  <FormSection>
                    <div className="space-y-3 animate-fadeIn">
                      {/* IA Toggle — at the top */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <CheckboxToggle
                          label="This claim is being submitted by an IA"
                          checked={formData.isIAClaim}
                          onChange={(checked) => {
                            setFormData((prev) => ({
                              ...prev,
                              isIAClaim: checked,
                              ...(checked
                                ? {
                                  iaRecipients:
                                    prev.iaRecipients.length === 0
                                      ? [{ email: "", notificationType: ["all"] }]
                                      : prev.iaRecipients,
                                }
                                : {
                                  iaFirstName: "",
                                  iaLastName: "",
                                  iaPhone: "",
                                  iaCompany: "",
                                  iaRecipients: [],
                                }),
                            }));
                            if (!checked) {
                              setIaEmailErrors([]);
                              setIaSectionError("");
                            }
                          }}
                        />
                      </div>

                      {/* Conditional Layout based on IA toggle */}
                      {formData.isIAClaim ? (
                        <div className="space-y-3">
                          {/* ROW 1: IA Information (Left) | Adjuster Details (Right) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* LEFT COLUMN — IA Information */}
                            <div className="bg-primary/5 dark:bg-accent/5 rounded-lg p-2 border border-primary/20 dark:border-accent/20 space-y-3">
                              <SectionHeader title="IA Information" />

                              {/* Row 1: IA Company Name (full width) */}
                              <div className="grid grid-cols-1">
                                <InputField
                                  label="IA Company Name"
                                  name="iaCompany"
                                  value={formData.iaCompany}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Company Name"
                                  icon={Building2}
                                  required
                                  invalid={!!fieldErrors.iaCompany}
                                  error={fieldErrors.iaCompany}
                                />
                              </div>

                              {/* Row 2: IA First Name (left) + IA Last Name (right) */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InputField
                                  label="IA First Name"
                                  name="iaFirstName"
                                  value={formData.iaFirstName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="First Name"
                                  icon={UserRound}
                                  required
                                  invalid={!!fieldErrors.iaFirstName}
                                  error={fieldErrors.iaFirstName}
                                />
                                <InputField
                                  label="IA Last Name"
                                  name="iaLastName"
                                  value={formData.iaLastName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="Last Name"
                                  icon={UserRound}
                                  required
                                  invalid={!!fieldErrors.iaLastName}
                                  error={fieldErrors.iaLastName}
                                />
                              </div>

                              {/* Row 3: IA Phone Number (full width) */}
                              <div className="grid grid-cols-1">
                                <PhoneInputField
                                  label="IA Phone Number"
                                  name="iaPhone"
                                  value={formData.iaPhone}
                                  onChange={handleChange}
                                  invalid={!!fieldErrors.iaPhone}
                                  error={fieldErrors.iaPhone}
                                />
                              </div>

                              {/* Row 4: Primary IA Email (full width) */}
                              <div className="space-y-2 pt-2 border-t border-primary/10 dark:border-accent/10">
                                <SectionHeader title="Primary IA Email" />
                                <div className="space-y-2">
                                  {formData.iaRecipients.map((recipient, index) => (
                                    <div key={index} id={`ia-recipient-${index}`} className={`rounded-lg border p-1.5 bg-gray-50 dark:bg-background-dark/60 ${iaEmailErrors[index] ? "border-gray-400 bg-gray-100/60 dark:bg-gray-800/20" : "border-gray-200 dark:border-gray-700"}`}>
                                      <div className="space-y-2">
                                        <InputField label={`IA Email ${formData.iaRecipients.length > 1 ? `#${index + 1}` : ""}`} name={`iaRecipientEmail_${index}`} value={recipient.email} onChange={(e) => {
                                          const nextRecipients = formData.iaRecipients.map((r, i) => i === index ? { ...r, email: e.target.value } : r);
                                          setFormData({ ...formData, iaRecipients: nextRecipients });
                                          const { errors } = validateIaRecipients(nextRecipients);
                                          setIaEmailErrors(errors);
                                          setIaSectionError("");
                                        }} type="email" placeholder="ia@company.com" icon={Mail} />

                                        {/* Send copy of — multi-select checkboxes */}
                                        <div>
                                          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                          <div className="flex flex-wrap gap-2">
                                            {SEND_COPY_OPTIONS.map((opt) => {
                                              const checked = recipient.notificationType.includes(opt);
                                              return (
                                                <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                                  <input type="checkbox" checked={checked} onChange={() => {
                                                    let next: string[];
                                                    if (opt === "all") {
                                                      next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                                    } else {
                                                      if (checked) {
                                                        next = recipient.notificationType.filter((o) => o !== opt && o !== "all");
                                                      } else {
                                                        next = [...recipient.notificationType.filter((o) => o !== "all"), opt];
                                                        if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                          next = ["all", ...next];
                                                        }
                                                      }
                                                    }
                                                    const nextRecipients = formData.iaRecipients.map((r, i) => i === index ? { ...r, notificationType: next } : r);
                                                    setFormData({ ...formData, iaRecipients: nextRecipients });
                                                  }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                                  <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                                </label>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        {formData.iaRecipients.length > 1 && (
                                          <button type="button" onClick={() => {
                                            const nextRecipients = formData.iaRecipients.filter((_, i) => i !== index);
                                            setFormData({ ...formData, iaRecipients: nextRecipients });
                                            const { errors } = validateIaRecipients(nextRecipients);
                                            setIaEmailErrors(errors);
                                          }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <X className="w-3 h-3" />
                                            Remove
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (formData.iaRecipients.length >= MAX_IA_EMAILS) return;
                                        const nextRecipients: IaRecipient[] = [...formData.iaRecipients, { email: "", notificationType: ["all"] }];
                                        setFormData({ ...formData, iaRecipients: nextRecipients });
                                        const { errors } = validateIaRecipients(nextRecipients);
                                        setIaEmailErrors(errors);
                                        setIaSectionError("");
                                        const index = nextRecipients.length - 1;
                                        setTimeout(() => { const el = document.getElementById(`ia-recipient-${index}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0);
                                      }}
                                      disabled={formData.iaRecipients.length >= MAX_IA_EMAILS}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      Add another email
                                    </button>
                                  </div>
                                  {iaSectionError && (<p className="text-xs text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-300/50 mt-1 inline-block">{iaSectionError}</p>)}
                                  {formData.iaRecipients.length >= MAX_IA_EMAILS && (<p className="text-[11px] text-gray-500 dark:text-gray-400">Maximum of {MAX_IA_EMAILS} IA email recipients reached.</p>)}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT COLUMN — Insurance & Adjuster */}
                            <div className="space-y-3">
                              {/* Insurance Carrier */}
                              <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                                <SectionHeader title="Insurance Carrier" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* Insurance Company Search */}
                                  <div className="space-y-0.5 relative">
                                    <label htmlFor="insuranceCompany" className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                      <Building2 className="text-primary dark:text-accent w-3 h-3" />
                                      Insurance Company <span className="text-gray-400 font-normal"></span>
                                    </label>
                                    <div className="relative">
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
                                            const err = validateField("insuranceCompany", next, { ...formData, insuranceCompany: next });
                                            if (err) nextErrors.insuranceCompany = err;
                                            else delete nextErrors.insuranceCompany;
                                            return nextErrors;
                                          });
                                          setInsuranceCompanyOpen(true);
                                          searchInsuranceCompanies(next);
                                        }}
                                        onFocus={() => {
                                          setInsuranceCompanyOpen(true);
                                          searchInsuranceCompanies(insuranceCompanyQuery || "");
                                        }}
                                        onBlur={() => {
                                          setTimeout(() => setInsuranceCompanyOpen(false), 200);
                                          commitInsuranceCompanyValue(insuranceCompanyQuery);
                                        }}
                                        placeholder="Search or type a company..."
                                        className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${fieldErrors.insuranceCompany
                                          ? "border-gray-300 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
                                          : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
                                          }`}
                                      />
                                      {insuranceSearchLoading && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                          <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    {fieldErrors.insuranceCompany && (
                                      <p className="text-[10px] text-gray-900 font-black -mt-0.5">{fieldErrors.insuranceCompany}</p>
                                    )}
                                    {insuranceCompanyOpen && (
                                      <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-section-dark shadow-lg">
                                        {/* Alias Suggestion Banner */}
                                        {aliasMatch && !aliasDismissed && (
                                          <div className="p-2 border-b border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/40">
                                            <div className="flex items-start gap-2">
                                              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                              <div className="flex-1">
                                                <p className="text-[11px] text-orange-800 dark:text-orange-200 font-bold leading-tight">
                                                  Did you mean: <span className="underline italic">{aliasMatch.results[0].name}</span>?
                                                </p>
                                                <div className="flex gap-2 mt-1.5">
                                                  <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => {
                                                      commitInsuranceCompanyValue(aliasMatch.results[0].name);
                                                      setAliasMatch(null);
                                                      setInsuranceCompanyOpen(false);
                                                    }}
                                                    className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded hover:bg-orange-700 transition-colors"
                                                  >
                                                    Use Suggestion
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => setAliasDismissed(true)}
                                                    className="px-2 py-0.5 border border-orange-300 text-orange-700 text-[10px] font-bold rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                                                  >
                                                    Dismiss
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setInsuranceCompanyOpen(false); setIsAddCompanyModalOpen(true); }} className="w-full text-left px-3 py-2 text-[11px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                          Add New Company
                                          <Building2 className="w-3.5 h-3.5" />
                                        </button>

                                        {insuranceSearchLoading && insuranceSearchResults.length === 0 ? (
                                          <div className="p-4 flex flex-col items-center justify-center gap-2 text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <p className="text-[10px]">Searching...</p>
                                          </div>
                                        ) : filteredInsuranceCompanies.length > 0 ? (
                                          filteredInsuranceCompanies.map((c) => (
                                            <button key={c.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { commitInsuranceCompanyValue(c.name); setInsuranceCompanyOpen(false); }} className={`w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${formData.insuranceCompany === c.name ? "font-bold text-primary dark:text-accent" : "text-gray-700 dark:text-gray-200"}`}>
                                              {c.name}
                                            </button>
                                          ))
                                        ) : insuranceCompanyQuery && !insuranceSearchLoading && (
                                          <div className="p-3 text-center text-gray-500 text-[10px]">
                                            No matches found.
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <InputField label="Claim Number" name="claimNumber" value={formData.claimNumber} onChange={handleChange} onBlur={handleBlur} placeholder="CLM-123456" required icon={Tag} invalid={!!fieldErrors.claimNumber} error={fieldErrors.claimNumber} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                  <InputField label="Policy Number" name="policyNumber" value={formData.policyNumber} onChange={handleChange} placeholder="POL-789012" icon={Hash} invalid={!!fieldErrors.policyNumber} error={fieldErrors.policyNumber} />
                                  <InputField
                                    label="Date of Loss"
                                    name="dateOfLoss"
                                    type="date"
                                    value={formData.dateOfLoss}
                                    onChange={handleChange}
                                    icon={Calendar}
                                    invalid={!!fieldErrors.dateOfLoss}
                                    error={fieldErrors.dateOfLoss}
                                  />
                                </div>
                              </div>
                              {/* Adjuster Details */}
                              <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                                <SectionHeader title={formData.isIAClaim ? "Carrier Adjuster Details" : "Adjuster Details"} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <InputField label="Adjuster Company Name" name="adjusterCompany" value={formData.adjusterCompany} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <InputField label="First Name" name="adjusterFirstName" value={formData.adjusterFirstName} onChange={handleChange} onBlur={handleBlur} placeholder="First Name" required icon={UserRound} invalid={!!fieldErrors.adjusterFirstName} error={fieldErrors.adjusterFirstName} />
                                  <InputField label="Last Name" name="adjusterLastName" value={formData.adjusterLastName} onChange={handleChange} onBlur={handleBlur} placeholder="Last Name" required icon={UserRound} invalid={!!fieldErrors.adjusterLastName} error={fieldErrors.adjusterLastName} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <PhoneInputField label="Adjuster Phone" name="adjusterPhone" value={formData.adjusterPhone} onChange={handleChange} onBlur={handleBlur} required invalid={!!fieldErrors.adjusterPhone} error={fieldErrors.adjusterPhone} />
                                  <InputField label="Phone Extension" name="adjusterPhoneExt" value={formData.adjusterPhoneExt} onChange={handleChange} placeholder="Ext. 123" icon={Hash} invalid={!!fieldErrors.adjusterPhoneExt} error={fieldErrors.adjusterPhoneExt} />
                                </div>
                                <div className="grid grid-cols-1">
                                  <InputField label="Adjuster Email" name="adjusterEmail" value={formData.adjusterEmails[0]?.email || ""} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="adjuster@insurance.com" required icon={Mail} invalid={!!fieldErrors.adjusterEmail} error={fieldErrors.adjusterEmail} />
                                </div>
                                
                                {/* Send copy of for primary Adjuster */}
                                <div className="mt-1 ml-1">
                                  <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                  <div className="flex flex-wrap gap-2">
                                    {SEND_COPY_OPTIONS.map((opt) => {
                                      const checked = formData.adjusterEmails[0]?.sendCopyOf.includes(opt);
                                      return (
                                        <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                          <input type="checkbox" checked={checked} onChange={() => {
                                            let next: string[];
                                            if (opt === "all") {
                                              next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                            } else {
                                              if (checked) {
                                                next = formData.adjusterEmails[0].sendCopyOf.filter((o) => o !== opt && o !== "all");
                                              } else {
                                                next = [...formData.adjusterEmails[0].sendCopyOf.filter((o) => o !== "all"), opt];
                                                if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                  next = ["all", ...next];
                                                }
                                              }
                                            }
                                            const nextEmails = [...formData.adjusterEmails];
                                            nextEmails[0] = { ...nextEmails[0], sendCopyOf: next };
                                            setFormData({ ...formData, adjusterEmails: nextEmails });
                                          }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                          <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                {/* Additional Adjuster Emails */}
                                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
                                  <div className="space-y-2">
                                    {formData.adjusterEmails.slice(1).map((recipient, idx) => {
                                      const index = idx + 1;
                                      return (
                                        <div key={index} id={`adj-recipient-${index}`} className={`rounded-lg border p-1.5 bg-gray-50 dark:bg-background-dark/60 ${adjusterEmailErrors[index] ? "border-gray-400 bg-gray-100/60 dark:bg-gray-800/20" : "border-gray-200 dark:border-gray-700"}`}>
                                          <div className="space-y-2">
                                            <InputField label={`Additional Adjuster Email ${formData.adjusterEmails.length > 1 ? `#${index}` : ""}`} name={`adjRecipientEmail_${index}`} value={recipient.email} onChange={(e) => {
                                              const nextRecipients = formData.adjusterEmails.map((r, i) => i === index ? { ...r, email: e.target.value } : r);
                                              setFormData({ ...formData, adjusterEmails: nextRecipients });
                                              const { errors } = validateAdjusterEmails(nextRecipients);
                                              setAdjusterEmailErrors(errors);
                                              setAdjusterSectionError("");
                                            }} type="email" placeholder="additional@company.com" icon={Mail} />

                                            {/* Send copy of — multi-select checkboxes */}
                                            <div>
                                              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                              <div className="flex flex-wrap gap-2">
                                                {SEND_COPY_OPTIONS.map((opt) => {
                                                  const checked = recipient.sendCopyOf.includes(opt);
                                                  return (
                                                    <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                                      <input type="checkbox" checked={checked} onChange={() => {
                                                        let next: string[];
                                                        if (opt === "all") {
                                                          next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                                        } else {
                                                          if (checked) {
                                                            next = recipient.sendCopyOf.filter((o) => o !== opt && o !== "all");
                                                          } else {
                                                            next = [...recipient.sendCopyOf.filter((o) => o !== "all"), opt];
                                                            if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                              next = ["all", ...next];
                                                            }
                                                          }
                                                        }
                                                        const nextRecipients = formData.adjusterEmails.map((r, i) => i === index ? { ...r, sendCopyOf: next } : r);
                                                        setFormData({ ...formData, adjusterEmails: nextRecipients });
                                                      }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                                      <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                                    </label>
                                                  );
                                                })}
                                              </div>
                                            </div>

                                            <button type="button" onClick={() => {
                                              const nextRecipients = formData.adjusterEmails.filter((_, i) => i !== index);
                                              setFormData({ ...formData, adjusterEmails: nextRecipients });
                                              const { errors } = validateAdjusterEmails(nextRecipients);
                                              setAdjusterEmailErrors(errors);
                                            }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                              <X className="w-3 h-3" />
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (formData.adjusterEmails.length >= MAX_ADJ_EMAILS) return;
                                          const nextRecipients: AdjusterEmail[] = [...formData.adjusterEmails, { email: "", sendCopyOf: ["all", "report", "invoice", "notifications"] }];
                                          setFormData({ ...formData, adjusterEmails: nextRecipients });
                                          const { errors } = validateAdjusterEmails(nextRecipients);
                                          setAdjusterEmailErrors(errors);
                                          setAdjusterSectionError("");
                                          const index = nextRecipients.length - 1;
                                          setTimeout(() => { const el = document.getElementById(`adj-recipient-${index}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
                                        }}
                                        disabled={formData.adjusterEmails.length >= MAX_ADJ_EMAILS}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Another Email
                                      </button>
                                    </div>
                                    {adjusterSectionError && (<p className="text-xs text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-300/50 mt-1 inline-block">{adjusterSectionError}</p>)}
                                    {formData.adjusterEmails.length >= MAX_ADJ_EMAILS && (<p className="text-[11px] text-gray-500 dark:text-gray-400">Maximum of {MAX_ADJ_EMAILS} additional emails reached.</p>)}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label htmlFor="adjusterComments" className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                    <MessageSquare className="text-primary dark:text-accent w-3.5 h-3.5" />
                                    Adjuster&apos;s Comments
                                  </label>
                                  <textarea 
                                    id="adjusterComments" 
                                    name="adjusterComments" 
                                    value={formData.adjusterComments} 
                                    onChange={handleChange} 
                                    rows={1} 
                                    placeholder="Any additional comments from the adjuster..." 
                                    className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none overflow-hidden transition-all min-h-[80px]" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (
                        /* IA UNCHECKED: ROW 1: [Insurance Carrier (Left) | Adjuster (Right)] */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* LEFT COLUMN — Insurance */}
                          <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                            <SectionHeader title="Insurance Carrier" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-0.5 relative">
                                <label htmlFor="insuranceCompany" className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                  <Building2 className="text-primary dark:text-accent w-3 h-3" />
                                  Insurance Company <span className="text-gray-400 font-normal"></span>
                                </label>
                                <div className="relative">
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
                                        const err = validateField("insuranceCompany", next, { ...formData, insuranceCompany: next });
                                        if (err) nextErrors.insuranceCompany = err;
                                        else delete nextErrors.insuranceCompany;
                                        return nextErrors;
                                      });
                                      setInsuranceCompanyOpen(true);
                                      searchInsuranceCompanies(next);
                                    }}
                                    onFocus={() => {
                                      setInsuranceCompanyOpen(true);
                                      searchInsuranceCompanies(insuranceCompanyQuery || "");
                                    }}
                                    onBlur={() => {
                                      setTimeout(() => setInsuranceCompanyOpen(false), 200);
                                      commitInsuranceCompanyValue(insuranceCompanyQuery);
                                    }}
                                    placeholder="Search or type a company..."
                                    className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${fieldErrors.insuranceCompany
                                    ? "border-gray-300 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
                                    : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
                                      }`}
                                  />
                                  {insuranceSearchLoading && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                {fieldErrors.insuranceCompany && (
                                  <p className="text-[10px] text-gray-900 font-black -mt-0.5">{fieldErrors.insuranceCompany}</p>
                                )}
                                {insuranceCompanyOpen && (
                                  <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-section-dark shadow-lg">
                                    {/* Alias Suggestion Banner */}
                                    {aliasMatch && !aliasDismissed && (
                                      <div className="p-2 border-b border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/40">
                                        <div className="flex items-start gap-2">
                                          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                          <div className="flex-1">
                                            <p className="text-[11px] text-orange-800 dark:text-orange-200 font-bold leading-tight">
                                              Did you mean: <span className="underline italic">{aliasMatch.results[0].name}</span>?
                                            </p>
                                            <div className="flex gap-2 mt-1.5">
                                              <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                  commitInsuranceCompanyValue(aliasMatch.results[0].name);
                                                  setAliasMatch(null);
                                                  setInsuranceCompanyOpen(false);
                                                }}
                                                className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded hover:bg-orange-700 transition-colors"
                                              >
                                                Use Suggestion
                                              </button>
                                              <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => setAliasDismissed(true)}
                                                className="px-2 py-0.5 border border-orange-300 text-orange-700 text-[10px] font-bold rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                                              >
                                                Dismiss
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setInsuranceCompanyOpen(false); setIsAddCompanyModalOpen(true); }} className="w-full text-left px-3 py-2 text-[11px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                      Add New Company
                                      <Building2 className="w-3.5 h-3.5" />
                                    </button>

                                    {insuranceSearchLoading && insuranceSearchResults.length === 0 ? (
                                      <div className="p-4 flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <p className="text-[10px]">Searching...</p>
                                      </div>
                                    ) : filteredInsuranceCompanies.length > 0 ? (
                                      filteredInsuranceCompanies.map((c) => (
                                        <button key={c.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { commitInsuranceCompanyValue(c.name); setInsuranceCompanyOpen(false); }} className={`w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${formData.insuranceCompany === c.name ? "font-bold text-primary dark:text-accent" : "text-gray-700 dark:text-gray-200"}`}>
                                          {c.name}
                                        </button>
                                      ))
                                    ) : insuranceCompanyQuery && !insuranceSearchLoading && (
                                      <div className="p-3 text-center text-gray-500 text-[10px]">
                                            No matches found.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <InputField label="Claim Number" name="claimNumber" value={formData.claimNumber} onChange={handleChange} onBlur={handleBlur} placeholder="CLM-123456" required icon={Tag} invalid={!!fieldErrors.claimNumber} error={fieldErrors.claimNumber} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <InputField label="Policy Number" name="policyNumber" value={formData.policyNumber} onChange={handleChange} placeholder="POL-789012" icon={Hash} invalid={!!fieldErrors.policyNumber} error={fieldErrors.policyNumber} />
                              <div className="space-y-0.5">
                                <InputField
                                  label="Date of Loss"
                                  name="dateOfLoss"
                                  type="date"
                                  value={formData.dateOfLoss}
                                  onChange={handleChange}
                                  icon={Calendar}
                                  invalid={!!fieldErrors.dateOfLoss}
                                  error={fieldErrors.dateOfLoss}
                                />
                              </div>
                            </div>
                          </div>

                          {/* RIGHT COLUMN — Adjuster */}
                          <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                            <SectionHeader title={formData.isIAClaim ? "Carrier Adjuster Details" : "Adjuster Details"} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <InputField label="Adjuster Company Name" name="adjusterCompany" value={formData.adjusterCompany} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <InputField label="First Name" name="adjusterFirstName" value={formData.adjusterFirstName} onChange={handleChange} onBlur={handleBlur} placeholder="First Name" required icon={UserRound} invalid={!!fieldErrors.adjusterFirstName} error={fieldErrors.adjusterFirstName} />
                              <InputField label="Last Name" name="adjusterLastName" value={formData.adjusterLastName} onChange={handleChange} onBlur={handleBlur} placeholder="Last Name" required icon={UserRound} invalid={!!fieldErrors.adjusterLastName} error={fieldErrors.adjusterLastName} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <PhoneInputField label="Adjuster Phone" name="adjusterPhone" value={formData.adjusterPhone} onChange={handleChange} onBlur={handleBlur} required invalid={!!fieldErrors.adjusterPhone} error={fieldErrors.adjusterPhone} />
                              <InputField label="Phone Extension" name="adjusterPhoneExt" value={formData.adjusterPhoneExt} onChange={handleChange} placeholder="Ext. 123" icon={Hash} invalid={!!fieldErrors.adjusterPhoneExt} error={fieldErrors.adjusterPhoneExt} />
                            </div>
                            <div className="grid grid-cols-1">
                              <InputField label="Adjuster Email" name="adjusterEmail" value={formData.adjusterEmails[0]?.email || ""} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="adjuster@insurance.com" required icon={Mail} invalid={!!fieldErrors.adjusterEmail} error={fieldErrors.adjusterEmail} />
                            </div>
                            
                            {/* Send copy of for primary Adjuster */}
                            <div className="mt-1 ml-1">
                              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                              <div className="flex flex-wrap gap-2">
                                {SEND_COPY_OPTIONS.map((opt) => {
                                  const checked = formData.adjusterEmails[0]?.sendCopyOf.includes(opt);
                                  return (
                                    <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                      <input type="checkbox" checked={checked} onChange={() => {
                                        let next: string[];
                                        if (opt === "all") {
                                          next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                        } else {
                                          if (checked) {
                                            next = formData.adjusterEmails[0].sendCopyOf.filter((o) => o !== opt && o !== "all");
                                          } else {
                                            next = [...formData.adjusterEmails[0].sendCopyOf.filter((o) => o !== "all"), opt];
                                            if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                              next = ["all", ...next];
                                            }
                                          }
                                        }
                                        const nextEmails = [...formData.adjusterEmails];
                                        nextEmails[0] = { ...nextEmails[0], sendCopyOf: next };
                                        setFormData({ ...formData, adjusterEmails: nextEmails });
                                      }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                      <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Additional Adjuster Emails */}
                                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
                                  <div className="space-y-2">
                                    {formData.adjusterEmails.slice(1).map((recipient, idx) => {
                                      const index = idx + 1;
                                      return (
                                        <div key={index} id={`adj-recipient-${index}`} className={`rounded-lg border p-1.5 bg-gray-50 dark:bg-background-dark/60 ${adjusterEmailErrors[index] ? "border-gray-400 bg-gray-100/60 dark:bg-gray-800/20" : "border-gray-200 dark:border-gray-700"}`}>
                                          <div className="space-y-2">
                                            <InputField label={`Additional Adjuster Email ${formData.adjusterEmails.length > 1 ? `#${index}` : ""}`} name={`adjRecipientEmail_${index}`} value={recipient.email} onChange={(e) => {
                                              const nextRecipients = formData.adjusterEmails.map((r, i) => i === index ? { ...r, email: e.target.value } : r);
                                              setFormData({ ...formData, adjusterEmails: nextRecipients });
                                              const { errors } = validateAdjusterEmails(nextRecipients);
                                              setAdjusterEmailErrors(errors);
                                              setAdjusterSectionError("");
                                            }} type="email" placeholder="additional@company.com" icon={Mail} />

                                            {/* Send copy of — multi-select checkboxes */}
                                            <div>
                                              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                              <div className="flex flex-wrap gap-2">
                                                {SEND_COPY_OPTIONS.map((opt) => {
                                                  const checked = recipient.sendCopyOf.includes(opt);
                                                  return (
                                                    <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                                      <input type="checkbox" checked={checked} onChange={() => {
                                                        let next: string[];
                                                        if (opt === "all") {
                                                          next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                                        } else {
                                                          if (checked) {
                                                            next = recipient.sendCopyOf.filter((o) => o !== opt && o !== "all");
                                                          } else {
                                                            next = [...recipient.sendCopyOf.filter((o) => o !== "all"), opt];
                                                            if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                              next = ["all", ...next];
                                                            }
                                                          }
                                                        }
                                                        const nextRecipients = formData.adjusterEmails.map((r, i) => i === index ? { ...r, sendCopyOf: next } : r);
                                                        setFormData({ ...formData, adjusterEmails: nextRecipients });
                                                      }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                                      <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                                    </label>
                                                  );
                                                })}
                                              </div>
                                            </div>

                                            <button type="button" onClick={() => {
                                              const nextRecipients = formData.adjusterEmails.filter((_, i) => i !== index);
                                              setFormData({ ...formData, adjusterEmails: nextRecipients });
                                              const { errors } = validateAdjusterEmails(nextRecipients);
                                              setAdjusterEmailErrors(errors);
                                            }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                              <X className="w-3 h-3" />
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (formData.adjusterEmails.length >= MAX_ADJ_EMAILS) return;
                                          const nextRecipients: AdjusterEmail[] = [...formData.adjusterEmails, { email: "", sendCopyOf: ["all", "report", "invoice", "notifications"] }];
                                          setFormData({ ...formData, adjusterEmails: nextRecipients });
                                          const { errors } = validateAdjusterEmails(nextRecipients);
                                          setAdjusterEmailErrors(errors);
                                          setAdjusterSectionError("");
                                          const index = nextRecipients.length - 1;
                                          setTimeout(() => { const el = document.getElementById(`adj-recipient-${index}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
                                        }}
                                        disabled={formData.adjusterEmails.length >= MAX_ADJ_EMAILS}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Another Email
                                      </button>
                                    </div>
                                    {adjusterSectionError && (<p className="text-xs text-gray-900 font-black bg-red-50/50 backdrop-blur-sm px-2 py-1 rounded-md border border-red-200/30 mt-1 inline-block">{adjusterSectionError}</p>)}
                                    {formData.adjusterEmails.length >= MAX_ADJ_EMAILS && (<p className="text-[11px] text-gray-500 dark:text-gray-400">Maximum of {MAX_ADJ_EMAILS} additional emails reached.</p>)}
                                  </div>
                                </div>
                            <div className="space-y-1">
                              <label htmlFor="adjusterComments" className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                <MessageSquare className="text-primary dark:text-accent w-3.5 h-3.5" />
                                Adjuster&apos;s Comments
                              </label>
                              <textarea 
                                id="adjusterComments" 
                                name="adjusterComments" 
                                value={formData.adjusterComments} 
                                onChange={handleChange} 
                                rows={1} 
                                placeholder="Any additional comments from the adjuster..." 
                                className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none overflow-hidden transition-all min-h-[80px]" 
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormSection>
                )}

                {/* ================================================ */}
                {/*  STEP 2 – Policy & Address (merged)              */}
                {/* ================================================ */}
                {currentStep === 2 && (
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                      {/* LEFT — Property Contact (Policyholder) */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                        <SectionHeader title="Property Contact (Policyholder)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField label="First Name" name="policyholderFirstName" value={formData.policyholderFirstName} onChange={handleChange} onBlur={handleBlur} placeholder="First Name" required icon={UserRound} invalid={!!fieldErrors.policyholderFirstName} error={fieldErrors.policyholderFirstName} />
                          <InputField label="Last Name" name="policyholderLastName" value={formData.policyholderLastName} onChange={handleChange} onBlur={handleBlur} placeholder="Last Name" required icon={UserRound} invalid={!!fieldErrors.policyholderLastName} error={fieldErrors.policyholderLastName} />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InputField label="Property Contact Email" name="propertyContactEmail" value={formData.propertyContactEmail} onChange={handleChange} type="email" placeholder="contact@email.com" icon={Mail} />
                            <div className="space-y-1">
                              <PhoneInputField label="Primary Phone" name="policyholderPhone1" value={formData.policyholderPhone1} onChange={handleChange} invalid={!!fieldErrors.policyholderPhone1} error={fieldErrors.policyholderPhone1} />
                            </div>
                          </div>
                          
                          {/* DISABLED: Add Another Phone + secondary phone input — uncomment to restore
                          {(showPrimaryPhone2 || formData.policyholderPhone1Extra) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-1 duration-200">
                              <div className="space-y-1 relative group">
                                <PhoneInputField label="Primary Phone 2" name="policyholderPhone1Extra" value={formData.policyholderPhone1Extra} onChange={handleChange} placeholder="Additional Phone" />
                                <button type="button" onClick={() => { setFormData({ ...formData, policyholderPhone1Extra: "" }); if (!formData.policyholderPhone1Extra) setShowPrimaryPhone2(false); }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-0.5">
                                  <X className="w-3 h-3" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}

                          {!showPrimaryPhone2 && !formData.policyholderPhone1Extra && (
                            <div className="flex justify-end pr-0">
                                <button
                                  type="button"
                                  onClick={() => setShowPrimaryPhone2(true)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Add Another Phone
                                </button>
                            </div>
                          )}
                          */}
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                          <SectionHeader title="Secondary Contact" icon={User} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InputField label="First Name" name="spouseFirstName" value={formData.spouseFirstName} onChange={handleChange} placeholder="First Name" icon={UserRound} />
                            <InputField label="Last Name" name="spouseLastName" value={formData.spouseLastName} onChange={handleChange} placeholder="Last Name" icon={UserRound} />
                          </div>
                          {/* DISABLED: Secondary Contact Phone — uncomment to restore
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <PhoneInputField label="Secondary Contact Phone" name="policyholderPhone2" value={formData.policyholderPhone2} onChange={handleChange} invalid={!!fieldErrors.policyholderPhone2} error={fieldErrors.policyholderPhone2} placeholder="Optional" />
                          </div>
                          */}
                        </div>
                      </div>

                      {/* RIGHT — Property Address */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                        <AddressGroup
                          streetAddress={formData.streetAddress}
                          addressLine2={formData.addressLine2}
                          city={formData.city}
                          state={formData.state}
                          zip={formData.zip}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={fieldErrors}
                        />
                      </div>
                    </div>
                  </FormSection>
                )}

                {/* ================================================ */}
                {/*  STEP 3 – Roofer & Public Adjuster               */}
                {/* ================================================ */}
                {currentStep === 3 && (
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                      {/* LEFT — Roofer */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                        <SectionHeader title="Roofer Information" icon={Home} optional />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField label="Roofer Name" name="rooferName" value={formData.rooferName} onChange={handleChange} placeholder="Full Name" icon={UserRound} />
                          <InputField label="Roofer Company" name="rooferCompany" value={formData.rooferCompany} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <PhoneInputField label="Roofer Phone" name="rooferPhone" value={formData.rooferPhone} onChange={handleChange} invalid={!!fieldErrors.rooferPhone} error={fieldErrors.rooferPhone} />
                          <InputField label="Roofer Email" name="rooferEmail" value={formData.rooferEmail} onChange={handleChange} type="email" placeholder="roofer@company.com" icon={Mail} />
                        </div>
                      </div>

                      {/* RIGHT — Public Adjuster */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                        <SectionHeader title="Public Adjuster Details" icon={Hand} optional />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField label="Public Adjuster Name" name="publicAdjusterName" value={formData.publicAdjusterName} onChange={handleChange} placeholder="Full Name" icon={UserRound} />
                          <InputField label="Public Company" name="publicAdjusterCompany" value={formData.publicAdjusterCompany} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <PhoneInputField label="Phone" name="publicAdjusterPhone" value={formData.publicAdjusterPhone} onChange={handleChange} invalid={!!fieldErrors.publicAdjusterPhone} error={fieldErrors.publicAdjusterPhone} />
                          <InputField label="Email" name="publicAdjusterEmail" value={formData.publicAdjusterEmail} onChange={handleChange} type="email" placeholder="adjuster@company.com" icon={Mail} invalid={!!fieldErrors.publicAdjusterEmail} error={fieldErrors.publicAdjusterEmail} />
                        </div>
                      </div>
                    </div>
                  </FormSection>
                )}

                {/* ================================================ */}
                {/*  STEP 4 – Review & Submit (2-col layout)         */}
                {/* ================================================ */}
                {currentStep === 4 && (
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-fadeIn">
                      
                      {/* ── LEFT COLUMN ── */}
                      <div className="space-y-4">
                        <ReviewBlock title="Inspection Type" icon={ClipboardList} onEdit={() => goToStep(0)}>
                          <ReviewRow label="Inspection Type" value={formData.inspectionType} />
                        </ReviewBlock>

                        {formData.isIAClaim ? (
                          <ReviewBlock title="IA Information" icon={Shield} onEdit={() => goToStep(1)}>
                            <ReviewRow label="IA Company" value={formData.iaCompany} />
                            <ReviewRow label="IA Name" value={`${formData.iaFirstName} ${formData.iaLastName}`.trim()} />
                            <ReviewRow label="IA Phone" value={formData.iaPhone} />
                            {formData.iaRecipients.map((r, i) => (
                              <ReviewRow key={i} label={`IA Email ${i + 1}`} value={r.email ? `${r.email}${r.notificationType.length > 0 ? ` (${formatPreferences(r.notificationType)})` : ''}` : ""} />
                            ))}
                          </ReviewBlock>
                        ) : (
                          <ReviewBlock title="Insurance Carrier" icon={Shield} onEdit={() => goToStep(1)}>
                            <ReviewRow label="Insurance Company" value={formData.insuranceCompany} />
                            <ReviewRow label="Claim Number" value={formData.claimNumber} />
                            {formData.policyNumber && <ReviewRow label="Policy Number" value={formData.policyNumber} />}
                            {formData.dateOfLoss && <ReviewRow label="Date of Loss" value={formData.dateOfLoss} />}
                          </ReviewBlock>
                        )}

                        <ReviewBlock title="Property Contact (Policyholder)" icon={User} onEdit={() => goToStep(2)}>
                          <ReviewRow label="Primary Name" value={`${formData.policyholderFirstName} ${formData.policyholderLastName}`.trim()} />
                          <ReviewRow label="Primary Phone" value={formData.policyholderPhone1} />
                          {formData.policyholderPhone1Extra && <ReviewRow label="Primary Phone 2" value={formData.policyholderPhone1Extra} />}
                          {formData.propertyContactEmail && <ReviewRow label="Email" value={formData.propertyContactEmail} />}
                          {(formData.spouseFirstName || formData.spouseLastName || formData.policyholderPhone2) && (
                            <div className="pt-4 mt-1 border-t border-gray-100 dark:border-gray-800 col-span-full">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <ReviewRow label="Secondary Name" value={`${formData.spouseFirstName} ${formData.spouseLastName}`.trim()} />
                                {formData.policyholderPhone2 && <ReviewRow label="Secondary Phone" value={formData.policyholderPhone2} />}
                              </div>
                            </div>
                          )}
                        </ReviewBlock>

                        <ReviewBlock title="Roofer Information" icon={Home} onEdit={() => goToStep(3)} optional>
                          {!(formData.rooferName || formData.rooferCompany || formData.rooferPhone || formData.rooferEmail) ? (
                            <div className="col-span-full text-[13px] italic text-gray-300 dark:text-gray-600 self-center">No Roofer Provided</div>
                          ) : (
                            <>
                              <ReviewRow label="Name" value={formData.rooferName} />
                              <ReviewRow label="Company" value={formData.rooferCompany} />
                              <ReviewRow label="Phone" value={formData.rooferPhone} />
                              <ReviewRow label="Email" value={formData.rooferEmail} />
                            </>
                          )}
                        </ReviewBlock>
                      </div>

                      {/* ── RIGHT COLUMN ── */}
                      <div className="space-y-4">
                        <ReviewBlock title="Building Type" icon={Building2} onEdit={() => goToStep(0)} optional>
                          <ReviewRow label="Building Type" value={formData.buildingType} />
                        </ReviewBlock>

                        {formData.isIAClaim && (
                          <ReviewBlock title="Insurance Carrier" icon={Shield} onEdit={() => goToStep(1)}>
                            <ReviewRow label="Insurance Company" value={formData.insuranceCompany} />
                            <ReviewRow label="Claim Number" value={formData.claimNumber} />
                            {formData.policyNumber && <ReviewRow label="Policy Number" value={formData.policyNumber} />}
                            {formData.dateOfLoss && <ReviewRow label="Date of Loss" value={formData.dateOfLoss} />}
                          </ReviewBlock>
                        )}

                        <ReviewBlock title={formData.isIAClaim ? "Carrier Adjuster Details" : "Adjuster Details"} icon={Gavel} onEdit={() => goToStep(1)}>
                          <ReviewRow label="Adjuster Company" value={formData.adjusterCompany} />
                          <ReviewRow label="Adjuster Name" value={`${formData.adjusterFirstName} ${formData.adjusterLastName}`.trim()} />
                          <ReviewRow label="Email" value={formData.adjusterEmails[0] ? `${formData.adjusterEmails[0].email}${formData.adjusterEmails[0].sendCopyOf.length > 0 ? ` (${formatPreferences(formData.adjusterEmails[0].sendCopyOf)})` : ''}` : ""} />
                          <ReviewRow label="Phone" value={formData.adjusterPhone} />
                          {formData.adjusterPhoneExt && <ReviewRow label="Extension" value={formData.adjusterPhoneExt} />}
                          {formData.adjusterEmails.slice(1).map((r, i) => (
                            <ReviewRow key={i} label={`Additional Email ${i + 1}`} value={r.email ? `${r.email}${r.sendCopyOf.length > 0 ? ` (${formatPreferences(r.sendCopyOf)})` : ''}` : ""} />
                          ))}
                          {formData.adjusterComments && <ReviewRow label="Comments" value={formData.adjusterComments} fullWidth />}
                        </ReviewBlock>

                        <ReviewBlock title="Property Address" icon={MapPin} onEdit={() => goToStep(2)}>
                          <ReviewRow label="Street Address" value={formData.streetAddress} />
                          {formData.addressLine2 && <ReviewRow label="Apt/Suite" value={formData.addressLine2} />}
                          <ReviewRow label="City" value={formData.city} />
                          <ReviewRow label="State" value={formData.state} />
                          <ReviewRow label="Zip Code" value={formData.zip} />
                        </ReviewBlock>

                        <ReviewBlock title="Public Adjuster Details" icon={Hand} onEdit={() => goToStep(3)} optional>
                          {!(formData.publicAdjusterName || formData.publicAdjusterCompany || formData.publicAdjusterPhone || formData.publicAdjusterEmail) ? (
                            <div className="col-span-full text-[13px] italic text-gray-300 dark:text-gray-600 self-center">No Public Adjuster Provided</div>
                          ) : (
                            <>
                              <ReviewRow label="Name" value={formData.publicAdjusterName} />
                              <ReviewRow label="Company" value={formData.publicAdjusterCompany} />
                              <ReviewRow label="Phone" value={formData.publicAdjusterPhone} />
                              <ReviewRow label="Email" value={formData.publicAdjusterEmail} />
                            </>
                          )}
                        </ReviewBlock>
                      </div>

                    </div>
                  </FormSection>
                )}

                {/* ── Navigation Buttons ── */}
                <div className="flex items-center justify-between pt-1.5 mt-2 border-t border-gray-200 dark:border-gray-800">
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < WIZARD_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {currentStep === 3 && isStep3FieldsEmpty() ? "Skip" : "Next"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      {submitError && (
                        <div className="text-gray-900 text-sm font-black max-w-md text-right bg-gray-200/80 backdrop-blur-md p-2.5 rounded-lg border border-gray-300/60 shadow-sm">
                          {submitError}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white border-t-transparent inline-block"></span>
                        ) : (
                          <Send className="w-4 h-4" />
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

      {/* ── Custom Validation Modal for Step 3 ── */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/40 backdrop-blur-md px-4 p-6 animate-fadeIn">
          <div className="bg-white dark:bg-section-dark w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all scale-100">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Requirement Check</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {validationModalConfig.message}
              </p>
            </div>
            
            <div className="px-8 pb-8 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const currentType = validationQueue[0];
                  const config = getStep3ValidationConfig(currentType);
                  
                  // Close modal and clear queue immediately (Strict: No automatic switching)
                  setIsValidationModalOpen(false);
                  setValidationQueue([]);

                  // The fieldErrors were already set when the modal opened, 
                  // but we ensure showErrors is true for visibility.
                  setShowErrors(true);

                  // Scroll and focus
                  if (config.missingFields.length > 0) {
                    const firstField = config.missingFields[0];
                    setTimeout(() => scrollToField(firstField), 100);
                  }
                }}
                className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white py-2.5 px-6 rounded-xl font-bold text-xs transition-all shadow-md active:scale-[0.98]"
              >
                Update Details
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const type = validationQueue[0];
                  if (type === 'adjuster') {
                    setSkipAdjusterValidation(true);
                    setFormData(prev => ({ ...prev, publicAdjusterPhone: "", publicAdjusterEmail: "" }));
                  } else if (type === 'roofer') {
                    setSkipRooferValidation(true);
                    setFormData(prev => ({ ...prev, rooferPhone: "" }));
                  }

                  const isLastItem = validationQueue.length === 1;
                  setIsValidationModalOpen(false);
                  setValidationQueue([]);

                  if (isLastItem) {
                    // Navigate if it was the only/last issue
                    setCurrentStep(4);
                    setMaxCompletedStep((prev) => Math.max(prev, 4));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    // Stay on step 3 if more issues exist (will re-trigger on next click)
                    console.info("[Validation] Partial bypass. Modal closed. Re-trigger required for remaining items.");
                  }
                }}
                className="w-full bg-white dark:bg-background-dark text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold py-2.5 px-6 rounded-xl transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 flex items-center justify-center gap-2 text-xs active:scale-[0.98]"
              >
                Proceed Without
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-section-dark w-full max-w-[420px] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-fadeIn">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-background-dark/50">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="text-primary text-base w-4 h-4" />
                Add New Company
              </h3>
              <button onClick={() => setIsAddCompanyModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewCompanySubmit} className="px-3.5 py-2.5 space-y-2">
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Company Name <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Insurance Co. Name" value={newCompanyData.name} onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">CC Invoices To</label>
                <input type="email" placeholder="email@company.com" value={newCompanyData.ccInvoicesTo} onChange={(e) => setNewCompanyData({ ...newCompanyData, ccInvoicesTo: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="splitInvoiceCheck" checked={newCompanyData.splitInvoice} onChange={(e) => setNewCompanyData({ ...newCompanyData, splitInvoice: e.target.checked })} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="splitInvoiceCheck" className="text-[11px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Split Invoice from Report</label>
              </div>
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Invoice Email</label>
                <input type="email" placeholder="invoice@company.com" value={newCompanyData.invoiceEmail} onChange={(e) => setNewCompanyData({ ...newCompanyData, invoiceEmail: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Price List</label>
                <select value={newCompanyData.priceList} onChange={(e) => setNewCompanyData({ ...newCompanyData, priceList: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent cursor-pointer">
                  <option value="2025 Prices">2025 Prices</option>
                  <option value="2022 Prices">2022 Prices</option>
                  <option value="Do Not Send Fee Schedule">Do Not Send Fee Schedule</option>
                </select>
              </div>
              {createCompanyMessage && (
                <div className={`text-[11px] p-2 rounded-lg border ${createCompanyMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-100 border-gray-300 text-gray-900 font-black dark:bg-gray-800/40 dark:border-gray-700'}`}>
                  {createCompanyMessage.text}
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                <button type="button" disabled={isCreatingCompany || hasSentCompany} onClick={handleAddNewCompanyReset} className="px-3 py-1 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">Reset</button>
                {hasSentCompany ? (
                  <div className="px-3.5 py-1 rounded-lg text-[11px] font-bold text-white bg-primary/70 flex items-center gap-1.5 shadow-sm">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <button type="submit" className="px-3.5 py-1 rounded-lg text-[11px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-1.5">
                    Add Company
                  </button>
                )}
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
  icon: Icon,
  onEdit,
  optional,
  children,
}: {
  title: string;
  icon: React.ElementType;
  onEdit: () => void;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-section-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 border-l-4 border-l-primary dark:border-l-accent hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-primary dark:text-accent opacity-70" />
          <h4 className="text-[10px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">{title}</h4>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-bold text-primary dark:text-accent hover:bg-primary/5 dark:hover:bg-accent/10 transition-all opacity-80"
        >
          <Edit2 className="w-2.5 h-2.5" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, fullWidth = false }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={`${fullWidth ? "col-span-full" : ""} flex flex-col gap-0.5 overflow-hidden`}>
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
      <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap leading-tight" style={{ wordBreak: "break-word" }}>
        {value || <span className="text-gray-300 dark:text-gray-600 italic font-normal">Not provided</span>}
      </span>
    </div>
  );
}

const formatPreferences = (prefs: string[]) => {
  if (prefs.includes('all')) return "All";
  return prefs.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
};
