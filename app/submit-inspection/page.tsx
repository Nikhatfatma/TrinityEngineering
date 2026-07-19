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
import ServiceAddOns from "@/components/inspection-form/ServiceAddOns";
import { SERVICE_ADD_ONS } from "@/components/inspection-form/serviceAddOnsContent";
import PhoneInputField from "@/components/inspection-form/PhoneInputField";
import {
  ClipboardList,
  Shield,
  User,
  Home,
  Hand,
  CheckCircle,
  ShieldCheck,
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
  Trash2,
  Gavel,
  Settings, // fallback for component failure
  FileText,
  BadgeAlert,
  MapPin,
  Loader2,
  AlertTriangle,
  Calendar,
  UserCheck,
  Upload,
  Bookmark,
  PackagePlus,
  Users,
} from "lucide-react";
import { isValidEmail, isValidPhoneNumber, isValidZipCode, validateIaRecipients, type IaRecipient, validateAdjusterEmails, type AdjusterEmail, isValidMMDDYYYY, type ContactEmail, validateContactEmails } from "@/lib/utils/validation";
import { DatePicker } from "@/components/inspection-form/DatePicker";

/* ------------------------------------------------------------------ */
/*  Data Constants                                                     */
/* ------------------------------------------------------------------ */

const INSPECTION_TYPES = [
  { id: "storm-damage", title: "Storm Damage", image: "/inspection-type-storm-damage.png" },
  { id: "structural-loss", title: "Structural Loss", image: "/inspection-type-structural-loss.png" },
  { id: "large-complex-loss", title: "Large / Complex Loss", image: "/inspection-type-large-complex-loss.png" },
  { id: "water-loss", title: "Water Loss", image: "/inspection-type-water-loss.png" },
  { id: "lightning-damage", title: "Lightning Damage", image: "/inspection-type-lightning-damage.png" },
  { id: "vandalism", title: "Vandalism", image: "/inspection-type-vandalism.png" },
  { id: "chimney-fire-collapse", title: "Chimney Fire / Collapse", image: "/inspection-type-chimney-fire-collapse.png" },
  { id: "component-failure", title: "Component Failure", image: "/inspection-type-component-failure.png" },
  { id: "hvac-electrical", title: "HVAC / Electrical", image: "/inspection-type-hvac-electrical.png" },
  { id: "small-fire", title: "Small Fire", image: "/inspection-type-small-fire.png" },
];

const BUILDING_TYPES = [
  {
    id: "single-family",
    title: "Single-family residential",
    image: "/building-type-single-family.png",
    tooltip: "Primary & secondary dwelling, sheds, other structures",
  },
  {
    id: "multiples-residence",
    title: "Multi-unit residential",
    image: "/building-type-multi-unit.png",
    tooltip: "Townhome, duplex, triplex, etc.",
  },
  {
    id: "commercial-municipal-industrial",
    title: "Commercial / Municipal / Industrial",
    image: "/building-type-commercial.png",
    tooltip: "Apartment, hotel, factory, storage centers, municipal, church, etc.",
  },
];

function getAvailableBuildingTypes(inspectionType: string) {
  if (!inspectionType || inspectionType === "Component Failure") return [];
  return BUILDING_TYPES;
}

/* Insurance companies are now fetched from the database via API â€” no hardcoded list */

const MAX_IA_EMAILS = 3;
const MAX_ADJ_EMAILS = 3;

const SEND_COPY_OPTIONS = ["all", "report", "invoice", "notifications"] as const;



const WIZARD_STEPS = [
  { title: "Inspection & Property", icon: ClipboardList },
  { title: "Service Add-ons", icon: PackagePlus },
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
  2: ["primaryClientType", "claimNumber", "adjusterFirstName", "adjusterLastName", "adjusterPhone", "adjusterEmail" as any, "iaCompany", "iaFirstName", "iaLastName", "iaPhone"],
  3: ["policyholderFirstName", "policyholderLastName", "streetAddress", "city", "state", "zip"],
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
  adjusterComments: string;
  isIAClaim: boolean;
  iaFirstName: string;
  iaLastName: string;
  iaPhone: string;
  iaCompany: string;
  contactEmails: ContactEmail[];
  primaryClientType: "Adjuster (Carrier)" | "Independent Adjuster" | "The IA is the TPA" | "";
  serviceAddOns: string[];
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

/** When primary client is "The IA is the TPA", mirror IA details into carrier/adjuster fields. */
function syncCarrierFieldsFromIa(prev: FormData): FormData {
  const iaEmails = prev.contactEmails.filter((c) => c.contactType === "IA");
  const otherEmails = prev.contactEmails.filter(
    (c) => c.contactType !== "Adjuster (Carrier)" && c.contactType !== "IA"
  );
  const carrierEmails: ContactEmail[] =
    iaEmails.length > 0
      ? iaEmails.map((c) => ({
          email: c.email,
          contactType: "Adjuster (Carrier)" as const,
          sendCopy: [...(c.sendCopy?.length ? c.sendCopy : ["all", "report", "invoice", "notifications"])],
        }))
      : [
          {
            email: "",
            contactType: "Adjuster (Carrier)" as const,
            sendCopy: ["all", "report", "invoice", "notifications"],
          },
        ];

  return {
    ...prev,
    adjusterFirstName: prev.iaFirstName,
    adjusterLastName: prev.iaLastName,
    adjusterPhone: prev.iaPhone,
    contactEmails: [...carrierEmails, ...iaEmails, ...otherEmails],
  };
}

function isCarrierSyncedFromIa(prev: FormData): boolean {
  if (
    prev.adjusterFirstName !== prev.iaFirstName ||
    prev.adjusterLastName !== prev.iaLastName ||
    prev.adjusterPhone !== prev.iaPhone
  ) {
    return false;
  }
  const iaEmails = prev.contactEmails.filter((c) => c.contactType === "IA");
  const carrierEmails = prev.contactEmails.filter((c) => c.contactType === "Adjuster (Carrier)");
  if (iaEmails.length === 0) {
    return carrierEmails.length === 1 && !carrierEmails[0].email;
  }
  if (iaEmails.length !== carrierEmails.length) return false;
  return iaEmails.every((c, i) => {
    const a = carrierEmails[i];
    if (!a) return false;
    if (c.email !== a.email) return false;
    const cs = [...(c.sendCopy || [])].sort().join(",");
    const as = [...(a.sendCopy || [])].sort().join(",");
    return cs === as;
  });
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
  adjusterComments: "",
  isIAClaim: false,
  iaFirstName: "",
  iaLastName: "",
  iaPhone: "",
  iaCompany: "",
  contactEmails: [{ email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] }],
  primaryClientType: "",
  serviceAddOns: [],
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
  const [portalUser, setPortalUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Load session and Carrier preferences on mount
  useEffect(() => {
    fetch("/api/portal/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.user) {
          const user = data.user;
          setPortalUser(user);

          // Follow role-based defaults immediately
          if (user.role === "IA") {
            const nameParts = (user.name || "").trim().split(/\s+/).filter(Boolean);
            const iaFirst = nameParts.length > 0 ? nameParts[0] : "";
            const iaLast = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            setFormData((prev): FormData => {
              const hasIa = prev.contactEmails.some(c => c.contactType === "IA");
              const baseContactEmails: ContactEmail[] = hasIa
                ? prev.contactEmails.map(c => (c.contactType === "IA" && !c.email) ? { ...c, email: user.email || "" } : c)
                : [...prev.contactEmails, { email: user.email || "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] }];
              return {
                ...prev,
                isIAClaim: true,
                primaryClientType: "Independent Adjuster",
                iaFirstName: prev.iaFirstName || iaFirst,
                iaLastName: prev.iaLastName || iaLast,
                contactEmails: baseContactEmails,
              };
            });
          } else if (user.role === "Adjuster") {
            const nameParts = (user.name || "").trim().split(/\s+/).filter(Boolean);
            const adjFirst = nameParts.length > 0 ? nameParts[0] : "";
            const adjLast = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            setFormData((prev): FormData => {
              const updatedEmails = [...prev.contactEmails];
              const primaryIdx = updatedEmails.findIndex(c => c.contactType === "Adjuster (Carrier)");
              if (primaryIdx !== -1) {
                if (!updatedEmails[primaryIdx].email) {
                  updatedEmails[primaryIdx] = {
                    ...updatedEmails[primaryIdx],
                    email: user.email,
                  };
                }
              } else {
                updatedEmails.unshift({
                  email: user.email,
                  contactType: "Adjuster (Carrier)",
                  sendCopy: ["all", "report", "invoice", "notifications"],
                });
              }

              return {
                ...prev,
                isIAClaim: false,
                primaryClientType: "Adjuster (Carrier)",
                adjusterFirstName: prev.adjusterFirstName || adjFirst,
                adjusterLastName: prev.adjusterLastName || adjLast,
                contactEmails: updatedEmails as ContactEmail[],
              };
            });
          }
        }
      })
      .catch((err) => console.error("Failed to check portal session:", err));
  }, []);

  // Load Carrier Adjuster preferences.
  // On login (no company yet) the most recent saved preferences load so the adjuster's own details prepopulate.
  // Once an Insurance Company is selected, that company's saved preferences are loaded instead.
  useEffect(() => {
    if (!portalUser || portalUser.role !== "Adjuster") return;

    const company = formData.insuranceCompany ? formData.insuranceCompany.trim() : "";
    const prefsUrl = company
      ? `/api/portal/preferences?insuranceCompany=${encodeURIComponent(company)}`
      : `/api/portal/preferences`;

    fetch(prefsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.preferences) {
          const prefs = data.preferences;
          setLoadedPreferences(prefs);
          setFormData((prev): FormData => {
            const cleanPrefsContactEmails: ContactEmail[] = (prefs.contactEmails || []).filter((c: any) => c.contactType === "Adjuster (Carrier)").map((c: any) => ({
              ...c,
              sendCopy: c.sendCopy && c.sendCopy.includes("all") ? ["all", "report", "invoice", "notifications"] : c.sendCopy
            }));
            const iaEmails = prev.contactEmails.filter(c => c.contactType !== "Adjuster (Carrier)");
            const mergedEmails: ContactEmail[] = cleanPrefsContactEmails.length > 0
              ? [...cleanPrefsContactEmails, ...iaEmails]
              : prev.contactEmails;

            const scopedCompany = (!company
              ? (prefs.insuranceCompany || data.scopingCompany || "")
              : "").trim();

            return {
              ...prev,
              adjusterFirstName: prefs.adjusterFirstName || prev.adjusterFirstName,
              adjusterLastName: prefs.adjusterLastName || prev.adjusterLastName,
              adjusterPhone: prefs.adjusterPhone || prev.adjusterPhone,
              adjusterPhoneExt: prefs.adjusterPhoneExt || prev.adjusterPhoneExt,
              adjusterCompany: prefs.adjusterCompany || prev.adjusterCompany,
              ...(scopedCompany && !prev.insuranceCompany.trim()
                ? { insuranceCompany: scopedCompany }
                : {}),
              ...(Array.isArray(prefs.serviceAddOns) ? { serviceAddOns: prefs.serviceAddOns } : {}),
              contactEmails: mergedEmails,
            };
          });
        } else {
          setLoadedPreferences(null);
          setFormData((prev): FormData => {
            const iaEmails = prev.contactEmails.filter(c => c.contactType !== "Adjuster (Carrier)");
            // No saved preferences for this company yet — fall back to the logged-in adjuster's own profile
            const nameParts = (portalUser.name || "").trim().split(/\s+/).filter(Boolean);
            const adjFirst = nameParts.length > 0 ? nameParts[0] : "";
            const adjLast = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            const defaultAdjusterEmail: ContactEmail[] = [
              {
                email: portalUser.email || "",
                contactType: "Adjuster (Carrier)",
                sendCopy: ["all", "report", "invoice", "notifications"]
              }
            ];
            return {
              ...prev,
              adjusterFirstName: adjFirst,
              adjusterLastName: adjLast,
              adjusterPhone: "",
              adjusterPhoneExt: "",
              adjusterCompany: "",
              contactEmails: [...defaultAdjusterEmail, ...iaEmails]
            };
          });
        }
      })
      .catch((err) => console.error("Failed to load Adjuster preferences:", err));
  }, [portalUser, formData.insuranceCompany]);

  // Load IA preferences scoped by User + IA Company
  // Only prepopulate IA details when the primary client for this project is the Independent Adjuster.
  // If the primary client is the Carrier Adjuster, IA details must NOT be prepopulated.
  // On login (no IA company yet) load most recent prefs so company + details can prepopulate.
  useEffect(() => {
    if (!portalUser || portalUser.role !== "IA") return;

    if (formData.primaryClientType === "Adjuster (Carrier)") {
      setLoadedPreferences(null);
      return;
    }

    const company = formData.iaCompany ? formData.iaCompany.trim() : "";
    const prefsUrl = company
      ? `/api/portal/preferences?iaCompany=${encodeURIComponent(company)}`
      : `/api/portal/preferences`;

    fetch(prefsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.preferences) {
          const prefs = data.preferences;
          setLoadedPreferences(prefs);
          setFormData((prev): FormData => {
            const cleanPrefsContactEmails: ContactEmail[] = (prefs.contactEmails || []).filter((c: any) => c.contactType === "IA").map((c: any) => ({
              ...c,
              sendCopy: c.sendCopy && c.sendCopy.includes("all") ? ["all", "report", "invoice", "notifications"] : c.sendCopy
            }));
            const carrierEmails = prev.contactEmails.filter(c => c.contactType !== "IA");
            const mergedEmails: ContactEmail[] = cleanPrefsContactEmails.length > 0
              ? [...carrierEmails, ...cleanPrefsContactEmails]
              : prev.contactEmails;

            const scopedCompany = (!company
              ? (prefs.iaCompany || data.scopingCompany || "")
              : "").trim();

            return {
              ...prev,
              iaFirstName: prefs.iaFirstName || prev.iaFirstName,
              iaLastName: prefs.iaLastName || prev.iaLastName,
              iaPhone: prefs.iaPhone || prev.iaPhone,
              ...(scopedCompany && !prev.iaCompany.trim()
                ? { iaCompany: scopedCompany }
                : {}),
              ...(Array.isArray(prefs.serviceAddOns) ? { serviceAddOns: prefs.serviceAddOns } : {}),
              contactEmails: mergedEmails,
            };
          });
        } else {
          setLoadedPreferences(null);
          if (!company) return;
          setFormData((prev): FormData => {
            const carrierEmails = prev.contactEmails.filter(c => c.contactType !== "IA");
            // No saved preferences for this IA company yet — fall back to the logged-in IA user's own profile
            const nameParts = (portalUser.name || "").trim().split(/\s+/).filter(Boolean);
            const iaFirst = nameParts.length > 0 ? nameParts[0] : "";
            const iaLast = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            const defaultIaEmail: ContactEmail[] = [
              {
                email: portalUser.email || "",
                contactType: "IA",
                sendCopy: ["all", "report", "invoice", "notifications"]
              }
            ];
            return {
              ...prev,
              iaFirstName: iaFirst,
              iaLastName: iaLast,
              iaPhone: "",
              contactEmails: [...carrierEmails, ...defaultIaEmail]
            };
          });
        }
      })
      .catch((err) => console.error("Failed to load IA preferences:", err));
  }, [portalUser, formData.iaCompany, formData.primaryClientType]);

  // When "The IA is the TPA" is selected, keep carrier/adjuster fields mirrored from IA fields.
  // Existing Independent Adjuster / Adjuster (Carrier) flows are unchanged.
  useEffect(() => {
    if (formData.primaryClientType !== "The IA is the TPA") return;
    setFormData((prev) => {
      if (prev.primaryClientType !== "The IA is the TPA") return prev;
      if (isCarrierSyncedFromIa(prev)) return prev;
      return syncCarrierFieldsFromIa(prev);
    });
  }, [
    formData.primaryClientType,
    formData.iaFirstName,
    formData.iaLastName,
    formData.iaPhone,
    formData.contactEmails,
  ]);

  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [iaEmailErrors, setIaEmailErrors] = useState<string[]>([]);
  const [iaSectionError, setIaSectionError] = useState("");
  const [adjusterEmailErrors, setAdjusterEmailErrors] = useState<string[]>([]);
  const [adjusterSectionError, setAdjusterSectionError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [insuranceCompanyQuery, setInsuranceCompanyQuery] = useState("");
  const [insuranceCompanyOpen, setInsuranceCompanyOpen] = useState(false);
  const [iaCompanyQuery, setIaCompanyQuery] = useState("");
  const [iaCompanyOpen, setIaCompanyOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [addCompanyType, setAddCompanyType] = useState<string>('Insurance Company');
  const [newCompanyData, setNewCompanyData] = useState({ name: "", ccInvoicesTo: "", splitInvoice: false, invoiceEmail: "", priceList: "2025 Prices" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [hasSentCompany, setHasSentCompany] = useState(false);
  const [createCompanyMessage, setCreateCompanyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // DISABLED: Secondary primary phone feature â€” uncomment to restore
  // const [showPrimaryPhone2, setShowPrimaryPhone2] = useState(false);

  const [skipRooferValidation, setSkipRooferValidation] = useState(false);
  const [skipAdjusterValidation, setSkipAdjusterValidation] = useState(false);
  const [lastButtonState, setLastButtonState] = useState("Next");
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationQueue, setValidationQueue] = useState<('roofer' | 'adjuster')[]>([]);
  interface SelectedDocument {
    id: string;
    file: File | null;
    categories: string[];
    customCategory: string;
  }
  const [insuranceDocuments, setInsuranceDocuments] = useState<SelectedDocument[]>([
    {
      id: "initial-row",
      file: null,
      categories: [],
      customCategory: ""
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [hasChosenPreferences, setHasChosenPreferences] = useState(false);
  const [loadedPreferences, setLoadedPreferences] = useState<any>(null);
  const [shouldSavePreferences, setShouldSavePreferences] = useState(false);

  const hasPreferencesChanged = (current: FormData, saved: any, role: string) => {
    if (!saved) return true; // If no saved preferences, they are considered changed/new

    const currentAddOns = [...(current.serviceAddOns || [])].sort().join(",");
    const savedAddOns = [...(saved.serviceAddOns || [])].sort().join(",");
    if (currentAddOns !== savedAddOns) return true;

    if (role === "IA") {
      const currentEmails = current.contactEmails.filter(c => c.contactType === "IA");
      const savedEmails = saved.contactEmails || [];

      if ((current.iaFirstName || "") !== (saved.iaFirstName || "")) return true;
      if ((current.iaLastName || "") !== (saved.iaLastName || "")) return true;
      if ((current.iaPhone || "") !== (saved.iaPhone || "")) return true;
      if ((current.iaCompany || "").trim() !== (saved.iaCompany || "").trim()) return true;

      if (currentEmails.length !== savedEmails.length) return true;
      for (let i = 0; i < currentEmails.length; i++) {
        const c = currentEmails[i];
        const s = savedEmails[i];
        if (!s) return true;
        if ((c.email || "") !== (s.email || "")) return true;
        const cCopy = [...(c.sendCopy || [])].sort();
        const sRaw = s.sendCopy || [];
        const sNormalized = sRaw.includes("all") ? ["all", "report", "invoice", "notifications"] : sRaw;
        const sCopy = [...sNormalized].sort();
        if (cCopy.join(",") !== sCopy.join(",")) return true;
      }
      return false;
    } else if (role === "Adjuster") {
      const currentEmails = current.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)");
      const savedEmails = saved.contactEmails || [];

      if ((current.adjusterFirstName || "") !== (saved.adjusterFirstName || "")) return true;
      if ((current.adjusterLastName || "") !== (saved.adjusterLastName || "")) return true;
      if ((current.adjusterPhone || "") !== (saved.adjusterPhone || "")) return true;
      if ((current.adjusterPhoneExt || "") !== (saved.adjusterPhoneExt || "")) return true;
      if ((current.adjusterCompany || "") !== (saved.adjusterCompany || "")) return true;
      if ((current.insuranceCompany || "").trim() !== (saved.insuranceCompany || "").trim()) return true;

      if (currentEmails.length !== savedEmails.length) return true;
      for (let i = 0; i < currentEmails.length; i++) {
        const c = currentEmails[i];
        const s = savedEmails[i];
        if (!s) return true;
        if ((c.email || "") !== (s.email || "")) return true;
        const cCopy = [...(c.sendCopy || [])].sort();
        const sRaw = s.sendCopy || [];
        const sNormalized = sRaw.includes("all") ? ["all", "report", "invoice", "notifications"] : sRaw;
        const sCopy = [...sNormalized].sort();
        if (cCopy.join(",") !== sCopy.join(",")) return true;
      }
      return false;
    }
    return false;
  };

  const handleSavePreferencesIntentAndContinue = (shouldSave: boolean) => {
    setShouldSavePreferences(shouldSave);
    setHasChosenPreferences(true);
    setShowPreferencesModal(false);
    setCurrentStep(3);
    setMaxCompletedStep((prev) => Math.max(prev, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const MAX_INSURANCE_DOCUMENT_SIZE = 15 * 1024 * 1024;
  const MAX_INSURANCE_DOCUMENTS = 7;

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

  /* â”€â”€ Insurance Company API Search State â”€â”€ */
  const [insuranceSearchResults, setInsuranceSearchResults] = useState<{ id: string; name: string; zoho_creator_id: string }[]>([]);
  const [insuranceSearchLoading, setInsuranceSearchLoading] = useState(false);
  const [aliasMatch, setAliasMatch] = useState<{ matchedBy: string; results: { id: string; name: string; zoho_creator_id: string }[] } | null>(null);
  const [aliasDismissed, setAliasDismissed] = useState(false);
  const [iaAliasMatch, setIaAliasMatch] = useState<{ matchedBy: string; results: { id: string; name: string; zoho_creator_id: string }[] } | null>(null);
  const [iaAliasDismissed, setIaAliasDismissed] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [masterInsuranceList, setMasterInsuranceList] = useState<{ id: string; name: string; zoho_creator_id: string }[]>([]);
  const insuranceCacheRef = useRef<Record<string, { results: any[], matchedBy?: string }>>({});

  /* â”€â”€ IA Company (Zoho IA_Company_Name lookup) API Search State â”€â”€ */
  const [iaCompanySearchResults, setIaCompanySearchResults] = useState<{ id: string; name: string; zoho_creator_id: string }[]>([]);
  const [iaCompanySearchLoading, setIaCompanySearchLoading] = useState(false);
  const iaSearchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [masterIaCompanyList, setMasterIaCompanyList] = useState<{ id: string; name: string; zoho_creator_id: string }[]>([]);
  const [companyTypes, setCompanyTypes] = useState<string[]>(['Insurance Company', 'IA Company', 'Vendor', 'Contractor', 'Attorney', 'Engineering Firm']);

  /* â”€â”€ Layer 2: IA Carrier Contacts (autofill suggestions) â”€â”€ */
  interface CarrierContact {
    adjusterEmail: string;
    scopingCompany?: string;
    adjusterFirstName?: string;
    adjusterLastName?: string;
    adjusterPhone?: string;
    adjusterPhoneExt?: string;
    contactEmails?: { email: string; contactType: string; sendCopy: string[] }[];
  }
  const [carrierContacts, setCarrierContacts] = useState<CarrierContact[]>([]);
  const [adjusterSuggestions, setAdjusterSuggestions] = useState<CarrierContact[]>([]);
  const [adjusterSuggestField, setAdjusterSuggestField] = useState<"firstName" | "lastName" | "email" | null>(null);

  /* â”€â”€ Onboarding Tutorial State â”€â”€ */
  const [showOnboardingTutorial, setShowOnboardingTutorial] = useState(false);

  // Fetch carrier contacts when IA or Adjuster logs in (for autofill suggestions)
  useEffect(() => {
    if (!portalUser || (portalUser.role !== "IA" && portalUser.role !== "Adjuster")) return;
    fetch("/api/portal/contacts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.contacts) {
          const normalizedContacts = data.contacts.map((contact: CarrierContact) => ({
            ...contact,
            contactEmails: contact.contactEmails?.map(c => ({
              ...c,
              sendCopy: c.sendCopy && c.sendCopy.includes("all") ? ["all", "report", "invoice", "notifications"] : c.sendCopy
            }))
          }));
          setCarrierContacts(normalizedContacts);
        }
      })
      .catch((err) => console.error("Failed to load carrier contacts:", err));
  }, [portalUser]);

  // Show onboarding tutorial for users who haven't seen it yet
  useEffect(() => {
    if (!portalUser || (portalUser.role !== "IA" && portalUser.role !== "Adjuster")) return;
    const tutorialKey = `trinity_portal_tutorial_seen_${portalUser.email}`;
    const seen = typeof window !== "undefined" ? localStorage.getItem(tutorialKey) : null;
    if (!seen) {
      setShowOnboardingTutorial(true);
    }
  }, [portalUser]);

  useEffect(() => {
    fetch('/api/insurance-companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getCompanyTypes' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.results && data.results.length > 0) {
          setCompanyTypes(data.results);
        }
      })
      .catch(err => console.error('Failed to fetch company types:', err));
  }, []);


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

  useEffect(() => {
    fetch('/api/ia-companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'searchIaCompanies', search: '' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.results) {
          setMasterIaCompanyList(data.results);
          setIaCompanySearchResults(data.results);
        }
      })
      .catch(err => console.error('Failed to fetch IA companies:', err));
  }, []);

  /** Debounced API call to search IA companies (supports alias match like insurance) */
  const searchIaCompanies = useCallback((query: string) => {
    const trimmed = query.trim();

    if (iaSearchTimeoutRef.current) clearTimeout(iaSearchTimeoutRef.current);

    // Empty query: show full master list instantly (no alias needed)
    if (!trimmed && masterIaCompanyList.length > 0) {
      setIaCompanySearchResults(masterIaCompanyList);
      setIaAliasMatch(null);
      setIaCompanySearchLoading(false);
      return;
    }

    setIaCompanySearchLoading(true);
    iaSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/ia-companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'searchIaCompanies', search: trimmed }),
        });
        const data = await res.json();
        if (data.success) {
          const results = data.results || [];
          setIaCompanySearchResults(results);
          if (!trimmed && data.results) {
            setMasterIaCompanyList(data.results);
          }
          if (data.matchedBy === 'alias' && results.length > 0) {
            setIaAliasMatch({ matchedBy: data.matchedBy, results });
            setIaAliasDismissed(false);
          } else {
            setIaAliasMatch(null);
          }
        } else {
          setIaCompanySearchResults([]);
          setIaAliasMatch(null);
        }
      } catch (err) {
        console.error('IA company search error:', err);
        setIaCompanySearchResults([]);
        setIaAliasMatch(null);
      } finally {
        setIaCompanySearchLoading(false);
      }
    }, 300);
  }, [masterIaCompanyList]);

  /** Debounced API call to search insurance companies */
  const searchInsuranceCompanies = useCallback((query: string) => {
    const trimmed = query.trim();

    // Clear any pending debounce
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // Use local master list ONLY for empty query to show full dropdown instantly.
    // Real search must go through cache or API to support 'alias' mapping correctly.
    if (!trimmed && masterInsuranceList.length > 0) {
      setInsuranceSearchResults(masterInsuranceList);
      setAliasMatch(null);
      setInsuranceSearchLoading(false);
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

  /* â”€â”€ Step 3 Helper Logic â”€â”€ */
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
    if (currentStep === 4) {
      const isEmpty = isStep3FieldsEmpty();
      const currentState = isEmpty ? "Skip" : "Next";
      if (currentState !== lastButtonState) {
        console.info(`[Step 4] Button state changed to: ${currentState}`);
        setLastButtonState(currentState);
      }
    } else {
      // Reset tracker when leaving roofer step
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
        body: JSON.stringify({ action: 'createCompany', data: { ...newCompanyData, companyType: addCompanyType } }),
      });
      const data = await res.json();

      if (data.success) {
        setCreateCompanyMessage({ type: 'success', text: `${addCompanyType === 'IA Company' ? 'IA Company' : 'Company'} submitted for approval. You will be able to select it once it becomes active.` });

        const dynamicValue = newCompanyData.name;
        if (addCompanyType === 'IA Company') {
          setFormData(prev => ({ ...prev, iaCompany: dynamicValue }));
          setIaCompanyQuery(dynamicValue);
        } else {
          setFormData(prev => ({ ...prev, insuranceCompany: dynamicValue }));
          setInsuranceCompanyQuery(dynamicValue);
        }

        // Reset form after a delay then close
        setTimeout(() => {
          handleAddNewCompanyReset();
          setIsAddCompanyModalOpen(false);
          setCreateCompanyMessage(null);
        }, 3000);
      } else {
        setCreateCompanyMessage({ type: 'error', text: data.error || "Failed to create company." });
        setHasSentCompany(false);
      }
    } catch (err) {
      console.error('Failed to create company:', err);
      setCreateCompanyMessage({ type: 'error', text: "An error occurred. Please try again." });
      setHasSentCompany(false);
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

  useEffect(() => {
    setIaCompanyQuery(formData.iaCompany ?? "");
  }, [formData.iaCompany]);

  /* ---- handlers ---- */

  const readInsuranceDocumentAsBase64 = (file: File) =>
    new Promise<{ fileName: string; mimeType: string; base64: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        resolve({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          base64,
        });
      };
      reader.onerror = () => reject(new Error("Could not read the selected file."));
      reader.readAsDataURL(file);
    });

  const renderInsuranceDocumentUpload = (extraClass = "") => (
    <div
      className={`mt-3 rounded-lg border p-3.5 transition-all ${
        isDragging
          ? "border-primary bg-primary/[0.08] dark:border-accent dark:bg-accent/[0.12] scale-[1.01]"
          : "border-primary/25 dark:border-accent/25 bg-primary/[0.04] dark:bg-accent/[0.07]"
      } ${extraClass}`}
      data-field-name="insuranceDocument"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0) return;

        const oversized = files.find(f => f.size > MAX_INSURANCE_DOCUMENT_SIZE);
        if (oversized) {
          setFieldErrors((prev) => ({ ...prev, insuranceDocument: `File "${oversized.name}" must be 15MB or smaller.` }));
          return;
        }

        setInsuranceDocuments(prev => {
          const replacingEmpty = prev.length === 1 && prev[0].file === null && prev[0].categories.length === 0;
          const currentCount = replacingEmpty ? 0 : prev.length;
          const slotsLeft = MAX_INSURANCE_DOCUMENTS - currentCount;
          if (slotsLeft <= 0) {
            setFieldErrors((prevErrors) => ({
              ...prevErrors,
              insuranceDocument: `Maximum of ${MAX_INSURANCE_DOCUMENTS} documents allowed.`,
            }));
            return prev;
          }
          const accepted = files.slice(0, slotsLeft);
          if (files.length > slotsLeft) {
            setFieldErrors((prevErrors) => ({
              ...prevErrors,
              insuranceDocument: `Maximum of ${MAX_INSURANCE_DOCUMENTS} documents allowed. Only ${slotsLeft} more added.`,
            }));
          }
          const newRows = accepted.map(file => ({
            id: Math.random().toString(36).substring(2, 9),
            file,
            categories: [],
            customCategory: ""
          }));
          if (replacingEmpty) return newRows;
          return [...prev, ...newRows];
        });
      }}
    >
      <div className="mb-2">
        <SectionHeader title="Insurance Documents" icon={FileText} />
      </div>

      {/* Only show top banner for oversized-file type errors.
          Empty-row / category errors render on the related field. */}
      {fieldErrors.insuranceDocument &&
        !fieldErrors.insuranceDocument.toLowerCase().includes("category") &&
        !fieldErrors.insuranceDocument.toLowerCase().includes("empty rows") && (
        <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 mb-2 inline-block border border-gray-300/50">{fieldErrors.insuranceDocument}</p>
      )}

      <div className="space-y-3">
          {insuranceDocuments.map((doc, idx) => {
            const fileMissingError = fieldErrors[`docFile_${doc.id}`];
            return (
            <div
              key={doc.id}
              className={`p-2.5 bg-white dark:bg-background-dark rounded-lg border shadow-sm space-y-2.5 relative transition-all ${
                fileMissingError
                  ? "border-gray-400 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-800/20"
                  : "border-primary/15 dark:border-accent/15"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                    Document File {doc.file && <span className="text-gray-400 shrink-0">({(doc.file.size / 1024 / 1024).toFixed(2)} MB)</span>}
                  </span>
                  {doc.file ? (
                    <div
                      onClick={() => document.getElementById(`file-input-${doc.id}`)?.click()}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 rounded-lg p-2.5 border border-dashed border-primary/10 dark:border-accent/10 min-w-0 cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-primary/70 dark:text-accent/80 shrink-0" />
                        <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate" title={doc.file.name}>
                          {doc.file.name}
                        </span>
                      </div>
                      {idx === 0 && (
                        <div className="shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInsuranceDocuments(prev => prev.map(item => {
                                if (item.id === doc.id) {
                                  return {
                                    ...item,
                                    file: null,
                                    categories: [],
                                    customCategory: ""
                                  };
                                }
                                return item;
                              }));
                            }}
                            className="text-[10px] font-black text-red-500 hover:text-red-600 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 px-2.5 py-0.5 rounded shadow-sm transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      id={`docFile_${doc.id}`}
                      data-field-name={`docFile_${doc.id}`}
                      onClick={() => document.getElementById(`file-input-${doc.id}`)?.click()}
                      className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-2.5 transition-colors cursor-pointer select-none ${
                        fileMissingError
                          ? "border-gray-400 dark:border-gray-600 bg-gray-100/80 dark:bg-gray-800/40"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-background-dark/30 hover:bg-gray-50 dark:hover:bg-background-dark/50"
                      }`}
                    >
                      <Upload className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
                      <span className="bg-white dark:bg-background-dark text-[9px] font-black text-primary dark:text-accent border border-primary/20 dark:border-accent/20 px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 mb-1">
                        Choose File
                      </span>
                      <p className="text-[8.5px] text-gray-400 dark:text-gray-500 text-center font-semibold">
                        Drag &amp; drop files here, or browse.
                      </p>
                      <p className="text-[7.5px] text-gray-400/80 dark:text-gray-500/80 text-center mt-0.5">
                        PDF, DOC, DOCX, PNG, JPG, JPEG up to 15MB (max {MAX_INSURANCE_DOCUMENTS} files)
                      </p>
                    </div>
                  )}
                  {fileMissingError && (
                    <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-1 inline-block border border-gray-300/50">
                      {fileMissingError}
                    </p>
                  )}
                  <input
                    type="file"
                    id={`file-input-${doc.id}`}
                    accept="image/*,application/pdf,.doc,.docx"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;

                      const oversized = files.find(f => f.size > MAX_INSURANCE_DOCUMENT_SIZE);
                      if (oversized) {
                        setFieldErrors((prev) => ({ ...prev, insuranceDocument: `File "${oversized.name}" must be 15MB or smaller.` }));
                        e.target.value = "";
                        return;
                      }

                      setInsuranceDocuments(prev => {
                        const updated = prev.map(item => {
                          if (item.id === doc.id) {
                            return {
                              ...item,
                              file: files[0]
                            };
                          }
                          return item;
                        });

                        if (files.length > 1) {
                          const slotsLeft = Math.max(0, MAX_INSURANCE_DOCUMENTS - updated.length);
                          const extra = files.slice(1, 1 + slotsLeft).map(f => ({
                            id: Math.random().toString(36).substring(2, 9),
                            file: f,
                            categories: [],
                            customCategory: ""
                          }));
                          if (files.length - 1 > slotsLeft) {
                            setFieldErrors((prevErrors) => ({
                              ...prevErrors,
                              insuranceDocument: `Maximum of ${MAX_INSURANCE_DOCUMENTS} documents allowed.`,
                            }));
                          }
                          return [...updated, ...extra];
                        }

                        return updated;
                      });

                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next[`docFile_${doc.id}`];
                        const stillHasEmpty = Object.keys(next).some((k) => k.startsWith("docFile_"));
                        if (!stillHasEmpty && next.insuranceDocument?.toLowerCase().includes("empty rows")) {
                          delete next.insuranceDocument;
                        }
                        return next;
                      });

                      e.target.value = "";
                    }}
                  />
                </div>



                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setInsuranceDocuments(prev => {
                        const next = prev.filter(item => item.id !== doc.id);
                        if (next.length === 0) {
                          return [
                            {
                              id: Math.random().toString(36).substring(2, 9),
                              file: null,
                              categories: [],
                              customCategory: ""
                            }
                          ];
                        }
                        return next;
                      });
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next[`docFile_${doc.id}`];
                        delete next[`docCategory_${doc.id}`];
                        delete next[`docCustomCategory_${doc.id}`];
                        const stillHasEmpty = Object.keys(next).some((k) => k.startsWith("docFile_"));
                        if (!stillHasEmpty && next.insuranceDocument?.toLowerCase().includes("empty rows")) {
                          delete next.insuranceDocument;
                        }
                        return next;
                      });
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 self-start mt-4 shrink-0"
                    aria-label="Remove document row"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div
                id={`docCategory_${doc.id}`}
                data-field-name={`docCategory_${doc.id}`}
                className={`flex flex-col gap-1.5 rounded-md p-1.5 -mx-1.5 transition-all ${
                  fieldErrors[`docCategory_${doc.id}`]
                    ? "bg-gray-100/60 dark:bg-gray-800/20 border border-gray-400 dark:border-gray-600"
                    : ""
                }`}
              >
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
                  Document Types / Categories {doc.file && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {["FNOL", "Storm Report", "Roofer Report", "PA Report", "Other"].map((cat) => {
                    const isChecked = doc.categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          setInsuranceDocuments(prev => prev.map(item => {
                            if (item.id === doc.id) {
                              // Single-select: only one type per document. Clicking the selected one clears it.
                              const alreadySelected = item.categories.includes(cat);
                              return {
                                ...item,
                                categories: alreadySelected ? [] : [cat],
                                customCategory: cat === "Other" && !alreadySelected ? item.customCategory : "",
                              };
                            }
                            return item;
                          }));
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next[`docCategory_${doc.id}`];
                            if (cat !== "Other") delete next[`docCustomCategory_${doc.id}`];
                            // Drop the banner message if no other doc category errors remain
                            const stillHasDocCategoryErr = Object.keys(next).some(
                              (k) => k.startsWith("docCategory_") || k.startsWith("docCustomCategory_")
                            );
                            if (!stillHasDocCategoryErr && next.insuranceDocument?.includes("category")) {
                              delete next.insuranceDocument;
                            }
                            return next;
                          });
                        }}
                        className={`text-[9px] px-2 py-1 rounded-md border font-bold transition-all ${
                          isChecked
                            ? "bg-primary border-primary text-white dark:bg-accent dark:border-accent"
                            : fieldErrors[`docCategory_${doc.id}`]
                              ? "bg-gray-100 dark:bg-gray-800/40 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                              : "bg-gray-50 dark:bg-background-dark/30 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors[`docCategory_${doc.id}`] && (
                  <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">
                    {fieldErrors[`docCategory_${doc.id}`]}
                  </p>
                )}
              </div>

              {doc.categories.includes("Other") && (
                <div className="flex flex-col gap-1 animate-fadeIn">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Please specify custom type <span className="text-red-500">*</span></label>
                  <input
                    id={`docCustomCategory_${doc.id}`}
                    type="text"
                    value={doc.customCategory}
                    placeholder="e.g. Drone Photos, Roof Estimate"
                    onChange={(e) => {
                      const val = e.target.value;
                      setInsuranceDocuments(prev => prev.map(item => item.id === doc.id ? { ...item, customCategory: val } : item));
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        if (val.trim()) {
                          delete next[`docCustomCategory_${doc.id}`];
                          const stillHasDocCategoryErr = Object.keys(next).some(
                            (k) => k.startsWith("docCategory_") || k.startsWith("docCustomCategory_")
                          );
                          if (!stillHasDocCategoryErr && next.insuranceDocument?.includes("category")) {
                            delete next.insuranceDocument;
                          }
                        }
                        return next;
                      });
                    }}
                    className={`w-full text-[11px] px-2 py-1.5 border bg-white dark:bg-background-dark rounded-md outline-none focus:ring-2 focus:border-transparent transition-all ${
                      fieldErrors[`docCustomCategory_${doc.id}`]
                        ? "border-gray-400 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
                        : "border-gray-200 dark:border-gray-700 focus:ring-primary dark:focus:ring-accent"
                    }`}
                  />
                  {fieldErrors[`docCustomCategory_${doc.id}`] && (
                    <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">
                      {fieldErrors[`docCustomCategory_${doc.id}`]}
                    </p>
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => {
              setInsuranceDocuments(prev => {
                if (prev.length >= MAX_INSURANCE_DOCUMENTS) {
                  setFieldErrors((prevErrors) => ({
                    ...prevErrors,
                    insuranceDocument: `Maximum of ${MAX_INSURANCE_DOCUMENTS} documents allowed.`,
                  }));
                  return prev;
                }
                return [
                  ...prev,
                  {
                    id: Math.random().toString(36).substring(2, 9),
                    file: null,
                    categories: [],
                    customCategory: ""
                  }
                ];
              });
            }}
            disabled={insuranceDocuments.length >= MAX_INSURANCE_DOCUMENTS}
            className="bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-[10px] font-bold text-white px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Document Row
          </button>
        </div>
        {insuranceDocuments.length >= MAX_INSURANCE_DOCUMENTS && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 text-right mt-1">
            Maximum of {MAX_INSURANCE_DOCUMENTS} documents reached.
          </p>
        )}
    </div>
  );

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

      // Special routing for adjusterEmail -> contactEmails[0] (Carrier Adjuster)
      if (name === "adjusterEmail") {
        const index = prev.contactEmails.findIndex(c => c.contactType === "Adjuster (Carrier)");
        const nextEmails = [...prev.contactEmails];
        if (index > -1) {
          nextEmails[index] = { ...nextEmails[index], email: value };
        } else {
          nextEmails.unshift({ email: value, contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] });
        }
        next = { ...next, contactEmails: nextEmails };
      }

      // Auto-format Date of Loss (MM/DD/YYYY)
      if (name === "dateOfLoss") {
        let v = value.replace(/\D/g, "");
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length > 4) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
        else if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
        next = { ...prev, [name]: v };
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
      const element =
        document.getElementById(fieldName) ||
        document.querySelector(`[data-field-name="${fieldName}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof (element as HTMLElement).focus === "function") {
          (element as HTMLElement).focus();
        }
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
      const needsBuildingType = getAvailableBuildingTypes(formData.inspectionType).length > 0;
      if (!formData.inspectionType) {
        setShowErrors(true);
        const errorElement = document.querySelector("[data-field-name='inspectionType']");
        if (errorElement) errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (needsBuildingType && !formData.buildingType) {
        setShowErrors(true);
        const errorElement = document.querySelector("[data-field-name='buildingType']");
        if (errorElement) errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      setShowErrors(false);
      setCurrentStep(1);
      setMaxCompletedStep((prev) => Math.max(prev, 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Step 2: Insurance & Adjuster (merged validation)
    if (currentStep === 2) {
      const insuranceErrors = validateInsuranceStep(formData);
      const adjusterErrors = validateAdjusterStep(formData);
      const errors = { ...insuranceErrors, ...adjusterErrors };

      let hasDocErrors = false;
      let docErrorMsg = "";
      const validDocs = insuranceDocuments.filter(d => d.file !== null);
      if (insuranceDocuments.length > 1 && insuranceDocuments.some(d => !d.file)) {
        hasDocErrors = true;
        docErrorMsg = "Please upload a file for all rows, or remove empty rows.";
        for (const doc of insuranceDocuments) {
          if (!doc.file) {
            (errors as any)[`docFile_${doc.id}`] = docErrorMsg;
          }
        }
      } else {
        for (const doc of validDocs) {
          if (doc.categories.length === 0) {
            hasDocErrors = true;
            const msg = `Please select a category for the file: "${doc.file!.name}"`;
            (errors as any)[`docCategory_${doc.id}`] = msg;
            if (!docErrorMsg) docErrorMsg = msg;
          }
          if (doc.categories.includes("Other") && !doc.customCategory.trim()) {
            hasDocErrors = true;
            const msg = `Please specify custom category for the file: "${doc.file!.name}"`;
            (errors as any)[`docCustomCategory_${doc.id}`] = msg;
            if (!docErrorMsg) docErrorMsg = msg;
          }
        }
      }

      if (hasDocErrors) {
        (errors as any).insuranceDocument = docErrorMsg;
      }

      setFieldErrors(errors);
      setShowErrors(Object.keys(errors).length > 0);

      let hasStepErrors = Object.keys(errors).length > 0;

      // Validate Adjuster extra emails
      const adjRecipients = formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)");
      const { errors: adjErrs } = validateContactEmails(adjRecipients);
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
        const iaRecipients = formData.contactEmails.filter(c => c.contactType === "IA");
        if (iaRecipients.length === 0) {
          setIaEmailErrors([]);
          setIaSectionError("At least one IA email is required.");
          hasStepErrors = true;
        } else {
          const { errors: iaErrs, hasError } = validateContactEmails(iaRecipients);
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
          formData.isIAClaim ? formData.contactEmails.filter(c => c.contactType === "IA").map((_, i) => {
            const { errors: iaErrs } = validateContactEmails(formData.contactEmails.filter(c => c.contactType === "IA"));
            return iaErrs[i] || "";
          }) : [],
          formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").map((_, i) => {
            const { errors: aErrs } = validateContactEmails(formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
            return aErrs[i] || "";
          }),
          2 // step index for priority ordering
        );
        return;
      }
      setFieldErrors({});
      if (portalUser && !hasChosenPreferences) {
        const hasChanged = hasPreferencesChanged(formData, loadedPreferences, portalUser.role);
        if (hasChanged) {
          setShowPreferencesModal(true);
          return;
        } else {
          setShouldSavePreferences(false);
          setHasChosenPreferences(true);
        }
      }
    }

    // Step 3: Policy & Address (merged validation)
    if (currentStep === 3) {
      const policyErrors = validatePolicyholderStep(formData);
      const addressErrors = validateAddressStep(formData);
      const errors = { ...policyErrors, ...addressErrors };
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setShowErrors(true);
        scrollToFirstInvalidField(errors, [], [], 3);
        return;
      }
      setShowErrors(false);
      setFieldErrors({});
    }

    // Step 4: Roofer & Public Adjuster
    if (currentStep === 4) {
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
          console.info("[Step 4] Validation required. Queue initialized:", queue);

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
          console.info("[Step 4] Formatting errors detected:", errors);
          scrollToFirstInvalidField(errors);
          return;
        }
        setFieldErrors({});
      } catch (err) {
        console.error("Error during Step 4 validation:", err);
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
        setCurrentStep(0);
        const errorElement = document.querySelector("[data-field-name='inspectionType']");
        if (errorElement) errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (getAvailableBuildingTypes(formData.inspectionType).length > 0 && !formData.buildingType) {
        setShowErrors(true);
        setSubmitError("Please select a Building Type before submitting.");
        setCurrentStep(0);
        setTimeout(() => {
          document.querySelector("[data-field-name='buildingType']")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
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
        const iaRecipients = formData.contactEmails.filter(c => c.contactType === "IA");
        if (iaRecipients.length === 0) {
          setIaSectionError("At least one IA email is required.");
          hasErrors = true;
        } else {
          const { errors: iaErrors, hasError } = validateContactEmails(iaRecipients);
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
      const adjRecipients = formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)");
      const { errors: aErrors } = validateContactEmails(adjRecipients);
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
      if (fieldErrors.insuranceDocument) {
        setShowErrors(true);
        setSubmitError("Please fix the document upload error before submitting.");
        return;
      }

      let hasDocErrors = false;
      let docErrorMsg = "";
      const validDocsSubmit = insuranceDocuments.filter(d => d.file !== null);
      const docFieldErrors: Record<string, string> = {};
      if (insuranceDocuments.length > 1 && insuranceDocuments.some(d => !d.file)) {
        hasDocErrors = true;
        docErrorMsg = "Please upload a file for all rows, or remove empty rows.";
        docFieldErrors.insuranceDocument = docErrorMsg;
        for (const doc of insuranceDocuments) {
          if (!doc.file) {
            docFieldErrors[`docFile_${doc.id}`] = docErrorMsg;
          }
        }
      } else {
        for (const doc of validDocsSubmit) {
          if (doc.categories.length === 0) {
            hasDocErrors = true;
            const msg = `Please select a category for the file: "${doc.file!.name}"`;
            docFieldErrors[`docCategory_${doc.id}`] = msg;
            if (!docErrorMsg) docErrorMsg = msg;
          }
          if (doc.categories.includes("Other") && !doc.customCategory.trim()) {
            hasDocErrors = true;
            const msg = `Please specify custom category for the file: "${doc.file!.name}"`;
            docFieldErrors[`docCustomCategory_${doc.id}`] = msg;
            if (!docErrorMsg) docErrorMsg = msg;
          }
        }
        if (hasDocErrors) docFieldErrors.insuranceDocument = docErrorMsg;
      }

      if (hasDocErrors) {
        setShowErrors(true);
        setFieldErrors((prev) => ({ ...prev, ...docFieldErrors }));
        setSubmitError(docErrorMsg);
        setCurrentStep(2);
        setTimeout(() => {
          const firstKey =
            Object.keys(docFieldErrors).find((k) => k.startsWith("docFile_")) ||
            Object.keys(docFieldErrors).find((k) => k.startsWith("docCategory_") || k.startsWith("docCustomCategory_")) ||
            "insuranceDocument";
          const el = document.getElementById(firstKey) || document.querySelector('[data-field-name="insuranceDocument"]');
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }

      const functionUrl = '/api/submit-inspection';
      let submissionData = {
        ...formData,
        Primary_Client_Type: formData.primaryClientType,
        contactEmails: formData.contactEmails.map(c => ({
          ...c,
          sendCopy: c.sendCopy.filter(opt => opt !== "all")
        }))
      };

      // Strip leftover IA data when claim is not an IA claim (avoids Creator lookup 3001)
      if (!submissionData.isIAClaim) {
        submissionData.iaCompany = "";
        submissionData.iaFirstName = "";
        submissionData.iaLastName = "";
        submissionData.iaPhone = "";
        submissionData.contactEmails = submissionData.contactEmails.filter(c => c.contactType !== "IA");
      }

      // Drop empty email rows from notification subform payload
      submissionData.contactEmails = submissionData.contactEmails.filter(c => String(c.email || "").trim());

      // Ensure Zoho Creator IDs are passed for lookup fields instead of raw strings
      const matchedComp = masterInsuranceList.find(c => c.name.toLowerCase() === (submissionData.insuranceCompany || "").toLowerCase());
      if (matchedComp && matchedComp.zoho_creator_id) {
        (submissionData as any).insuranceCompanyName = submissionData.insuranceCompany;
        submissionData.insuranceCompany = matchedComp.zoho_creator_id;
      }

      const matchedIaComp = masterIaCompanyList.find(c => c.name.toLowerCase() === (submissionData.iaCompany || "").toLowerCase());
      if (matchedIaComp && matchedIaComp.zoho_creator_id) {
        (submissionData as any).iaCompanyName = submissionData.iaCompany;
        submissionData.iaCompany = matchedIaComp.zoho_creator_id;
      }

      // Option A: reject typed junk before Creator — must be list selection (or Zoho ID)
      const insuranceVal = String(submissionData.insuranceCompany || "").trim();
      if (insuranceVal && !/^\d+$/.test(insuranceVal) && !matchedComp) {
        setShowErrors(true);
        setFieldErrors((prev) => ({ ...prev, insuranceCompany: "Please select an insurance company from the list." }));
        setSubmitError("Please select an insurance company from the list.");
        return;
      }
      if (submissionData.isIAClaim) {
        const iaVal = String(submissionData.iaCompany || "").trim();
        if (iaVal && !/^\d+$/.test(iaVal) && !matchedIaComp) {
          setShowErrors(true);
          setFieldErrors((prev) => ({ ...prev, iaCompany: "Please select an IA company from the list." }));
          setSubmitError("Please select an IA company from the list.");
          return;
        }
      }

      let insuranceDocumentPayload: { fileName: string; mimeType: string; base64: string } | undefined;
      let insuranceDocumentsPayload: Array<{ fileName: string; mimeType: string; base64: string; categories: string[]; customCategory?: string }> = [];

      if (validDocsSubmit.length > 0) {
        insuranceDocumentsPayload = await Promise.all(
          validDocsSubmit.map(async (doc) => {
            const file = doc.file!;
            const b64Data = (await readInsuranceDocumentAsBase64(file)) as { base64: string };
            return {
              fileName: file.name,
              mimeType: file.type || "application/octet-stream",
              base64: b64Data.base64,
              categories: doc.categories,
              customCategory: doc.categories.includes("Other") ? doc.customCategory : undefined
            };
          })
        );
        insuranceDocumentPayload = {
          fileName: insuranceDocumentsPayload[0].fileName,
          mimeType: validDocsSubmit[0].file!.type || "application/octet-stream",
          base64: insuranceDocumentsPayload[0].base64
        };
      }

      const payloadWithDocument = insuranceDocumentsPayload.length > 0
        ? { ...submissionData, insuranceDocuments: insuranceDocumentsPayload, insuranceDocument: insuranceDocumentPayload }
        : submissionData;

      // Date of Loss is already in MM/DD/YYYY format as requested
      console.group("Form Submission Triggered");

      console.group("Form Submission Triggered");
      console.log("Payload:", payloadWithDocument);
      console.groupEnd();

      // 5. API Submission
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submitInspection', data: payloadWithDocument })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "The server encountered an error while processing your request.");
      }

      console.info("Form submitted successfully");

      // Persist preferences if portal user is logged in and chose to save/overwrite
      if (portalUser && shouldSavePreferences) {
        let preferencesToSave: any = {};
        const insuranceCompanyToSave = formData.insuranceCompany ? formData.insuranceCompany.trim() : undefined;
        const iaCompanyToSave = formData.iaCompany ? formData.iaCompany.trim() : undefined;

        if (portalUser.role === "IA") {
          preferencesToSave = {
            iaFirstName: formData.iaFirstName,
            iaLastName: formData.iaLastName,
            iaPhone: formData.iaPhone,
            iaCompany: formData.iaCompany,
            serviceAddOns: formData.serviceAddOns || [],
            contactEmails: formData.contactEmails.filter(c => c.contactType === "IA"),
          };
        } else if (portalUser.role === "Adjuster") {
          preferencesToSave = {
            adjusterFirstName: formData.adjusterFirstName,
            adjusterLastName: formData.adjusterLastName,
            adjusterPhone: formData.adjusterPhone,
            adjusterPhoneExt: formData.adjusterPhoneExt,
            adjusterCompany: formData.adjusterCompany,
            insuranceCompany: formData.insuranceCompany,
            serviceAddOns: formData.serviceAddOns || [],
            contactEmails: formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)"),
          };
        }

        const fetchBody: any = { preferences: preferencesToSave };
        if (portalUser.role === "IA" && iaCompanyToSave) {
          fetchBody.iaCompany = iaCompanyToSave;
        } else if (portalUser.role === "Adjuster" && insuranceCompanyToSave) {
          fetchBody.insuranceCompany = insuranceCompanyToSave;
        }

        if (fetchBody.iaCompany || fetchBody.insuranceCompany) {
          fetch("/api/portal/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fetchBody),
          })
            .then(res => res.json())
            .then((saveResult) => {
              if (saveResult.success) {
                console.info("User preferences saved successfully after submission");
                setLoadedPreferences(preferencesToSave);
              } else {
                console.warn("Failed to save user preferences:", saveResult.error);
              }
            })
            .catch(err => console.error("Error saving user preferences:", err));
        }

        // Layer 2: IA ya Adjuster ke liye â€” carrier adjuster contact save karo
        if ((portalUser.role === "IA" || portalUser.role === "Adjuster") && formData.contactEmails) {
          const carrierEmailEntry = formData.contactEmails.find(c => c.contactType === "Adjuster (Carrier)");
          const adjEmail = carrierEmailEntry?.email?.trim();
          if (adjEmail && formData.adjusterFirstName) {
            const contactToSave = {
              scopingCompany: formData.insuranceCompany ? formData.insuranceCompany.trim() : "",
              adjusterFirstName: formData.adjusterFirstName,
              adjusterLastName: formData.adjusterLastName,
              adjusterPhone: formData.adjusterPhone,
              adjusterPhoneExt: formData.adjusterPhoneExt,
              contactEmails: formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)"),
            };
            fetch("/api/portal/contacts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adjusterEmail: adjEmail, contact: contactToSave }),
            })
              .then(res => res.json())
              .then((contactResult) => {
                if (contactResult.success) {
                  console.info("Carrier contact saved for future autofill");
                  // Update local carrierContacts list so autofill works immediately.
                  // Identity is company name + first name + last name (not email).
                  setCarrierContacts(prev => {
                    const keyOf = (c: CarrierContact) =>
                      `${(c.scopingCompany || "").trim().toLowerCase()}|${(c.adjusterFirstName || "").trim().toLowerCase()}|${(c.adjusterLastName || "").trim().toLowerCase()}`;
                    const updated: CarrierContact = { adjusterEmail: adjEmail, ...contactToSave };
                    const updatedKey = keyOf(updated);
                    const existing = prev.findIndex(c => keyOf(c) === updatedKey);
                    if (existing > -1) {
                      const next = [...prev];
                      next[existing] = updated;
                      return next;
                    }
                    return [...prev, updated];
                  });
                }
              })
              .catch(err => console.error("Error saving carrier contact:", err));
          }
        }
      }


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
    setInsuranceDocuments([
      {
        id: "initial-row",
        file: null,
        categories: [],
        customCategory: ""
      }
    ]);
    setCurrentStep(0);
    setMaxCompletedStep(0);
    setIsSubmitted(false);
    // DISABLED: setShowPrimaryPhone2(false);
    setShowErrors(false);
    setIaEmailErrors([]);
    setIaSectionError("");
    setFieldErrors({});
    setHasChosenPreferences(false);
    setShowPreferencesModal(false);
    setShouldSavePreferences(false);
    setLoadedPreferences(null);
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
    list.find((i) => i.id === id)?.title ?? "â€”";

  /* Insurance search results come from API, not from a hardcoded list */
  const filteredInsuranceCompanies = [...insuranceSearchResults].sort((a, b) => a.name.localeCompare(b.name));

  const filteredIaCompanies = [...iaCompanySearchResults].sort((a, b) => a.name.localeCompare(b.name));

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

  const commitIaCompanyValue = (value: string) => {
    const trimmed = value.trim();
    const normalized = trimmed.toLowerCase();
    const match = masterIaCompanyList.find((c) => c.name.toLowerCase() === normalized);
    const next = match ? match.name : trimmed;
    setFormData((prev) => ({ ...prev, iaCompany: next }));
    setIaCompanyQuery(next);
    setFieldErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };
      const err = validateField("iaCompany", next, { ...formData, iaCompany: next });
      if (err) nextErrors.iaCompany = err;
      else delete nextErrors.iaCompany;
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
      case "primaryClientType":
        return ""; // Optional field
      case "insuranceCompany":
        if (!v) return "";
        if (/^\d+$/.test(v)) return "";
        if (masterInsuranceList.length > 0) {
          const match = masterInsuranceList.some((c) => c.name.toLowerCase() === v.toLowerCase());
          if (!match) return "Please select an insurance company from the list.";
        }
        return "";
      case "adjusterEmail": {
        const email = data.contactEmails.find(c => c.contactType === "Adjuster (Carrier)")?.email || "";
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
        if (!data.isIAClaim) return "";
        if (!v) return "";
        if (/^\d+$/.test(v)) return "";
        if (masterIaCompanyList.length > 0) {
          const match = masterIaCompanyList.some((c) => c.name.toLowerCase() === v.toLowerCase());
          if (!match) return "Please select an IA company from the list.";
        } else {
          return "Please select an IA company from the list.";
        }
        return "";
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
      case "dateOfLoss":
        if (!v) return "Date of Loss is required.";
        return isValidMMDDYYYY(v) ? "" : "Enter a valid date (MM/DD/YYYY).";
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
    const fields: (keyof FormData)[] = ["claimNumber", "dateOfLoss"];
    if (data.isIAClaim) {
      fields.push("iaFirstName", "iaLastName", "iaPhone");
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
    // are NOT in the backend required list â€” they must NOT block navigation.
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

    // Validate Roofer Phone â€” only if name is entered OR if number is entered
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

  /* â”€â”€ Autofill helpers for carrier adjuster suggestions â”€â”€ */
  const applyCarrierContactSuggestion = (contact: CarrierContact) => {
    // Fill adjuster fields from saved contact
    const carrierEmails = contact.contactEmails || [];
    setFormData((prev) => {
      const nonCarrierEmails = prev.contactEmails.filter(c => c.contactType !== "Adjuster (Carrier)");
      const mergedCarrierEmails: ContactEmail[] = carrierEmails.length > 0
        ? carrierEmails.map(e => ({ ...e, contactType: e.contactType as ContactEmail["contactType"] }))
        : [{ email: contact.adjusterEmail, contactType: "Adjuster (Carrier)" as ContactEmail["contactType"], sendCopy: ["all", "report", "invoice", "notifications"] }];
      return {
        ...prev,
        adjusterFirstName: contact.adjusterFirstName || prev.adjusterFirstName,
        adjusterLastName: contact.adjusterLastName || prev.adjusterLastName,
        adjusterPhone: contact.adjusterPhone || prev.adjusterPhone,
        adjusterPhoneExt: contact.adjusterPhoneExt || prev.adjusterPhoneExt,
        contactEmails: [...mergedCarrierEmails, ...nonCarrierEmails],
      };
    });
    setAdjusterSuggestions([]);
    setAdjusterSuggestField(null);
  };

  const filterAdjusterSuggestions = (field: "firstName" | "lastName" | "email", value: string) => {
    // A company must be selected first, and suggestions are scoped to that company's saved contacts.
    const selectedCompany = (formData.insuranceCompany || "").trim().toLowerCase();
    if (!value.trim() || carrierContacts.length === 0 || !selectedCompany) {
      setAdjusterSuggestions([]);
      setAdjusterSuggestField(null);
      return;
    }
    const q = value.trim().toLowerCase();
    const matches = carrierContacts.filter((c) => {
      const contactCompany = (c.scopingCompany || "").trim().toLowerCase();
      if (contactCompany !== selectedCompany) return false;
      if (field === "firstName") return (c.adjusterFirstName || "").toLowerCase().startsWith(q);
      if (field === "lastName") return (c.adjusterLastName || "").toLowerCase().startsWith(q);
      if (field === "email") return (c.adjusterEmail || "").toLowerCase().startsWith(q);
      return false;
    });
    setAdjusterSuggestions(matches.slice(0, 5));
    setAdjusterSuggestField(matches.length > 0 ? field : null);
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className={`bg-gray-50 dark:bg-background-dark ${isSubmitted ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* â”€â”€ Navbar â”€â”€ */}
      <div className="z-50">
        <Navbar />
      </div>

      {/* â”€â”€ Onboarding Tutorial Modal (IA first login) â”€â”€ */}
      {showOnboardingTutorial && portalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-section-dark rounded-2xl shadow-2xl max-w-md w-full p-6 border border-primary/20 animate-fadeIn">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                <Bookmark className="w-5 h-5 text-primary dark:text-accent" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900 dark:text-white leading-tight">Welcome to the Trinity Portal!</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Here&apos;s how your preferences work</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">Your details pre-fill automatically</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Your name, phone, company, and notification routing will appear automatically on every submission.</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">Carrier adjusters are remembered</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">The first time you add a carrier adjuster (e.g., Susan at Lititz), their details are saved. Next time, just start typing their name and they&apos;ll appear as a suggestion.</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">3</div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">Claim data is always fresh</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Claim number, date of loss, and policy number are never saved — you&apos;ll always enter these fresh for each submission.</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowOnboardingTutorial(false);
                if (typeof window !== "undefined") {
                  localStorage.setItem(`trinity_portal_tutorial_seen_${portalUser.email}`, "1");
                }
              }}
              className="w-full py-2.5 bg-primary text-white rounded-xl text-[12px] font-black hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg active:scale-95"
            >
              Got it, let&apos;s go!
            </button>
          </div>
        </div>
      )}

      <main className={`${isSubmitted ? "h-[calc(100vh-64px)] flex items-start justify-center pt-24" : "pt-20 pb-8"}`}>
        <div className={`${isSubmitted ? "max-w-xl" : "max-w-5xl"} mx-auto ${currentStep === 5 ? "px-12" : "px-6"}`}>

          {/* â”€â”€ Sticky Wrapper â€“ Only visible for Wizard Steps â”€â”€ */}
          {!isSubmitted && (
            <div className="sticky top-14 z-40 -mx-6 bg-gray-50 px-6 pb-3 pt-[0.625rem] mb-2 transition-all duration-500 dark:bg-background-dark lg:top-[75px]">
              <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center rounded-full border border-gray-200 bg-white px-1 py-0 shadow-md dark:border-gray-800 dark:bg-section-dark">
                <div className="text-center mb-0.5 flex justify-center items-center gap-2">
                  {(() => {
                    const Icon = WIZARD_STEPS[currentStep]?.icon;
                    return Icon ? <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-accent" /> : null;
                  })()}
                  <h1 className="text-base md:text-lg font-black text-gray-900 dark:text-white mb-0">
                    {WIZARD_STEPS[currentStep].title}
                  </h1>
                </div>

                {/* â”€â”€ Progress Bar â”€â”€ */}
                <StepProgressBar
                  steps={WIZARD_STEPS}
                  currentStep={currentStep}
                  onStepClick={(s) => {
                    if (s <= maxCompletedStep) goToStep(s);
                  }}
                />
              </div>
            </div>
          )}

          {/* â”€â”€ Form Card â”€â”€ */}
          <div className={`${isSubmitted ? "bg-transparent border-none shadow-none overflow-visible" : "bg-white dark:bg-section-dark rounded-xl border border-gray-200 dark:border-gray-800 p-3 shadow-md overflow-hidden"}`}>
            {isSubmitted ? (
              <SuccessMessage onReset={handleReset} />
            ) : (
              <>
                {/* =========================================== */}
                {/*  STEP 0 â€“ Inspection & Property (merged)   */}
                {/* =========================================== */}
                {currentStep === 0 && (
                  <FormSection>
                    {(() => {
                      const availableBuildingTypes = getAvailableBuildingTypes(formData.inspectionType);
                      const showBuildingType = availableBuildingTypes.length > 0;
                      return (
                        <div className={`grid grid-cols-1 gap-4 items-start animate-fadeIn ${showBuildingType ? "md:grid-cols-4" : ""}`}>
                          {/* Left: Inspection Type */}
                          <div className={`space-y-2.5 ${showBuildingType ? "md:col-span-3" : "md:col-span-4"}`}>
                            <SectionHeader title="Inspection Type" icon={ClipboardList} required />
                            <div
                              data-error-type="step1"
                              data-field-name="inspectionType"
                              className={`grid grid-cols-2 gap-2 p-2 rounded-xl transition-all ${showBuildingType ? "md:grid-cols-3" : "sm:grid-cols-3 md:grid-cols-4"} ${
                                showErrors && !formData.inspectionType
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
                                  containImage
                                  selected={formData.inspectionType === t.title}
                                  dimmed={!!formData.inspectionType && formData.inspectionType !== t.title}
                                  onSelect={() => {
                                    const nextAvailable = getAvailableBuildingTypes(t.title);
                                    const keepBuilding = nextAvailable.some((b) => b.title === formData.buildingType);
                                    setFormData({
                                      ...formData,
                                      inspectionType: t.title,
                                      buildingType: keepBuilding ? formData.buildingType : "",
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

                          {/* Right: Building Type â€” only shown if required */}
                          {showBuildingType && (
                            <div className="space-y-2.5 md:col-span-1 animate-fadeIn">
                              <SectionHeader title="Building Type" icon={Building2} required />
                              <div
                                data-field-name="buildingType"
                                className={`grid grid-cols-2 md:grid-cols-1 gap-2 p-2 rounded-xl transition-all ${
                                  showErrors && !formData.buildingType
                                    ? "bg-gray-100/50 dark:bg-gray-800/10 ring-1 ring-gray-300"
                                    : "bg-gray-50/30 dark:bg-white/5"
                                }`}
                              >
                                {availableBuildingTypes.map((b) => (
                                  <SelectCard
                                    key={b.id}
                                    label={b.title}
                                    value={b.id}
                                    image={b.image}
                                    containImage
                                    compactImage
                                    tooltip={b.tooltip}
                                    selected={formData.buildingType === b.title}
                                    dimmed={!!formData.buildingType && formData.buildingType !== b.title}
                                    onSelect={() => {
                                      setFormData({ ...formData, buildingType: b.title });
                                      setShowErrors(false);
                                    }}
                                  />
                                ))}
                              </div>
                              {showErrors && !formData.buildingType && (
                                <p className="text-gray-900 text-sm font-black mt-2 flex items-center gap-2 animate-bounce">
                                  <BadgeAlert className="w-4 h-4 text-gray-600" />
                                  Please select a building type to continue.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </FormSection>
                )}

                {/* ================================================ */}
                {/*  STEP 1 – Service Add-ons                        */}
                {/* ================================================ */}
                {currentStep === 1 && (
                  <FormSection>
                    <SectionHeader title="Service Add-ons" icon={PackagePlus} optional />
                    <ServiceAddOns
                      selectedIds={formData.serviceAddOns}
                      onChange={(selectedIds) =>
                        setFormData((prev) => ({ ...prev, serviceAddOns: selectedIds }))
                      }
                    />
                  </FormSection>
                )}

                {/* ================================================ */}
                {/*  STEP 2 – Insurance & Adjuster (merged)        */}
                {/* ================================================ */}
                {currentStep === 2 && (
                  <FormSection>
                    <div className="space-y-3 animate-fadeIn">
                      {/* IA Toggle â€” at the top */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <CheckboxToggle
                          label="There is an IA for this project"
                          checked={formData.isIAClaim}
                          onChange={(checked) => {
                            setFormData((prev) => ({
                              ...prev,
                              isIAClaim: checked,
                              // Clear leftover IA fields when toggle is turned OFF (prevents Creator lookup errors)
                              ...(checked
                                ? {}
                                : {
                                    iaCompany: "",
                                    iaFirstName: "",
                                    iaLastName: "",
                                    iaPhone: "",
                                  }),
                              contactEmails: checked
                                ? (!prev.contactEmails.some(c => c.contactType === "IA")
                                  ? [...prev.contactEmails, { email: "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] }]
                                  : prev.contactEmails)
                                : prev.contactEmails.filter(c => c.contactType !== "IA"),
                            }));
                            if (!checked) {
                              setIaCompanyQuery("");
                              setIaAliasMatch(null);
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
                            {/* LEFT COLUMN â€” IA Information */}
                            <div className="bg-primary/5 dark:bg-accent/5 rounded-lg p-2 border border-primary/20 dark:border-accent/20 space-y-3">
                              <SectionHeader title="IA Information" icon={ShieldCheck} />

                              {/* Who is the primary client â€” INSIDE IA INFO */}
                              <div className="bg-white/50 dark:bg-background-dark/50 rounded-lg p-1.5 border border-primary/10 dark:border-accent/10 space-y-1.5">
                                <SectionHeader title="Who is the primary client for this project?" icon={UserCheck} small />
                                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-1.5 transition-all`}>
                                  {[
                                    { id: "Independent Adjuster", title: "Independent Adjuster", icon: Shield },
                                    { id: "Adjuster (Carrier)", title: "Adjuster (Carrier)", icon: Building2 },
                                    { id: "The IA is the TPA", title: "The IA is the TPA", icon: Users },
                                  ].map((opt) => {
                                    const selected = formData.primaryClientType === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        id={`primaryClient-${opt.id.replace(/\s+/g, '')}`}
                                        onClick={() => {
                                          const selectedType = opt.id;
                                          setFormData((prev): FormData => {
                                            // Switching the primary client type must NOT wipe already-entered
                                            // details for either side. We only change the selected type and,
                                            // additively, make sure the relevant contact row exists.
                                            let contactEmails = [...prev.contactEmails];

                                            if (selectedType === "Adjuster (Carrier)") {
                                              // Keep IA details/emails intact; just ensure a Carrier contact row exists.
                                              const hasCarrier = contactEmails.some(c => c.contactType === "Adjuster (Carrier)");
                                              if (!hasCarrier) {
                                                contactEmails = [
                                                  { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] },
                                                  ...contactEmails,
                                                ];
                                              }
                                              return {
                                                ...prev,
                                                primaryClientType: selectedType as FormData["primaryClientType"],
                                                contactEmails,
                                              };
                                            }

                                            if (selectedType === "The IA is the TPA") {
                                              // IA is also the desk/carrier adjuster: ensure IA contact row exists,
                                              // then mirror all IA info into carrier/adjuster fields.
                                              const nameParts = (portalUser?.name || "").trim().split(/\s+/).filter(Boolean);
                                              const iaFirst = nameParts.length > 0 ? nameParts[0] : "";
                                              const iaLast = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                                              const hasIa = contactEmails.some(c => c.contactType === "IA");
                                              if (!hasIa) {
                                                contactEmails = [
                                                  ...contactEmails,
                                                  { email: portalUser?.email || "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] },
                                                ];
                                              }
                                              return syncCarrierFieldsFromIa({
                                                ...prev,
                                                primaryClientType: selectedType as FormData["primaryClientType"],
                                                iaFirstName: prev.iaFirstName || iaFirst,
                                                iaLastName: prev.iaLastName || iaLast,
                                                contactEmails,
                                              });
                                            }

                                            // Independent Adjuster: keep Carrier details/emails intact. Only ensure an
                                            // IA contact row exists and prefill the IA name from login if it's still empty.
                                            const nameParts = (portalUser?.name || "").trim().split(/\s+/).filter(Boolean);
                                            const iaFirst = nameParts.length > 0 ? nameParts[0] : "";
                                            const iaLast = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                                            const hasIa = contactEmails.some(c => c.contactType === "IA");
                                            if (!hasIa) {
                                              contactEmails = [
                                                ...contactEmails,
                                                { email: portalUser?.email || "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] },
                                              ];
                                            }
                                            return {
                                              ...prev,
                                              primaryClientType: selectedType as FormData["primaryClientType"],
                                              iaFirstName: prev.iaFirstName || iaFirst,
                                              iaLastName: prev.iaLastName || iaLast,
                                              contactEmails,
                                            };
                                          });
                                          setFieldErrors(prev => {
                                            const next = { ...prev };
                                            delete next.primaryClientType;
                                            return next;
                                          });
                                        }}
                                        className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all text-left ${selected
                                            ? "border-primary bg-primary/5 dark:bg-accent/5 ring-1 ring-primary shadow-sm"
                                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark hover:border-gray-300 hover:shadow-sm"
                                          }`}
                                      >
                                        <div className={`p-1 rounded-full shrink-0 ${selected ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                                          <opt.icon className="w-3 h-3" />
                                        </div>
                                        <span className={`text-[10px] font-black leading-tight ${selected ? "text-primary dark:text-accent" : "text-gray-700 dark:text-gray-300"}`}>
                                          {opt.title}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Row 1: IA Company Name (full width) â€” lookup list, same as live schedule portal */}
                              <div className="grid grid-cols-1">
                                <div className="space-y-0.5 relative">
                                  <label htmlFor="iaCompany" className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                    <Building2 className="text-primary dark:text-accent w-3 h-3" />
                                    IA Company Name
                                  </label>
                                  <div className="relative">
                                    <input
                                      id="iaCompany"
                                      name="iaCompany"
                                      value={iaCompanyQuery}
                                      onChange={(e) => {
                                        const next = e.target.value;
                                        setIaCompanyQuery(next);
                                        setFormData((prev) => ({ ...prev, iaCompany: next }));
                                        setFieldErrors((prevErrors) => {
                                          const nextErrors = { ...prevErrors };
                                          const err = validateField("iaCompany", next, { ...formData, iaCompany: next });
                                          if (err) nextErrors.iaCompany = err;
                                          else delete nextErrors.iaCompany;
                                          return nextErrors;
                                        });
                                        setIaCompanyOpen(true);
                                        searchIaCompanies(next);
                                      }}
                                      onFocus={(e) => {
                                        e.target.select();
                                        setIaCompanyOpen(true);
                                        searchIaCompanies("");
                                      }}
                                      onBlur={() => {
                                        setTimeout(() => setIaCompanyOpen(false), 200);
                                        commitIaCompanyValue(iaCompanyQuery);
                                      }}
                                      placeholder="Search and select a company..."
                                      className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${fieldErrors.iaCompany
                                        ? "border-gray-300 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
                                        : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
                                        }`}
                                    />
                                    {iaCompanySearchLoading && (
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  {fieldErrors.iaCompany && (
                                    <p className="text-[10px] text-gray-900 font-black -mt-0.5">{fieldErrors.iaCompany}</p>
                                  )}
                                  {iaCompanyOpen && (
                                    <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-section-dark shadow-lg">
                                      {iaAliasMatch && !iaAliasDismissed && (
                                        <div className="p-2 border-b border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/40">
                                          <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                              <p className="text-[11px] text-orange-800 dark:text-orange-200 font-bold leading-tight">
                                                Did you mean: <span className="underline italic">{iaAliasMatch.results[0].name}</span>?
                                              </p>
                                              <div className="flex gap-2 mt-1.5">
                                                <button
                                                  type="button"
                                                  onMouseDown={(e) => e.preventDefault()}
                                                  onClick={() => {
                                                    commitIaCompanyValue(iaAliasMatch.results[0].name);
                                                    setIaAliasMatch(null);
                                                    setIaCompanyOpen(false);
                                                  }}
                                                  className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded hover:bg-orange-700 transition-colors"
                                                >
                                                  Use Suggestion
                                                </button>
                                                <button
                                                  type="button"
                                                  onMouseDown={(e) => e.preventDefault()}
                                                  onClick={() => setIaAliasDismissed(true)}
                                                  className="px-2 py-0.5 border border-orange-300 text-orange-700 text-[10px] font-bold rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                                                >
                                                  Dismiss
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                          setIaCompanyOpen(false);
                                          setAddCompanyType('IA Company');
                                          setIsAddCompanyModalOpen(true);
                                        }}
                                        className="w-full text-left px-3 py-2 text-[11px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
                                      >
                                        Add New Company
                                        <Building2 className="w-3.5 h-3.5" />
                                      </button>
                                      {iaCompanySearchLoading && filteredIaCompanies.length === 0 ? (
                                        <div className="p-4 flex flex-col items-center justify-center gap-2 text-gray-400">
                                          <Loader2 className="w-5 h-5 animate-spin" />
                                          <p className="text-[10px]">Searching...</p>
                                        </div>
                                      ) : filteredIaCompanies.length > 0 ? (
                                        filteredIaCompanies.map((c) => (
                                          <button
                                            key={c.id}
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => {
                                              commitIaCompanyValue(c.name);
                                              setIaAliasMatch(null);
                                              setIaCompanyOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${formData.iaCompany === c.name ? "font-bold text-primary dark:text-accent" : "text-gray-700 dark:text-gray-200"}`}
                                          >
                                            {c.name}
                                          </button>
                                        ))
                                      ) : iaCompanyQuery && !iaCompanySearchLoading ? (
                                        <div className="p-3 text-center text-gray-500 text-[10px]">
                                          No matches found.
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
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
                                  required
                                  invalid={!!fieldErrors.iaPhone}
                                  error={fieldErrors.iaPhone}
                                />
                              </div>

                              {/* Row 4: Primary IA Email (full width) */}
                              <div className="space-y-2 pt-2 border-t border-primary/10 dark:border-accent/10">
                                <SectionHeader title="Primary IA Email" icon={Mail} />
                                <div className="space-y-2">
                                  {formData.contactEmails.filter(c => c.contactType === "IA").map((recipient, localIndex) => {
                                    const absoluteIndex = formData.contactEmails.findIndex((c, i) =>
                                      c.contactType === "IA" && formData.contactEmails.filter((cc, ii) => cc.contactType === "IA" && ii < i).length === localIndex
                                    );
                                    return (
                                      <div key={localIndex} id={`ia-recipient-${localIndex}`} className={`rounded-lg border p-1.5 bg-gray-50 dark:bg-background-dark/60 ${iaEmailErrors[localIndex] ? "border-gray-400 bg-gray-100/60 dark:bg-gray-800/20" : "border-gray-200 dark:border-gray-700"}`}>
                                        <div className="space-y-2">
                                          <InputField label={`IA Email ${formData.contactEmails.filter(c => c.contactType === "IA").length > 1 ? `#${localIndex + 1}` : ""}`} name={`iaRecipientEmail_${localIndex}`} value={recipient.email} onChange={(e) => {
                                            const nextEmails = [...formData.contactEmails];
                                            nextEmails[absoluteIndex] = { ...nextEmails[absoluteIndex], email: e.target.value };
                                            setFormData({ ...formData, contactEmails: nextEmails });
                                            const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "IA"));
                                            setIaEmailErrors(errors);
                                            setIaSectionError("");
                                          }} type="email" placeholder="ia@company.com" icon={Mail} required={localIndex === 0} />

                                          {/* Send copy of â€” multi-select checkboxes */}
                                          <div>
                                            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                            <div className="flex flex-wrap gap-2">
                                              {SEND_COPY_OPTIONS.map((opt) => {
                                                const checked = recipient.sendCopy.includes(opt);
                                                return (
                                                  <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                                    <input type="checkbox" checked={checked} onChange={() => {
                                                      let next: string[];
                                                      if (opt === "all") {
                                                        next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                                      } else {
                                                        if (checked) {
                                                          next = recipient.sendCopy.filter((o) => o !== opt && o !== "all");
                                                        } else {
                                                          next = [...recipient.sendCopy.filter((o) => o !== "all"), opt];
                                                          if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                            next = ["all", ...next];
                                                          }
                                                        }
                                                      }
                                                      const nextEmails = [...formData.contactEmails];
                                                      nextEmails[absoluteIndex] = { ...nextEmails[absoluteIndex], sendCopy: next };
                                                      setFormData({ ...formData, contactEmails: nextEmails });
                                                    }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                                    <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          {formData.contactEmails.filter(c => c.contactType === "IA").length > 1 && localIndex !== 0 && (
                                            <button type="button" onClick={() => {
                                              const nextEmails = formData.contactEmails.filter((_, i) => i !== absoluteIndex);
                                              setFormData({ ...formData, contactEmails: nextEmails });
                                              const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "IA"));
                                              setIaEmailErrors(errors);
                                            }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                              <X className="w-3 h-3" />
                                              Remove
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (formData.contactEmails.filter(c => c.contactType === "IA").length >= MAX_IA_EMAILS) return;
                                        const nextEmails: ContactEmail[] = [...formData.contactEmails, { email: "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] }];
                                        setFormData({ ...formData, contactEmails: nextEmails });
                                        const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "IA"));
                                        setIaEmailErrors(errors);
                                        setIaSectionError("");
                                        const index = nextEmails.filter(c => c.contactType === "IA").length - 1;
                                        setTimeout(() => { const el = document.getElementById(`ia-recipient-${index}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0);
                                      }}
                                      disabled={formData.contactEmails.filter(c => c.contactType === "IA").length >= MAX_IA_EMAILS}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      Add another email
                                    </button>
                                  </div>
                                  {iaSectionError && (<p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">{iaSectionError}</p>)}
                                  {formData.contactEmails.filter(c => c.contactType === "IA").length >= MAX_IA_EMAILS && (<p className="text-[11px] text-gray-500 dark:text-gray-400">Maximum of {MAX_IA_EMAILS} IA email recipients reached.</p>)}
                                </div>
                              </div>

                              {renderInsuranceDocumentUpload()}
                            </div>

                            {/* RIGHT COLUMN â€” Insurance & Adjuster */}
                            <div className="space-y-3">
                              {/* Insurance Carrier */}
                              <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                                <SectionHeader title="Insurance Carrier" icon={Shield} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* Insurance Company Search */}
                                  <div className="space-y-0.5 relative">
                                    <label htmlFor="insuranceCompany" className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                      <Building2 className="text-primary dark:text-accent w-3 h-3" />
                                      Company Name <span className="text-gray-400 font-normal"></span>
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
                                        onFocus={(e) => {
                                          e.target.select();
                                          setInsuranceCompanyOpen(true);
                                          searchInsuranceCompanies("");
                                        }}
                                        onBlur={() => {
                                          setTimeout(() => setInsuranceCompanyOpen(false), 200);
                                          commitInsuranceCompanyValue(insuranceCompanyQuery);
                                        }}
                                        placeholder="Search or type a company..."
                                        className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${fieldErrors.insuranceCompany
                                          ? "border-gray-400 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
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
                                      <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">{fieldErrors.insuranceCompany}</p>
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
                                  <DatePicker
                                    label="Date of Loss"
                                    name="dateOfLoss"
                                    value={formData.dateOfLoss}
                                    onChange={handleChange}
                                    invalid={!!fieldErrors.dateOfLoss}
                                    error={fieldErrors.dateOfLoss}
                                    required
                                  />
                                </div>
                              </div>
                              {/* Adjuster Details */}
                              <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                                <SectionHeader title={formData.isIAClaim ? "Carrier Adjuster Details" : "Adjuster Details"} icon={Gavel} />
                                {/* Adjuster Company Name â€” hidden for now, restore when needed
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <InputField label="Adjuster Company Name" name="adjusterCompany" value={formData.adjusterCompany} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                                </div>
                                */}
                                 {/* First Name + Last Name with autofill suggestions (IA and Adjuster users) */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                   <div className="relative">
                                     <InputField
                                       label="First Name"
                                       name="adjusterFirstName"
                                       value={formData.adjusterFirstName}
                                       onChange={(e) => {
                                         setFormData({ ...formData, adjusterFirstName: e.target.value });
                                         if (portalUser?.role === "IA" || portalUser?.role === "Adjuster") filterAdjusterSuggestions("firstName", e.target.value);
                                       }}
                                       placeholder="First Name"
                                       required
                                       icon={UserRound}
                                       invalid={!!fieldErrors.adjusterFirstName}
                                       error={fieldErrors.adjusterFirstName}
                                     />
                                     {adjusterSuggestField === "firstName" && adjusterSuggestions.length > 0 && (
                                       <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white dark:bg-section-dark border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                                         {adjusterSuggestions.map((contact) => (
                                           <button key={contact.adjusterEmail} type="button"
                                             className="w-full text-left px-3 py-2 hover:bg-primary/5 dark:hover:bg-accent/5 border-b border-gray-100 dark:border-gray-800 last:border-none"
                                             onClick={() => applyCarrierContactSuggestion(contact)}>
                                             <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{contact.adjusterFirstName} {contact.adjusterLastName}</p>
                                             <p className="text-[10px] text-gray-500 dark:text-gray-400">{contact.adjusterEmail}</p>
                                           </button>
                                         ))}
                                       </div>
                                     )}
                                   </div>
                                   <div className="relative">
                                     <InputField
                                       label="Last Name"
                                       name="adjusterLastName"
                                       value={formData.adjusterLastName}
                                       onChange={(e) => {
                                         setFormData({ ...formData, adjusterLastName: e.target.value });
                                         if (portalUser?.role === "IA" || portalUser?.role === "Adjuster") filterAdjusterSuggestions("lastName", e.target.value);
                                       }}
                                       placeholder="Last Name"
                                       required
                                       icon={UserRound}
                                       invalid={!!fieldErrors.adjusterLastName}
                                       error={fieldErrors.adjusterLastName}
                                     />
                                     {adjusterSuggestField === "lastName" && adjusterSuggestions.length > 0 && (
                                       <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white dark:bg-section-dark border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                                         {adjusterSuggestions.map((contact) => (
                                           <button key={contact.adjusterEmail} type="button"
                                             className="w-full text-left px-3 py-2 hover:bg-primary/5 dark:hover:bg-accent/5 border-b border-gray-100 dark:border-gray-800 last:border-none"
                                             onClick={() => applyCarrierContactSuggestion(contact)}>
                                             <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{contact.adjusterFirstName} {contact.adjusterLastName}</p>
                                             <p className="text-[10px] text-gray-500 dark:text-gray-400">{contact.adjusterEmail}</p>
                                           </button>
                                         ))}
                                       </div>
                                     )}
                                   </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                   <PhoneInputField label="Adjuster Phone" name="adjusterPhone" value={formData.adjusterPhone} onChange={(e) => setFormData({ ...formData, adjusterPhone: e.target.value })} required invalid={!!fieldErrors.adjusterPhone} error={fieldErrors.adjusterPhone} />
                                   <InputField label="Phone Extension" name="adjusterPhoneExt" value={formData.adjusterPhoneExt} onChange={(e) => setFormData({ ...formData, adjusterPhoneExt: e.target.value })} placeholder="Ext. 123" icon={Hash} invalid={!!fieldErrors.adjusterPhoneExt} error={fieldErrors.adjusterPhoneExt} />
                                 </div>

                                 <div className="relative mt-3">
                                   <InputField
                                     label={`Adjuster Email ${formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length > 1 ? "#1" : ""}`}
                                     name="adjusterEmail"
                                     value={formData.contactEmails.find(c => c.contactType === "Adjuster (Carrier)")?.email || ""}
                                     onChange={(e) => {
                                       const index = formData.contactEmails.findIndex(c => c.contactType === "Adjuster (Carrier)");
                                       const nextEmails = [...formData.contactEmails];
                                       if (index > -1) {
                                         nextEmails[index] = { ...nextEmails[index], email: e.target.value };
                                       } else {
                                         nextEmails.unshift({ email: e.target.value, contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] });
                                       }
                                       setFormData({ ...formData, contactEmails: nextEmails });
                                       if (portalUser?.role === "IA" || portalUser?.role === "Adjuster") filterAdjusterSuggestions("email", e.target.value);
                                     }}
                                     type="email"
                                     placeholder="adjuster@carrier.com"
                                     required
                                     icon={Mail}
                                     invalid={!!fieldErrors.adjusterEmail}
                                     error={fieldErrors.adjusterEmail}
                                   />
                                   {adjusterSuggestField === "email" && adjusterSuggestions.length > 0 && (
                                     <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white dark:bg-section-dark border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                                       {adjusterSuggestions.map((contact) => (
                                         <button key={contact.adjusterEmail} type="button"
                                           className="w-full text-left px-3 py-2 hover:bg-primary/5 dark:hover:bg-accent/5 border-b border-gray-100 dark:border-gray-800 last:border-none"
                                           onClick={() => applyCarrierContactSuggestion(contact)}>
                                           <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{contact.adjusterFirstName} {contact.adjusterLastName}</p>
                                           <p className="text-[10px] text-gray-500 dark:text-gray-400">{contact.adjusterEmail}</p>
                                         </button>
                                       ))}
                                     </div>
                                   )}
                                 </div>

                                {/* Send copy of for primary Adjuster */}
                                <div className="mt-1 ml-1">
                                  <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                  <div className="flex flex-wrap gap-2">
                                    {SEND_COPY_OPTIONS.map((opt) => {
                                      const primaryAdjuster = formData.contactEmails.find(c => c.contactType === "Adjuster (Carrier)");
                                      const checked = primaryAdjuster?.sendCopy.includes(opt) || false;
                                      return (
                                        <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                          <input type="checkbox" checked={checked} onChange={() => {
                                            const index = formData.contactEmails.findIndex(c => c.contactType === "Adjuster (Carrier)");
                                            if (index === -1) return;

                                            let next: string[];
                                            if (opt === "all") {
                                              next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                            } else {
                                              if (checked) {
                                                next = formData.contactEmails[index].sendCopy.filter((o) => o !== opt && o !== "all");
                                              } else {
                                                next = [...formData.contactEmails[index].sendCopy.filter((o) => o !== "all"), opt];
                                                if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                  next = ["all", ...next];
                                                }
                                              }
                                            }
                                            const nextEmails = [...formData.contactEmails];
                                            nextEmails[index] = { ...nextEmails[index], sendCopy: next };
                                            setFormData({ ...formData, contactEmails: nextEmails });
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
                                    {(() => {
                                      const adjRecipients = formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)");
                                      return adjRecipients.slice(1).map((recipient, localIdx) => {
                                        const localIndex = localIdx + 1; // local index in filtered Adjuster array
                                        const absoluteIndex = formData.contactEmails.findIndex((c, i) =>
                                          c.contactType === "Adjuster (Carrier)" && formData.contactEmails.filter((cc, ii) => cc.contactType === "Adjuster (Carrier)" && ii < i).length === localIndex
                                        );

                                        return (
                                          <div key={localIndex} id={`adj-recipient-${localIndex}`} className={`rounded-lg border p-1.5 bg-gray-50 dark:bg-background-dark/60 ${adjusterEmailErrors[localIndex] ? "border-gray-400 bg-gray-100/60 dark:bg-gray-800/20" : "border-gray-200 dark:border-gray-700"}`}>
                                            <div className="space-y-2">
                                              <InputField label={`Adjuster Email ${adjRecipients.length > 1 ? `#${localIndex + 1}` : ""}`} name={`adjRecipientEmail_${localIndex}`} value={recipient.email} onChange={(e) => {
                                                const nextEmails = [...formData.contactEmails];
                                                nextEmails[absoluteIndex] = { ...nextEmails[absoluteIndex], email: e.target.value };
                                                setFormData({ ...formData, contactEmails: nextEmails });
                                                const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
                                                setAdjusterEmailErrors(errors);
                                                setAdjusterSectionError("");
                                              }} type="email" placeholder="additional@company.com" icon={Mail} />

                                              {/* Send copy of â€” multi-select checkboxes */}
                                              <div>
                                                <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                                <div className="flex flex-wrap gap-2">
                                                  {SEND_COPY_OPTIONS.map((opt) => {
                                                    const checked = recipient.sendCopy.includes(opt);
                                                    return (
                                                      <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                                        <input type="checkbox" checked={checked} onChange={() => {
                                                          let next: string[];
                                                          if (opt === "all") {
                                                            next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                                          } else {
                                                            if (checked) {
                                                              next = recipient.sendCopy.filter((o) => o !== opt && o !== "all");
                                                            } else {
                                                              next = [...recipient.sendCopy.filter((o) => o !== "all"), opt];
                                                              if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                                next = ["all", ...next];
                                                              }
                                                            }
                                                          }
                                                          const nextEmails = [...formData.contactEmails];
                                                          nextEmails[absoluteIndex] = { ...nextEmails[absoluteIndex], sendCopy: next };
                                                          setFormData({ ...formData, contactEmails: nextEmails });
                                                        }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                                        <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              </div>

                                              <button type="button" onClick={() => {
                                                const nextEmails = formData.contactEmails.filter((_, i) => i !== absoluteIndex);
                                                setFormData({ ...formData, contactEmails: nextEmails });
                                                const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
                                                setAdjusterEmailErrors(errors);
                                              }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                <X className="w-3 h-3" />
                                                Remove
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      });
                                    })()}
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length >= MAX_ADJ_EMAILS) return;
                                          const nextEmails: ContactEmail[] = [...formData.contactEmails, { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] }];
                                          setFormData({ ...formData, contactEmails: nextEmails });
                                          const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
                                          setAdjusterEmailErrors(errors);
                                          setAdjusterSectionError("");
                                          const index = nextEmails.filter(c => c.contactType === "Adjuster (Carrier)").length - 1;
                                          setTimeout(() => { const el = document.getElementById(`adj-recipient-${index}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
                                        }}
                                        disabled={formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length >= MAX_ADJ_EMAILS}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Another Email
                                      </button>
                                    </div>
                                    {adjusterSectionError && (<p className="text-xs text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-300/50 mt-1 inline-block">{adjusterSectionError}</p>)}
                                    {formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length >= MAX_ADJ_EMAILS && (<p className="text-[11px] text-gray-500 dark:text-gray-400">Maximum of {MAX_ADJ_EMAILS} additional emails reached.</p>)}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label htmlFor="adjusterComments" className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                    <MessageSquare className="text-primary dark:text-accent w-3.5 h-3.5" />
                                    Client Notes &amp; Comments
                                  </label>
                                  <textarea
                                    id="adjusterComments"
                                    name="adjusterComments"
                                    value={formData.adjusterComments}
                                    onChange={handleChange}
                                    rows={1}
                                    placeholder="Add any additional information"
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
                          {/* LEFT COLUMN â€” Insurance */}
                          <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                            <SectionHeader title="Insurance Carrier" icon={Shield} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-0.5 relative">
                                <label htmlFor="insuranceCompany" className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                  <Building2 className="text-primary dark:text-accent w-3 h-3" />
                                  Company Name <span className="text-gray-400 font-normal"></span>
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
                                      ? "border-gray-400 focus:ring-gray-300 dark:border-gray-600 dark:focus:ring-gray-600"
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
                                  <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">{fieldErrors.insuranceCompany}</p>
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

                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setInsuranceCompanyOpen(false); setAddCompanyType('Insurance Company'); setIsAddCompanyModalOpen(true); }} className="w-full text-left px-3 py-2 text-[11px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
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
                              <div className="space-y-0.5">
                                <DatePicker
                                  label="Date of Loss"
                                  name="dateOfLoss"
                                  value={formData.dateOfLoss}
                                  onChange={handleChange}
                                  invalid={!!fieldErrors.dateOfLoss}
                                  error={fieldErrors.dateOfLoss}
                                  required
                                />
                              </div>
                            </div>
                            {renderInsuranceDocumentUpload("!mt-6 pt-2")}
                          </div>

                          {/* RIGHT COLUMN â€” Adjuster */}
                          <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                            <SectionHeader title={formData.isIAClaim ? "Carrier Adjuster Details" : "Adjuster Details"} icon={Gavel} />
                            {/* Adjuster Company Name â€” hidden for now, restore when needed
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <InputField label="Adjuster Company Name" name="adjusterCompany" value={formData.adjusterCompany} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                            </div>
                            */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="relative">
                                <InputField
                                  label="First Name"
                                  name="adjusterFirstName"
                                  value={formData.adjusterFirstName}
                                  onChange={(e) => {
                                    setFormData({ ...formData, adjusterFirstName: e.target.value });
                                    if (portalUser?.role === "IA" || portalUser?.role === "Adjuster") filterAdjusterSuggestions("firstName", e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  placeholder="First Name"
                                  required
                                  icon={UserRound}
                                  invalid={!!fieldErrors.adjusterFirstName}
                                  error={fieldErrors.adjusterFirstName}
                                />
                                {adjusterSuggestField === "firstName" && adjusterSuggestions.length > 0 && (
                                  <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white dark:bg-section-dark border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                                    {adjusterSuggestions.map((contact) => (
                                      <button key={contact.adjusterEmail} type="button"
                                        className="w-full text-left px-3 py-2 hover:bg-primary/5 dark:hover:bg-accent/5 border-b border-gray-100 dark:border-gray-800 last:border-none"
                                        onClick={() => applyCarrierContactSuggestion(contact)}>
                                        <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{contact.adjusterFirstName} {contact.adjusterLastName}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{contact.adjusterEmail}</p>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="relative">
                                <InputField
                                  label="Last Name"
                                  name="adjusterLastName"
                                  value={formData.adjusterLastName}
                                  onChange={(e) => {
                                    setFormData({ ...formData, adjusterLastName: e.target.value });
                                    if (portalUser?.role === "IA" || portalUser?.role === "Adjuster") filterAdjusterSuggestions("lastName", e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  placeholder="Last Name"
                                  required
                                  icon={UserRound}
                                  invalid={!!fieldErrors.adjusterLastName}
                                  error={fieldErrors.adjusterLastName}
                                />
                                {adjusterSuggestField === "lastName" && adjusterSuggestions.length > 0 && (
                                  <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white dark:bg-section-dark border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                                    {adjusterSuggestions.map((contact) => (
                                      <button key={contact.adjusterEmail} type="button"
                                        className="w-full text-left px-3 py-2 hover:bg-primary/5 dark:hover:bg-accent/5 border-b border-gray-100 dark:border-gray-800 last:border-none"
                                        onClick={() => applyCarrierContactSuggestion(contact)}>
                                        <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{contact.adjusterFirstName} {contact.adjusterLastName}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{contact.adjusterEmail}</p>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <PhoneInputField label="Adjuster Phone" name="adjusterPhone" value={formData.adjusterPhone} onChange={handleChange} onBlur={handleBlur} required invalid={!!fieldErrors.adjusterPhone} error={fieldErrors.adjusterPhone} />
                              <InputField label="Phone Extension" name="adjusterPhoneExt" value={formData.adjusterPhoneExt} onChange={handleChange} placeholder="Ext. 123" icon={Hash} invalid={!!fieldErrors.adjusterPhoneExt} error={fieldErrors.adjusterPhoneExt} />
                            </div>
                            <div className="grid grid-cols-1">
                              <InputField
                                label="Adjuster Email"
                                name="adjusterEmail"
                                value={formData.contactEmails.find(c => c.contactType === "Adjuster (Carrier)")?.email || ""}
                                onChange={(e) => {
                                  const index = formData.contactEmails.findIndex(c => c.contactType === "Adjuster (Carrier)");
                                  const nextEmails = [...formData.contactEmails];
                                  if (index > -1) {
                                    nextEmails[index] = { ...nextEmails[index], email: e.target.value };
                                  } else {
                                    nextEmails.unshift({ email: e.target.value, contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] });
                                  }
                                  setFormData({ ...formData, contactEmails: nextEmails });
                                  if (portalUser?.role === "IA" || portalUser?.role === "Adjuster") filterAdjusterSuggestions("email", e.target.value);
                                }}
                                type="email"
                                placeholder="adjuster@insurance.com"
                                required
                                icon={Mail}
                                invalid={!!fieldErrors.adjusterEmail}
                                error={fieldErrors.adjusterEmail}
                              />
                              {adjusterSuggestField === "email" && adjusterSuggestions.length > 0 && (
                                <div className="absolute left-0 top-full mt-1 z-50 w-full bg-white dark:bg-section-dark border border-primary/20 rounded-lg shadow-lg overflow-hidden">
                                  {adjusterSuggestions.map((contact) => (
                                    <button key={contact.adjusterEmail} type="button"
                                      className="w-full text-left px-3 py-2 hover:bg-primary/5 dark:hover:bg-accent/5 border-b border-gray-100 dark:border-gray-800 last:border-none"
                                      onClick={() => applyCarrierContactSuggestion(contact)}>
                                      <p className="text-[11px] font-semibold text-gray-900 dark:text-white">{contact.adjusterFirstName} {contact.adjusterLastName}</p>
                                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{contact.adjusterEmail}</p>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Send copy of for primary Adjuster */}
                            <div className="mt-1 ml-1">
                              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                              <div className="flex flex-wrap gap-2">
                                {SEND_COPY_OPTIONS.map((opt) => {
                                  const primaryAdjuster = formData.contactEmails.find(c => c.contactType === "Adjuster (Carrier)");
                                  const checked = primaryAdjuster?.sendCopy.includes(opt) || false;
                                  return (
                                    <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                      <input type="checkbox" checked={checked} onChange={() => {
                                        const index = formData.contactEmails.findIndex(c => c.contactType === "Adjuster (Carrier)");
                                        if (index === -1) return;

                                        let next: string[];
                                        if (opt === "all") {
                                          next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                        } else {
                                          if (checked) {
                                            next = formData.contactEmails[index].sendCopy.filter((o) => o !== opt && o !== "all");
                                          } else {
                                            next = [...formData.contactEmails[index].sendCopy.filter((o) => o !== "all"), opt];
                                            if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                              next = ["all", ...next];
                                            }
                                          }
                                        }
                                        const nextEmails = [...formData.contactEmails];
                                        nextEmails[index] = { ...nextEmails[index], sendCopy: next };
                                        setFormData({ ...formData, contactEmails: nextEmails });
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
                                {(() => {
                                  const adjRecipients = formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)");
                                  return adjRecipients.slice(1).map((recipient, localIdx) => {
                                    const localIndex = localIdx + 1; // local index in filtered Adjuster array
                                    const absoluteIndex = formData.contactEmails.findIndex((c, i) =>
                                      c.contactType === "Adjuster (Carrier)" && formData.contactEmails.filter((cc, ii) => cc.contactType === "Adjuster (Carrier)" && ii < i).length === localIndex
                                    );

                                    return (
                                      <div key={localIndex} id={`adj-recipient-${localIndex}`} className={`rounded-lg border p-1.5 bg-gray-50 dark:bg-background-dark/60 ${adjusterEmailErrors[localIndex] ? "border-gray-400 bg-gray-100/60 dark:bg-gray-800/20" : "border-gray-200 dark:border-gray-700"}`}>
                                        <div className="space-y-2">
                                          <InputField label={`Additional Adjuster Email ${adjRecipients.length > 1 ? `#${localIndex}` : ""}`} name={`adjRecipientEmail_${localIndex}`} value={recipient.email} onChange={(e) => {
                                            const nextEmails = [...formData.contactEmails];
                                            nextEmails[absoluteIndex] = { ...nextEmails[absoluteIndex], email: e.target.value };
                                            setFormData({ ...formData, contactEmails: nextEmails });
                                            const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
                                            setAdjusterEmailErrors(errors);
                                            setAdjusterSectionError("");
                                          }} type="email" placeholder="additional@company.com" icon={Mail} />

                                          {/* Send copy of â€” multi-select checkboxes */}
                                          <div>
                                            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Send copy of</p>
                                            <div className="flex flex-wrap gap-2">
                                              {SEND_COPY_OPTIONS.map((opt) => {
                                                const checked = recipient.sendCopy.includes(opt);
                                                return (
                                                  <label key={opt} className="flex items-center gap-1 cursor-pointer select-none">
                                                    <input type="checkbox" checked={checked} onChange={() => {
                                                      let next: string[];
                                                      if (opt === "all") {
                                                        next = checked ? [] : ["all", "report", "invoice", "notifications"];
                                                      } else {
                                                        if (checked) {
                                                          next = recipient.sendCopy.filter((o) => o !== opt && o !== "all");
                                                        } else {
                                                          next = [...recipient.sendCopy.filter((o) => o !== "all"), opt];
                                                          if (next.includes("report") && next.includes("invoice") && next.includes("notifications")) {
                                                            next = ["all", ...next];
                                                          }
                                                        }
                                                      }
                                                      const nextEmails = [...formData.contactEmails];
                                                      nextEmails[absoluteIndex] = { ...nextEmails[absoluteIndex], sendCopy: next };
                                                      setFormData({ ...formData, contactEmails: nextEmails });
                                                    }} className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary" />
                                                    <span className="text-[10px] text-gray-700 dark:text-gray-300 capitalize">{opt === "all" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                                                  </label>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          <button type="button" onClick={() => {
                                            const nextEmails = formData.contactEmails.filter((_, i) => i !== absoluteIndex);
                                            setFormData({ ...formData, contactEmails: nextEmails });
                                            const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
                                            setAdjusterEmailErrors(errors);
                                          }} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <X className="w-3 h-3" />
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length >= MAX_ADJ_EMAILS) return;
                                      const nextEmails: ContactEmail[] = [...formData.contactEmails, { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] }];
                                      setFormData({ ...formData, contactEmails: nextEmails });
                                      const { errors } = validateContactEmails(nextEmails.filter(c => c.contactType === "Adjuster (Carrier)"));
                                      setAdjusterEmailErrors(errors);
                                      setAdjusterSectionError("");
                                      const index = nextEmails.filter(c => c.contactType === "Adjuster (Carrier)").length - 1;
                                      setTimeout(() => { const el = document.getElementById(`adj-recipient-${index}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
                                    }}
                                    disabled={formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length >= MAX_ADJ_EMAILS}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Another Email
                                  </button>
                                </div>
                                {adjusterSectionError && (<p className="text-xs text-gray-900 font-black bg-red-50/50 backdrop-blur-sm px-2 py-1 rounded-md border border-red-200/30 mt-1 inline-block">{adjusterSectionError}</p>)}
                                {formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)").length >= MAX_ADJ_EMAILS && (<p className="text-[11px] text-gray-500 dark:text-gray-400">Maximum of {MAX_ADJ_EMAILS} additional emails reached.</p>)}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label htmlFor="adjusterComments" className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                <MessageSquare className="text-primary dark:text-accent w-3.5 h-3.5" />
                                Client Notes &amp; Comments
                              </label>
                              <textarea
                                id="adjusterComments"
                                name="adjusterComments"
                                value={formData.adjusterComments}
                                onChange={handleChange}
                                rows={1}
                                placeholder="Add any additional information"
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
                {/*  STEP 3 â€“ Policy & Address (merged)              */}
                {/* ================================================ */}
                {currentStep === 3 && (
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                      {/* LEFT â€” Property Contact (Policyholder) */}
                      <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                        <SectionHeader title="Property Contact (Policyholder)" icon={User} />
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

                          {/* DISABLED: Add Another Phone + secondary phone input â€” uncomment to restore
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <PhoneInputField label="Phone" name="policyholderPhone2" value={formData.policyholderPhone2} onChange={handleChange} invalid={!!fieldErrors.policyholderPhone2} error={fieldErrors.policyholderPhone2} placeholder="Optional" />
                          </div>

                        </div>
                      </div>

                      {/* RIGHT â€” Property Address */}
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
                {/*  STEP 4 â€“ Roofer & Public Adjuster               */}
                {/* ================================================ */}
                {currentStep === 4 && (
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                      {/* LEFT â€” Roofer */}
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

                      {/* RIGHT â€” Public Adjuster */}
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
                {/*  STEP 5 â€“ Review & Submit                        */}
                {/* ================================================ */}
                {currentStep === 5 && (
                  <div className="animate-fadeIn space-y-6">
                    <FormSection>
                      <div className="space-y-4">

                        {/* 1. Inspection & Property */}
                        <ReviewBlock stepNumber="1." title="Inspection & Property" icon={ClipboardList} onEdit={() => setCurrentStep(0)}>
                          <ReviewRow label="Inspection Type" value={formData.inspectionType} />
                          {formData.buildingType && <ReviewRow label="Building Type" value={formData.buildingType} />}
                        </ReviewBlock>

                        {/* 2. Service Add-ons */}
                        <ReviewBlock stepNumber="2." title="Service" icon={PackagePlus} onEdit={() => setCurrentStep(1)}>
                          {SERVICE_ADD_ONS.map((addon) => (
                            <ReviewRow
                              key={addon.id}
                              label={
                                addon.id === "swi"
                                  ? "Severe Weather\nIntelligence™"
                                  : "TRI Repairability\nEvaluation"
                              }
                              value={formData.serviceAddOns.includes(addon.id) ? "Selected" : "Not selected"}
                            />
                          ))}
                        </ReviewBlock>

                        {/* 3. Insurance & Adjuster */}
                        <ReviewBlock stepNumber="3." title="Insurance & Adjuster" icon={Shield} onEdit={() => setCurrentStep(2)}>
                          {formData.isIAClaim && (
                            <>
                              <ReviewRow label="IA Company" value={formData.iaCompany} />
                              <ReviewRow label="IA Name" value={`${formData.iaFirstName} ${formData.iaLastName}`.trim()} />
                              <ReviewRow label="IA Phone" value={formData.iaPhone} />
                              {formData.contactEmails.filter(c => c.contactType === "IA").map((r, i) => (
                                <ReviewRow key={`ia-${i}`} label={`IA Email ${i + 1}`} value={r.email ? `${r.email}${r.sendCopy.length > 0 ? ` (${formatPreferences(r.sendCopy)})` : ''}` : ""} />
                              ))}
                              <div className="col-span-full border-t-[2px] border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>
                            </>
                          )}

                          <ReviewRow label="Insurance Company" value={formData.insuranceCompany} />
                          <ReviewRow label="Claim Number" value={formData.claimNumber} />
                          {formData.dateOfLoss && <ReviewRow label="Date of Loss" value={formData.dateOfLoss} />}

                          <div className="col-span-full border-t-[2px] border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>

                          {/* Adjuster Company — hidden for now, restore when needed
                          <ReviewRow label="Adjuster Company" value={formData.adjusterCompany} />
                          */}
                          <ReviewRow label="Adjuster Name" value={`${formData.adjusterFirstName} ${formData.adjusterLastName}`.trim()} />
                          {(() => {
                            const adjEmails = formData.contactEmails.filter(c => c.contactType === "Adjuster (Carrier)");
                            const primary = adjEmails[0];
                            const secondary = adjEmails.slice(1);
                            return (
                              <>
                                <ReviewRow label="Primary Email" value={primary?.email ? `${primary.email}${primary.sendCopy.length > 0 ? ` (${formatPreferences(primary.sendCopy)})` : ''}` : ""} />
                                <ReviewRow label="Phone" value={formData.adjusterPhone} />
                                {formData.adjusterPhoneExt && <ReviewRow label="Extension" value={formData.adjusterPhoneExt} />}
                                {secondary.map((r, i) => (
                                  <ReviewRow key={`adj-${i}`} label={`Extra Email ${i + 1}`} value={r.email ? `${r.email}${r.sendCopy.length > 0 ? ` (${formatPreferences(r.sendCopy)})` : ''}` : ""} />
                                ))}
                              </>
                            );
                          })()}
                          {formData.adjusterComments && <ReviewRow label="Client Notes & Comments" value={formData.adjusterComments} />}
                          {formData.primaryClientType && <ReviewRow label="Primary Client" value={formData.primaryClientType} />}

                          <div className="col-span-full border-t-[2px] border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>
                          {(() => {
                            const docs = insuranceDocuments.filter((d) => d.file !== null);
                            if (docs.length === 0) {
                              return (
                                <div className="col-span-full text-[13px] italic text-gray-300 dark:text-gray-600">
                                  No Insurance Documents Provided
                                </div>
                              );
                            }
                            return docs.map((doc, i) => {
                              const cats = doc.categories
                                .map((c) => (c === "Other" && doc.customCategory.trim() ? doc.customCategory.trim() : c))
                                .filter(Boolean);
                              const categoryLabel = cats.length > 0 ? cats.join(", ") : "No category";
                              return (
                                <ReviewRow
                                  key={doc.id}
                                  label={docs.length > 1 ? `Insurance Documents ${i + 1}` : "Insurance Documents"}
                                  value={`${doc.file!.name} (${categoryLabel})`}
                                />
                              );
                            });
                          })()}
                        </ReviewBlock>

                        {/* 4. Property Contact Info & Address */}
                        <ReviewBlock stepNumber="4." title="Property Contact Info" icon={User} onEdit={() => setCurrentStep(3)}>
                          <ReviewRow label="Primary Name" value={`${formData.policyholderFirstName} ${formData.policyholderLastName}`.trim()} />
                          <ReviewRow label="Primary Phone" value={formData.policyholderPhone1} />
                          {formData.policyholderPhone1Extra && <ReviewRow label="Primary Phone 2" value={formData.policyholderPhone1Extra} />}
                          {formData.propertyContactEmail && <ReviewRow label="Email" value={formData.propertyContactEmail} />}
                          <div className="col-span-full border-t-[2px] border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>
                          <ReviewRow label="Secondary Name" value={`${formData.spouseFirstName} ${formData.spouseLastName}`.trim()} />
                          <ReviewRow label="Secondary Phone" value={formData.policyholderPhone2} />

                          <div className="col-span-full border-t-[2px] border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>

                          <ReviewRow label="Street Address" value={formData.streetAddress} fullWidth={!formData.addressLine2} />
                          {formData.addressLine2 && <ReviewRow label="Apt/Suite" value={formData.addressLine2} />}
                          <ReviewRow label="City" value={formData.city} />
                          <ReviewRow label="State" value={formData.state} />
                          <ReviewRow label="Zip Code" value={formData.zip} />
                        </ReviewBlock>

                        {/* 5. Roofer & Public Adjuster */}
                        <ReviewBlock stepNumber="5." title="Roofer & Public Adjuster" icon={Home} onEdit={() => setCurrentStep(4)} optional>
                          {/* Roofer */}
                          {!(formData.rooferName || formData.rooferCompany || formData.rooferPhone || formData.rooferEmail) ? (
                            <div className="col-span-full text-[13px] italic text-gray-300 dark:text-gray-600 self-center">No Roofer Provided</div>
                          ) : (
                            <>
                              <ReviewRow label="Roofer Name" value={formData.rooferName} />
                              <ReviewRow label="Roofer Company" value={formData.rooferCompany} />
                              <ReviewRow label="Roofer Phone" value={formData.rooferPhone} />
                              <ReviewRow label="Roofer Email" value={formData.rooferEmail} />
                            </>
                          )}

                          <div className="col-span-full border-t-[2px] border-gray-200 dark:border-gray-700 mt-2 mb-2"></div>

                          {/* Public Adjuster */}
                          {!(formData.publicAdjusterName || formData.publicAdjusterCompany || formData.publicAdjusterPhone || formData.publicAdjusterEmail) ? (
                            <div className="col-span-full text-[13px] italic text-gray-300 dark:text-gray-600 self-center">No Public Adjuster Provided</div>
                          ) : (
                            <>
                              <ReviewRow label="PA Name" value={formData.publicAdjusterName} />
                              <ReviewRow label="PA Company" value={formData.publicAdjusterCompany} />
                              <ReviewRow label="PA Phone" value={formData.publicAdjusterPhone} />
                              <ReviewRow label="PA Email" value={formData.publicAdjusterEmail} />
                            </>
                          )}
                        </ReviewBlock>

                      </div>
                    </FormSection>
                  </div>
                )}

                {/* â”€â”€ Navigation Buttons â”€â”€ */}
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
                      {currentStep === 4 && isStep3FieldsEmpty() ? "Skip" : "Next"}
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

      {/* â”€â”€ Save Preferences Confirmation Modal â”€â”€ */}
      {showPreferencesModal && (() => {
        const hasExistingSavedPreferences = loadedPreferences !== null && Object.keys(loadedPreferences).length > 0;
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/40 backdrop-blur-md px-4 p-6 animate-fadeIn">
            <div className="bg-white dark:bg-section-dark w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all scale-100">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                  <Bookmark className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Save Preferences?</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {hasExistingSavedPreferences
                    ? "Your saved preferences have changed. Would you like to overwrite your existing preferences?"
                    : "Would you like to save these preferences for future use?"}
                </p>
              </div>

              <div className="px-8 pb-8 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSavePreferencesIntentAndContinue(true)}
                  className="w-full bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white py-2.5 px-6 rounded-xl font-bold text-xs transition-all shadow-md active:scale-[0.98]"
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePreferencesIntentAndContinue(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-6 rounded-xl font-bold text-xs transition-all active:scale-[0.98]"
                >
                  {hasExistingSavedPreferences ? "No" : "Skip"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* â”€â”€ Custom Validation Modal for Step 3 â”€â”€ */}
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
                    setCurrentStep(5);
                    setMaxCompletedStep((prev) => Math.max(prev, 5));
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
                <input required type="text" placeholder="Company Name" value={newCompanyData.name} onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
              </div>
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Company Type (Optional)</label>
                <select value={addCompanyType} onChange={(e) => setAddCompanyType(e.target.value)} className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent cursor-pointer">
                  <option value="">Select Type</option>
                  {companyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
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
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .translate-z-10 { transform: translateZ(10px); }
        .translate-z-20 { transform: translateZ(20px); }

        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0) rotateX(0); }
          50% { transform: translateY(-5px) rotateX(2deg); }
        }
        .animate-subtle-float {
          animation: subtleFloat 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review sub-components                                              */
/* ------------------------------------------------------------------ */

function ReviewBlock({ stepNumber, title, icon: Icon, onEdit, children, optional = false }: { stepNumber: string; title: string; icon: React.ElementType; onEdit: () => void; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="group space-y-0 animate-fadeIn mb-6 last:mb-0 bg-white dark:bg-section-dark rounded-xl shadow-sm border border-primary/25 dark:border-accent/25 transition-all hover:shadow-md overflow-hidden">
      <div className="bg-white dark:bg-background-dark py-3 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-primary dark:text-accent" />
          <h3 className="text-[13px] font-bold text-primary dark:text-accent uppercase tracking-widest flex items-center gap-2">
            {title}
            {optional && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded uppercase">Optional</span>
            )}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            onEdit();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-1.5 text-primary dark:text-accent hover:opacity-80 transition-opacity text-[11px] font-bold tracking-wide"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>

      <div className="p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, fullWidth = false }: { label: string; value: string; fullWidth?: boolean }) {
  const displayValue = value === "+" || value?.trim() === "" ? "" : value;

  return (
    <div className={`${fullWidth ? "col-span-full" : ""} flex flex-col gap-1`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 pl-1 min-h-[2.6em] whitespace-pre-line leading-snug">
        {label}
      </span>
      <div className="bg-white dark:bg-gray-800 border border-primary/20 dark:border-accent/20 rounded-lg p-2.5 shadow-sm">
        <span className="text-[13px] font-bold text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap leading-tight" style={{ wordBreak: "break-word" }}>
          {displayValue || <span className="text-gray-300 dark:text-gray-600 italic font-normal">Not provided</span>}
        </span>
      </div>
    </div>
  );
}

const formatPreferences = (prefs: string[]) => {
  if (prefs.includes('all')) return "All";
  return prefs.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
};
