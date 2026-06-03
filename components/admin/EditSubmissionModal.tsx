"use client";

import { useState, useEffect, useCallback } from "react";
import FormSection from "@/components/inspection-form/FormSection";
import SectionHeader from "@/components/inspection-form/SectionHeader";
import InputField from "@/components/inspection-form/InputField";
import SelectCard from "@/components/inspection-form/SelectCard";
import CheckboxToggle from "@/components/inspection-form/CheckboxToggle";
import AddressGroup from "@/components/inspection-form/AddressGroup";
import PhoneInputField from "@/components/inspection-form/PhoneInputField";
import { DatePicker } from "@/components/inspection-form/DatePicker";
import {
  ClipboardList,
  Shield,
  User,
  Home,
  Building2,
  UserRound,
  Mail,
  Tag,
  Hash,
  MessageSquare,
  Plus,
  X,
  AlertTriangle,
  Loader2,
  UserCheck,
  MapPin,
  Hand,
  Settings,
  Gavel,
  ArrowRight,
  Send,
  ArrowLeft
} from "lucide-react";
import { validateContactEmails, type ContactEmail } from "@/lib/utils/validation";

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    ROWID: string;
    Payload: string;
    ClaimNumber: string;
    ErrorDetails?: string;
  } | null;
  onSave: (rowId: string, updatedPayload: any) => Promise<void>;
}

const INSPECTION_TYPES = [
  { id: "storm-damage", title: "Residential Storm Damage", image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80" },
  { id: "structural-loss", title: "Structural Loss", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  { id: "large-complex-loss", title: "Large / Complex Loss", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" },
  { id: "water-loss", title: "Water Loss", image: "/inspection-type-water-loss.png" },
  { id: "lightning-damage", title: "Lightning Damage", image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80" },
  { id: "vandalism", title: "Vandalism", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80" },
  { id: "chimney-fire-collapse", title: "Chimney Fire / Collapse", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80" },
  { id: "component-failure", title: "Component Failure", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80" },
  { id: "hvac-electrical", title: "HVAC / Electrical", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" },
  { id: "small-fire", title: "Small Fire", image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80" },
];

const BUILDING_TYPES = [
  { id: "residential", title: "Residential", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
  { id: "commercial-municipal-industrial", title: "Commercial / Municipal / Industrial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { id: "multiple-structures", title: "Multiple Structures", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
];

const SEND_COPY_OPTIONS = ["all", "report", "invoice", "notifications"] as const;
const MAX_IA_EMAILS = 3;
const MAX_ADJ_EMAILS = 3;

export default function EditSubmissionModal({
  isOpen,
  onClose,
  submission,
  onSave
}: EditSubmissionModalProps) {
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, any>>({});

  // Email Errors
  const [iaEmailErrors, setIaEmailErrors] = useState<string[]>([]);
  const [adjusterEmailErrors, setAdjusterEmailErrors] = useState<string[]>([]);

  // Insurance Search States
  const [insuranceSearchResults, setInsuranceSearchResults] = useState<any[]>([]);
  const [masterInsuranceList, setMasterInsuranceList] = useState<any[]>([]);
  const [insuranceSearchLoading, setInsuranceSearchLoading] = useState(false);
  const [insuranceCompanyOpen, setInsuranceCompanyOpen] = useState(false);
  const [insuranceCompanyQuery, setInsuranceCompanyQuery] = useState("");

  // Add New Company States
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({ name: "", ccInvoicesTo: "", splitInvoice: false, invoiceEmail: "", priceList: "2025 Prices" });
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [hasSentCompany, setHasSentCompany] = useState(false);
  const [createCompanyMessage, setCreateCompanyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [aliasMatch, setAliasMatch] = useState<{ matchedBy: string; results: { id: string; name: string; zoho_creator_id: string }[] } | null>(null);
  const [aliasDismissed, setAliasDismissed] = useState(false);

  useEffect(() => {
    // Initial fetch of master insurance list
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

    if (isOpen && submission) {
      let payload: any = {};
      try {
        payload = JSON.parse(submission.Payload);
        // Ensure contactEmails is at least an empty array for safety
        if (!payload.contactEmails) {
          payload.contactEmails = [];
        }

        // Ensure at least one Adjuster email exists for the form to render
        if (!payload.contactEmails.some((c: any) => c.contactType === "Adjuster (Carrier)")) {
          payload.contactEmails.push({ email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] });
        }

        // Ensure at least one IA email exists if it's an IA claim
        if (payload.isIAClaim && !payload.contactEmails.some((c: any) => c.contactType === "IA")) {
          payload.contactEmails.push({ email: "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] });
        }

        // If the payload was previously swapped with a zoho_creator_id, restore the string name for the UI so the admin doesn't see a raw ID
        let displayCompany = payload.insuranceCompanyName || payload.insuranceCompany || "";

        setFormData(payload);
        setInsuranceCompanyQuery(displayCompany);
      } catch (e) {
        setFormData({ contactEmails: [] });
      }

      // Parse error details for highlighting
      const errors: Record<string, string> = {};
      const errorStr = (submission.ErrorDetails || "");

      // Aggressive catch-all parsing for Zoho/Catalyst logs
      const allDetectedErrors: string[] = [];
      const checkErr = (key: string, searchTerms: string[]) => {
        for (const term of searchTerms) {
          const regex = new RegExp(`"${term}"\\s*:\\s*(?:\\[\\s*)?("(?:[^"\\\\]|\\\\.)*"|[^\\n,\\]]+)`, 'i');
          let match = errorStr.match(regex);

          if (!match && errorStr.toLowerCase().includes(term.toLowerCase())) {
            const invalidValRegex = new RegExp(`(Invalid column value for ${term}|${term} is required|Enter a valid ${term})`, 'i');
            const innerMatch = errorStr.match(invalidValRegex);
            if (innerMatch) {
              allDetectedErrors.push(innerMatch[1].trim());
              errors[key] = innerMatch[1].trim();
              return;
            }
          }

          if (match) {
            let val = match[1].trim();
            val = val.replace(/^["':\s*(\[{]+/, '').replace(/[}"',:\s*)}\]]+$/, '');
            if (val && val.length > 1) {
              allDetectedErrors.push(val);
              errors[key] = val;
              return;
            }
          }
        }
      };

      checkErr("inspectionType", ["Inspection_Type", "Inspection Type", "inspectionType"]);
      checkErr("buildingType", ["Building_Type", "Building Type", "buildingType"]);
      checkErr("claimNumber", ["Claim_Number", "Claim Number", "claimNumber"]);
      // ... previous field checks ...
      checkErr("insuranceCompany", ["Insurance_Company", "Insurance Company", "insuranceCompany"]);
      checkErr("policyNumber", ["Policy_Number", "Policy Number", "policyNumber"]);
      checkErr("dateOfLoss", ["Date_of_Loss", "Date of Loss", "dateOfLoss"]);
      checkErr("adjusterFirstName", ["Adjuster_First_Name", "First_Name", "adjusterFirstName"]);
      checkErr("adjusterLastName", ["Adjuster_Last_Name", "Last_Name", "adjusterLastName"]);
      checkErr("adjusterEmail", ["Adjuster_Email", "Adjuster Email", "adjusterEmail"]);
      checkErr("adjusterPhone", ["Adjuster_Phone", "adjusterPhone"]);
      checkErr("adjusterCompany", ["Adjuster_Company", "adjusterCompany"]);
      checkErr("iaFirstName", ["IA_First_Name", "iaFirstName"]);
      checkErr("iaLastName", ["IA_Last_Name", "iaLastName"]);
      checkErr("iaPhone", ["IA_Phone", "iaPhone"]);
      checkErr("iaCompany", ["IA_Company", "iaCompany"]);
      checkErr("iaEmail", ["IA_Email", "iaEmail"]);
      checkErr("policyholderFirstName", ["First_Name", "policyholderFirstName"]);
      checkErr("policyholderLastName", ["Last_Name", "policyholderLastName"]);
      checkErr("policyholderPhone1", ["Phone_1", "policyholderPhone1"]);
      checkErr("propertyContactEmail", ["Contact_Email", "propertyContactEmail"]);
      checkErr("streetAddress", ["Street_Address", "Address", "streetAddress"]);
      checkErr("city", ["City", "city"]);
      checkErr("state", ["State", "state"]);
      checkErr("zip", ["Zip", "Postal_Code", "zip"]);
      checkErr("rooferName", ["Roofer_Name", "rooferName"]);
      checkErr("publicAdjusterName", ["Public_Adjuster", "publicAdjusterName"]);

      // Dynamic mapping for "Invalid column value X specified" when column name is omitted
      const genericInvalidMatch = errorStr.match(/Invalid column value\s+[\\]?["']?(.*?)[\\]?["']?\s+specified/i) || errorStr.match(/Invalid column value\s+(.*?)\s+specified/i);
      if (genericInvalidMatch && genericInvalidMatch[1]) {
        const invalidVal = genericInvalidMatch[1].trim();
        if (invalidVal) {
          for (const [key, val] of Object.entries(payload)) {
            if (typeof val === 'string' && val.trim() === invalidVal && key !== 'contactEmails') {
              errors[key] = `Invalid value: ${invalidVal}. Please select a valid option.`;
              if (!allDetectedErrors.includes(`Invalid value: ${invalidVal}`)) {
                allDetectedErrors.push(`Invalid value: ${invalidVal}`);
              }
              break;
            }
          }
        }
      }

      // If no specific fields match but we have an error string, add it as a clean fallback
      if (allDetectedErrors.length === 0 && errorStr) {
        let cleanGeneric = errorStr.replace(/["'{}[\]]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanGeneric.length > 5) {
          allDetectedErrors.push(cleanGeneric);
        }
      }

      setFieldErrors({ ...errors, allErrors: [...new Set(allDetectedErrors)] });
    }
  }, [isOpen, submission]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto-resize textarea for Adjuster Comments
    if (name === "adjusterComments") {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleBlur = () => { };

  const searchInsuranceCompanies = async (query: string) => {
    const trimmed = query.trim();

    // If master list is already loaded, filter locally for instant results
    if (masterInsuranceList.length > 0) {
      if (!trimmed) {
        setInsuranceSearchResults(masterInsuranceList);
        setAliasMatch(null);
      } else {
        const lowerQuery = trimmed.toLowerCase();
        const filtered = masterInsuranceList.filter(c =>
          c.name.toLowerCase().includes(lowerQuery)
        );
        setInsuranceSearchResults(filtered);
        setAliasMatch(null);
      }
      return;
    }

    if (!trimmed) {
      setInsuranceSearchResults([]);
      setAliasMatch(null);
      return;
    }

    setInsuranceSearchLoading(true);
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
  };

  const commitInsuranceCompanyValue = (value: string) => {
    const trimmed = value.trim();
    setInsuranceCompanyQuery(trimmed);
    setFormData((prev: any) => ({ ...prev, insuranceCompany: trimmed }));
  };

  const handleAddNewCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingCompany || hasSentCompany) return;

    if (!newCompanyData.name.trim()) {
      setCreateCompanyMessage({ type: 'error', text: "Company Name is required." });
      return;
    }

    setHasSentCompany(true);
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
        setFormData((prev: any) => ({ ...prev, insuranceCompany: dynamicValue }));
        setInsuranceCompanyQuery(dynamicValue);

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
    setCreateCompanyMessage(null);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setServerError(null);
    try {
      const payloadToSave = {
        ...formData,
        contactEmails: (formData.contactEmails || []).map((c: any) => ({
          ...c,
          sendCopy: (c.sendCopy || []).filter((opt: string) => opt !== "all")
        }))
      };

      const matchedComp = masterInsuranceList.find((c: any) => c.name.toLowerCase() === (payloadToSave.insuranceCompany || "").toLowerCase());
      if (matchedComp && matchedComp.zoho_creator_id) {
        (payloadToSave as any).insuranceCompanyName = payloadToSave.insuranceCompany;
        payloadToSave.insuranceCompany = matchedComp.zoho_creator_id;
      }

      await onSave(submission!.ROWID, payloadToSave);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "Failed to commit changes");
    } finally {
      setIsSaving(false);
    }
  };

  const renderErrorSMS = (key: string) => {
    return null; // All errors moved to top per user request
  };

  if (!isOpen || !submission || !formData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gray-100 dark:bg-background-dark w-full max-w-4xl h-[90vh] rounded-2xl shadow-4xl flex flex-col overflow-hidden border border-white/10 animate-in slide-in-from-bottom-8 duration-500">

        {/* Header - Ultra Compact */}
        <div className="px-4 py-2.5 border-b border-gray-200/50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-background-dark/80 backdrop-blur-lg shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <ClipboardList className="text-white w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight">Edit Inspection Submission</h2>
              <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em] mt-0.5 opacity-70">ID: {submission.ROWID}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 p-1.5 rounded-lg transition-all duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body - Ultra Compact */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/10">

          {serverError && (
            <div className="p-3 bg-red-600 text-white rounded-xl shadow-md flex items-center gap-3 animate-in slide-in-from-top-4">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-tight truncate">{serverError}</p>
              </div>
            </div>
          )}

          {fieldErrors.allErrors && fieldErrors.allErrors.length > 0 && (
            <div className="p-3 bg-gray-200/80 backdrop-blur-sm border border-gray-300 rounded-xl flex flex-col gap-2 animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gray-900 shrink-0" />
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter opacity-70">Submission Technical Flag</p>
              </div>
              <div className="space-y-1 ml-8">
                {fieldErrors.allErrors.map((err: string, i: number) => (
                  <p key={i} className="text-xs font-bold text-gray-800 leading-tight flex items-start gap-1.5">
                    <span className="text-[10px] text-gray-500 mt-0.5">•</span>
                    {err}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Inspection & Property */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-1 bg-white dark:bg-section-dark px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-800 w-fit">
              <span className="text-sm font-black text-primary">1.</span>
              <h3 className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Inspection & Property</h3>
            </div>

            <div className="bg-white dark:bg-section-dark rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
              {(() => {
                const showBuildingType = !!formData.inspectionType && !["Component Failure", "Residential Storm Damage", "Structural Loss", "Large / Complex Loss", "Water Loss"].includes(formData.inspectionType);
                return (
                  <div className={`grid grid-cols-1 gap-4 items-start transition-all duration-300 ${showBuildingType ? "md:grid-cols-4" : "md:grid-cols-1"}`}>
                    {/* Inspection Type */}
                    <div className={`space-y-2 ${showBuildingType ? "md:col-span-3" : "md:col-span-1"}`}>
                      <SectionHeader title="1.1 Inspection Type" icon={ClipboardList} />
                      {renderErrorSMS("inspectionType")}
                      <div className={`grid gap-1.5 p-1 bg-gray-50/50 dark:bg-background-dark rounded-lg border border-gray-100 dark:border-gray-800 grid-cols-2 ${showBuildingType ? "sm:grid-cols-3" : "sm:grid-cols-4"}`}>
                        {INSPECTION_TYPES.map((t) => (
                          <SelectCard
                            key={t.id}
                            label={t.title}
                            value={t.id}
                            image={t.image}
                            containImage
                            selected={formData.inspectionType === t.title}
                            dimmed={!!formData.inspectionType && formData.inspectionType !== t.title}
                            onSelect={() => setFormData({ ...formData, inspectionType: t.title, buildingType: t.id === "component-failure" ? "" : formData.buildingType })}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Building Type - Conditionally Shown */}
                    {showBuildingType && (
                      <div className="space-y-2 md:col-span-1">
                        <SectionHeader title="1.2 Building Type" icon={Building2} />
                        {renderErrorSMS("buildingType")}
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 p-1 bg-gray-50/50 dark:bg-background-dark rounded-lg border border-gray-100 dark:border-gray-800">
                          {BUILDING_TYPES.map((b) => (
                            <SelectCard
                              key={b.id}
                              label={b.title}
                              value={b.id}
                              image={b.image}
                              selected={formData.buildingType === b.title}
                              dimmed={!!formData.buildingType && formData.buildingType !== b.title}
                              onSelect={() => setFormData({ ...formData, buildingType: b.title })}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </section>

          {/* STEP 2: Insurance & Adjuster */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-1 bg-white dark:bg-section-dark px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-800 w-fit">
              <span className="text-sm font-black text-primary">2.</span>
              <h3 className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Insurance & Adjuster</h3>
            </div>

            <div className="space-y-2">
              <div className="bg-white dark:bg-background-dark rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CheckboxToggle
                  label="There is an IA for this project"
                  checked={formData.isIAClaim || false}
                  onChange={(checked) => setFormData((prev: any) => ({
                    ...prev,
                    isIAClaim: checked,
                    contactEmails: (checked && !prev.contactEmails.some((c: any) => c.contactType === "IA"))
                      ? [...prev.contactEmails, { email: "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] }]
                      : prev.contactEmails
                  }))}
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* DYNAMIC LAYOUT BASED ON IA CLAIM */}
                {formData.isIAClaim ? (
                  <>
                    {/* LEFT COLUMN: IA Information ONLY */}
                    <div className="space-y-2">
                      <div className="bg-primary/5 dark:bg-accent/5 rounded-xl p-4 border border-primary/20 dark:border-accent/20 space-y-3 shadow-sm">
                        <SectionHeader title="IA Information" />

                        {/* Who is the primary client — INSIDE IA INFO */}
                        <div className="bg-white/50 dark:bg-background-dark/50 rounded-lg p-1.5 border border-primary/10 dark:border-accent/10 space-y-1.5">
                          <SectionHeader title="Who is the primary client for this project?" icon={UserCheck} small />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {[
                              { id: "Independent Adjuster", title: "Independent Adjuster", icon: Shield },
                              { id: "Adjuster (Carrier)", title: "Adjuster (Carrier)", icon: Building2 },
                            ].map((opt) => {
                              const selected = formData.primaryClientType === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, primaryClientType: opt.id as any })}
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

                        <InputField label="IA Company Name" name="iaCompany" value={formData.iaCompany || ""} onChange={handleChange} icon={Building2} required invalid={!!fieldErrors.iaCompany} />
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="IA First Name" name="iaFirstName" value={formData.iaFirstName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.iaFirstName} />
                          <InputField label="IA Last Name" name="iaLastName" value={formData.iaLastName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.iaLastName} />
                        </div>
                        <PhoneInputField label="IA Phone Number" name="iaPhone" value={formData.iaPhone || ""} onChange={handleChange} invalid={!!fieldErrors.iaPhone} />

                        {/* IA Email List split into Primary and Additional */}
                        <div className="pt-2 border-t border-primary/10 space-y-3">
                          {(() => {
                            const iaRecipients = (formData.contactEmails || []).filter((c: any) => c.contactType === "IA");
                            const primary = iaRecipients[0] || { email: "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] };
                            const primaryAbsIdx = (formData.contactEmails || []).findIndex((c: any, i: number) => c.contactType === "IA" && (formData.contactEmails || []).filter((cc: any, ii: number) => cc.contactType === "IA" && ii < i).length === 0);

                            return (
                              <>
                                {/* Primary IA Email */}
                                <div className="space-y-2">
                                  <SectionHeader title="Primary IA Email" icon={Mail} small />
                                  <InputField label="IA Email" name="iaEmail" value={primary.email || ""} onChange={(e) => {
                                    const next = [...(formData.contactEmails || [])];
                                    const idx = primaryAbsIdx === -1 ? next.length : primaryAbsIdx;
                                    if (primaryAbsIdx === -1) {
                                      next.push({ email: e.target.value, contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] });
                                    } else {
                                      next[idx] = { ...next[idx], email: e.target.value };
                                    }
                                    setFormData({ ...formData, contactEmails: next });
                                  }} type="email" icon={Mail} placeholder="ia@company.com" required invalid={!!fieldErrors.iaEmail} />
                                  <div>
                                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-tighter">Send copy of</p>
                                    <div className="flex flex-wrap gap-1.5 ">
                                      {SEND_COPY_OPTIONS.map(opt => (
                                        <label key={opt} className="flex items-center gap-1 cursor-pointer text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter hover:text-primary transition-colors">
                                          <input type="checkbox" checked={(primary.sendCopy || []).includes(opt)} onChange={() => {
                                            const next = [...(formData.contactEmails || [])];
                                            const idx = primaryAbsIdx;
                                            if (idx === -1) return;
                                            let currentCopy = primary.sendCopy || [];
                                            if (opt === "all") { currentCopy = currentCopy.includes("all") ? [] : ["all", "report", "invoice", "notifications"]; } else { if (currentCopy.includes(opt)) { currentCopy = currentCopy.filter((o: string) => o !== opt && o !== "all"); } else { currentCopy = [...currentCopy.filter((o: string) => o !== "all"), opt]; if (currentCopy.includes("report") && currentCopy.includes("invoice") && currentCopy.includes("notifications")) { currentCopy = ["all", ...currentCopy]; } } }
                                            next[idx] = { ...next[idx], sendCopy: currentCopy };
                                            setFormData({ ...formData, contactEmails: next });
                                          }} className="w-2.5 h-2.5 rounded border-gray-300 text-primary" />
                                          {opt}
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Additional IA Emails */}
                                <div className="space-y-3 pt-3 border-t border-primary/10">
                                  {iaRecipients.slice(1).map((recipient: any, localIdx: number) => {
                                    const idx = localIdx + 1;
                                    const absIdx = formData.contactEmails.findIndex((c: any, i: number) => c.contactType === "IA" && formData.contactEmails.filter((cc: any, ii: number) => cc.contactType === "IA" && ii < i).length === idx);
                                    return (
                                      <div key={idx} className="bg-white/50 dark:bg-background-dark/60 p-2 rounded-lg border border-primary/10 space-y-2">
                                        <InputField label={`Additional IA Email #${idx}`} name={`iaEmail_${idx}`} value={recipient.email || ""} onChange={(e) => { const next = [...(formData.contactEmails || [])]; next[absIdx] = { ...next[absIdx], email: e.target.value }; setFormData({ ...formData, contactEmails: next }); }} type="email" icon={Mail} placeholder="additional@company.com" />
                                        <div>
                                          <p className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-tighter">Send copy of</p>
                                          <div className="flex flex-wrap gap-1.5">
                                            {SEND_COPY_OPTIONS.map(opt => (
                                              <label key={opt} className="flex items-center gap-1 cursor-pointer text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter hover:text-primary transition-colors">
                                                <input type="checkbox" checked={(recipient.sendCopy || []).includes(opt)} onChange={() => { const next = [...(formData.contactEmails || [])]; let currentCopy = recipient.sendCopy || []; if (opt === "all") { currentCopy = currentCopy.includes("all") ? [] : ["all", "report", "invoice", "notifications"]; } else { if (currentCopy.includes(opt)) { currentCopy = currentCopy.filter((o: string) => o !== opt && o !== "all"); } else { currentCopy = [...currentCopy.filter((o: string) => o !== "all"), opt]; if (currentCopy.includes("report") && currentCopy.includes("invoice") && currentCopy.includes("notifications")) { currentCopy = ["all", ...currentCopy]; } } } next[absIdx] = { ...next[absIdx], sendCopy: currentCopy }; setFormData({ ...formData, contactEmails: next }); }} className="w-2.5 h-2.5 rounded border-gray-300 text-primary" />
                                                {opt}
                                              </label>
                                            ))}
                                          </div>
                                        </div>
                                        <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, contactEmails: prev.contactEmails.filter((cc: any, i: number) => i !== absIdx) }))} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1">
                                          <X className="w-2.5 h-2.5" />
                                          Remove
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setFormData((prev: any) => ({ ...prev, contactEmails: [...(prev.contactEmails || []), { email: "", contactType: "IA", sendCopy: ["all", "report", "invoice", "notifications"] }] }))}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-black bg-primary text-white hover:bg-primary-dark transition-all shadow-sm active:scale-95"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            Add Another IA Email
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Insurance AND Adjuster Details */}
                    <div className="space-y-2">
                      {/* Insurance Carrier */}
                      <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
                        <SectionHeader title="Insurance Carrier" icon={Shield} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="space-y-0.5 relative">
                            <label className="text-[9px] font-black uppercase text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-0.5">
                              <Building2 className="w-2.5 h-2.5 text-primary" />
                              Insurance Company
                            </label>
                            <div className="relative">
                              <input
                                value={insuranceCompanyQuery || ""}
                                onChange={(e) => {
                                  const next = e.target.value;
                                  setInsuranceCompanyQuery(next);
                                  setFormData((prev: any) => ({ ...prev, insuranceCompany: next }));
                                  setInsuranceCompanyOpen(true);
                                  searchInsuranceCompanies(next);
                                }}
                                onFocus={(e) => {
                                  e.target.select();
                                  setInsuranceCompanyOpen(true);
                                  searchInsuranceCompanies("");
                                }}
                                onBlur={() => {
                                  setTimeout(() => setInsuranceCompanyOpen(false), 250);
                                  commitInsuranceCompanyValue(insuranceCompanyQuery);
                                }}
                                placeholder="Search..."
                                className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white"
                              />
                              {insuranceSearchLoading && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                  <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                </div>
                              )}
                            </div>

                            {insuranceCompanyOpen && (
                              <div className="absolute z-[110] mt-1 w-[200%] md:w-full max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-section-dark shadow-xl">
                                {/* Alias Suggestion Banner */}
                                {aliasMatch && !aliasDismissed && (
                                  <div className="p-2 border-b border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/40">
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="w-3 h-3 text-orange-600 shrink-0 mt-0.5" />
                                      <div className="flex-1">
                                        <p className="text-[10px] text-orange-800 dark:text-orange-200 font-bold leading-tight">
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
                                            className="px-2 py-0.5 bg-orange-600 text-white text-[9px] font-bold rounded hover:bg-orange-700 transition-colors"
                                          >
                                            Use Suggestion
                                          </button>
                                          <button
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => setAliasDismissed(true)}
                                            className="px-2 py-0.5 border border-orange-300 text-orange-700 text-[9px] font-bold rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
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
                                  onClick={() => { setInsuranceCompanyOpen(false); setIsAddCompanyModalOpen(true); }}
                                  className="w-full text-left px-3 py-2 text-[10px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
                                >
                                  Add New Company
                                  <Building2 className="w-3 h-3" />
                                </button>

                                {insuranceSearchResults.length > 0 ? (
                                  insuranceSearchResults.map((c: any) => (
                                    <button
                                      key={c.id || c.zoho_creator_id}
                                      type="button"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => { commitInsuranceCompanyValue(c.name); setInsuranceCompanyOpen(false); }}
                                      className={`w-full text-left px-3 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${insuranceCompanyQuery === c.name ? "font-bold text-primary" : "text-gray-700 dark:text-gray-200"}`}
                                    >
                                      {c.name}
                                    </button>
                                  ))
                                ) : !insuranceSearchLoading && (
                                  <div className="p-3 text-center text-gray-500 text-[10px]">No matches found.</div>
                                )}
                              </div>
                            )}
                          </div>
                          <InputField label="Claim Number" name="claimNumber" value={formData.claimNumber || ""} onChange={handleChange} icon={Tag} required invalid={!!fieldErrors.claimNumber} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="Policy Number" name="policyNumber" value={formData.policyNumber || ""} onChange={handleChange} icon={Hash} invalid={!!fieldErrors.policyNumber} />
                          <DatePicker label="Date of Loss" name="dateOfLoss" value={formData.dateOfLoss || ""} onChange={handleChange} required invalid={!!fieldErrors.dateOfLoss} />
                        </div>
                      </div>

                      {/* Carrier Adjuster Details */}
                      <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
                        <SectionHeader title="Carrier Adjuster Details" icon={Gavel} />
                        <InputField label="Adjuster Company Name" name="adjusterCompany" value={formData.adjusterCompany || ""} onChange={handleChange} icon={Building2} invalid={!!fieldErrors.adjusterCompany} />
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="First Name" name="adjusterFirstName" value={formData.adjusterFirstName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.adjusterFirstName} />
                          <InputField label="Last Name" name="adjusterLastName" value={formData.adjusterLastName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.adjusterLastName} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <PhoneInputField label="Adjuster Phone" name="adjusterPhone" value={formData.adjusterPhone || ""} onChange={handleChange} required invalid={!!fieldErrors.adjusterPhone} />
                          <InputField label="Phone Extension" name="adjusterPhoneExt" value={formData.adjusterPhoneExt || ""} onChange={handleChange} placeholder="Ext." icon={Hash} invalid={!!fieldErrors.adjusterPhoneExt} />
                        </div>
                        {/* PRIMARY & ADDITIONAL ADJUSTER EMAILS */}
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {(() => {
                              const adjRecipients = (formData.contactEmails || []).filter((c: any) => c.contactType === "Adjuster (Carrier)");
                              const primary = adjRecipients[0] || { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] };
                              const primaryAbsIdx = (formData.contactEmails || []).findIndex((c: any, i: number) => c.contactType === "Adjuster (Carrier)" && (formData.contactEmails || []).filter((cc: any, ii: number) => cc.contactType === "Adjuster (Carrier)" && ii < i).length === 0);

                              return (
                                <>
                                  {/* Primary Adjuster Email */}
                                  <div className="space-y-2">
                                    <InputField label="Adjuster Email" name="adjusterEmail" value={primary.email || ""} onChange={(e) => {
                                      const next = [...(formData.contactEmails || [])];
                                      const idx = primaryAbsIdx === -1 ? next.length : primaryAbsIdx;
                                      if (primaryAbsIdx === -1) {
                                        next.push({ email: e.target.value, contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] });
                                      } else {
                                        next[idx] = { ...next[idx], email: e.target.value };
                                      }
                                      setFormData({ ...formData, contactEmails: next });
                                    }} type="email" icon={Mail} placeholder="adjuster@insurance.com" required invalid={!!fieldErrors.adjusterEmail} />
                                    <div>
                                      <p className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-tighter">Send copy of</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {SEND_COPY_OPTIONS.map(opt => (
                                          <label key={opt} className="flex items-center gap-1 cursor-pointer text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter hover:text-primary transition-colors">
                                            <input type="checkbox" checked={(primary.sendCopy || []).includes(opt)} onChange={() => {
                                              const next = [...(formData.contactEmails || [])];
                                              const idx = primaryAbsIdx;
                                              if (idx === -1) return;
                                              let currentCopy = primary.sendCopy || [];
                                              if (opt === "all") { currentCopy = currentCopy.includes("all") ? [] : ["all", "report", "invoice", "notifications"]; } else { if (currentCopy.includes(opt)) { currentCopy = currentCopy.filter((o: string) => o !== opt && o !== "all"); } else { currentCopy = [...currentCopy.filter((o: string) => o !== "all"), opt]; if (currentCopy.includes("report") && currentCopy.includes("invoice") && currentCopy.includes("notifications")) { currentCopy = ["all", ...currentCopy]; } } }
                                              next[idx] = { ...next[idx], sendCopy: currentCopy };
                                              setFormData({ ...formData, contactEmails: next });
                                            }} className="w-2.5 h-2.5 rounded border-gray-300 text-primary" />
                                            {opt}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Additional Adjuster Emails */}
                                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    {adjRecipients.slice(1).map((recipient: any, localIdx: number) => {
                                      const idx = localIdx + 1;
                                      const absIdx = formData.contactEmails.findIndex((c: any, i: number) => c.contactType === "Adjuster (Carrier)" && formData.contactEmails.filter((cc: any, ii: number) => cc.contactType === "Adjuster (Carrier)" && ii < i).length === idx);
                                      return (
                                        <div key={idx} className="bg-gray-50/50 dark:bg-background-dark/60 p-2 rounded-lg border border-gray-100 dark:border-gray-700 space-y-2">
                                          <InputField label={`Additional Adjuster Email #${idx}`} name={`adjEmail_${idx}`} value={recipient.email || ""} onChange={(e) => { const next = [...(formData.contactEmails || [])]; next[absIdx] = { ...next[absIdx], email: e.target.value }; setFormData({ ...formData, contactEmails: next }); }} type="email" icon={Mail} placeholder="additional@company.com" />
                                          <div>
                                            <p className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-tighter">Send copy of</p>
                                            <div className="flex flex-wrap gap-1.5">
                                              {SEND_COPY_OPTIONS.map(opt => (
                                                <label key={opt} className="flex items-center gap-1 cursor-pointer text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter hover:text-primary transition-colors">
                                                  <input type="checkbox" checked={(recipient.sendCopy || []).includes(opt)} onChange={() => { const next = [...(formData.contactEmails || [])]; let currentCopy = recipient.sendCopy || []; if (opt === "all") { currentCopy = currentCopy.includes("all") ? [] : ["all", "report", "invoice", "notifications"]; } else { if (currentCopy.includes(opt)) { currentCopy = currentCopy.filter((o: string) => o !== opt && o !== "all"); } else { currentCopy = [...currentCopy.filter((o: string) => o !== "all"), opt]; if (currentCopy.includes("report") && currentCopy.includes("invoice") && currentCopy.includes("notifications")) { currentCopy = ["all", ...currentCopy]; } } } next[absIdx] = { ...next[absIdx], sendCopy: currentCopy }; setFormData({ ...formData, contactEmails: next }); }} className="w-2.5 h-2.5 rounded border-gray-300 text-primary" />
                                                  {opt}
                                                </label>
                                              ))}
                                            </div>
                                          </div>
                                          <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, contactEmails: prev.contactEmails.filter((cc: any, i: number) => i !== absIdx) }))} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1">
                                            <X className="w-2.5 h-2.5" />
                                            Remove
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setFormData((prev: any) => ({ ...prev, contactEmails: [...(prev.contactEmails || []), { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] }] }))}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Another Email
                            </button>
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
                            value={formData.adjusterComments || ""}
                            onChange={handleChange}
                            rows={1}
                            placeholder="Any additional comments from the adjuster..."
                            className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none overflow-hidden transition-all min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* LEFT COLUMN: Insurance Carrier ONLY */}
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
                        <SectionHeader title="Insurance Carrier" icon={Shield} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="space-y-0.5 relative">
                            <label className="text-[9px] font-black uppercase text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-0.5">
                              <Building2 className="w-2.5 h-2.5 text-primary" />
                              Insurance Company
                            </label>
                            <div className="relative">
                              <input
                                value={insuranceCompanyQuery || ""}
                                onChange={(e) => {
                                  const next = e.target.value;
                                  setInsuranceCompanyQuery(next);
                                  setFormData((prev: any) => ({ ...prev, insuranceCompany: next }));
                                  setInsuranceCompanyOpen(true);
                                  searchInsuranceCompanies(next);
                                }}
                                onFocus={(e) => {
                                  e.target.select();
                                  setInsuranceCompanyOpen(true);
                                  searchInsuranceCompanies("");
                                }}
                                onBlur={() => {
                                  setTimeout(() => setInsuranceCompanyOpen(false), 250);
                                  commitInsuranceCompanyValue(insuranceCompanyQuery);
                                }}
                                placeholder="Search..."
                                className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold focus:ring-1 focus:ring-primary outline-none transition-all dark:text-white"
                              />
                              {insuranceSearchLoading && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                  <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                </div>
                              )}
                            </div>

                            {insuranceCompanyOpen && (
                              <div className="absolute z-[110] mt-1 w-[200%] md:w-full max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-section-dark shadow-xl">
                                {/* Alias Suggestion Banner */}
                                {aliasMatch && !aliasDismissed && (
                                  <div className="p-2 border-b border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/40">
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="w-3 h-3 text-orange-600 shrink-0 mt-0.5" />
                                      <div className="flex-1">
                                        <p className="text-[10px] text-orange-800 dark:text-orange-200 font-bold leading-tight">
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
                                            className="px-2 py-0.5 bg-orange-600 text-white text-[9px] font-bold rounded hover:bg-orange-700 transition-colors"
                                          >
                                            Use Suggestion
                                          </button>
                                          <button
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => setAliasDismissed(true)}
                                            className="px-2 py-0.5 border border-orange-300 text-orange-700 text-[9px] font-bold rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
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
                                  onClick={() => { setInsuranceCompanyOpen(false); setIsAddCompanyModalOpen(true); }}
                                  className="w-full text-left px-3 py-2 text-[10px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
                                >
                                  Add New Company
                                  <Building2 className="w-3 h-3" />
                                </button>

                                {insuranceSearchResults.length > 0 ? (
                                  insuranceSearchResults.map((c: any) => (
                                    <button
                                      key={c.id || c.zoho_creator_id}
                                      type="button"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => { commitInsuranceCompanyValue(c.name); setInsuranceCompanyOpen(false); }}
                                      className={`w-full text-left px-3 py-2 text-[10px] hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${insuranceCompanyQuery === c.name ? "font-bold text-primary" : "text-gray-700 dark:text-gray-200"}`}
                                    >
                                      {c.name}
                                    </button>
                                  ))
                                ) : !insuranceSearchLoading && (
                                  <div className="p-3 text-center text-gray-500 text-[10px]">No matches found.</div>
                                )}
                              </div>
                            )}
                          </div>
                          <InputField label="Claim Number" name="claimNumber" value={formData.claimNumber || ""} onChange={handleChange} icon={Tag} required invalid={!!fieldErrors.claimNumber} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="Policy Number" name="policyNumber" value={formData.policyNumber || ""} onChange={handleChange} icon={Hash} invalid={!!fieldErrors.policyNumber} />
                          <DatePicker label="Date of Loss" name="dateOfLoss" value={formData.dateOfLoss || ""} onChange={handleChange} required invalid={!!fieldErrors.dateOfLoss} />
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Adjuster Details ONLY */}
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
                        <SectionHeader title="Adjuster Details" icon={Gavel} />
                        <InputField label="Adjuster Company Name" name="adjusterCompany" value={formData.adjusterCompany || ""} onChange={handleChange} icon={Building2} invalid={!!fieldErrors.adjusterCompany} />
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="First Name" name="adjusterFirstName" value={formData.adjusterFirstName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.adjusterFirstName} />
                          <InputField label="Last Name" name="adjusterLastName" value={formData.adjusterLastName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.adjusterLastName} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <PhoneInputField label="Adjuster Phone" name="adjusterPhone" value={formData.adjusterPhone || ""} onChange={handleChange} required invalid={!!fieldErrors.adjusterPhone} />
                          <InputField label="Phone Extension" name="adjusterPhoneExt" value={formData.adjusterPhoneExt || ""} onChange={handleChange} placeholder="Ext." icon={Hash} invalid={!!fieldErrors.adjusterPhoneExt} />
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {(() => {
                              const adjRecipients = (formData.contactEmails || []).filter((c: any) => c.contactType === "Adjuster (Carrier)");
                              const primary = adjRecipients[0] || { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] };
                              const primaryAbsIdx = (formData.contactEmails || []).findIndex((c: any, i: number) => c.contactType === "Adjuster (Carrier)" && (formData.contactEmails || []).filter((cc: any, ii: number) => cc.contactType === "Adjuster (Carrier)" && ii < i).length === 0);

                              return (
                                <>
                                  {/* Primary Adjuster Email */}
                                  <div className="space-y-2">
                                    <InputField label="Adjuster Email" name="adjusterEmail" value={primary.email || ""} onChange={(e) => {
                                      const next = [...(formData.contactEmails || [])];
                                      const idx = primaryAbsIdx === -1 ? next.length : primaryAbsIdx;
                                      if (primaryAbsIdx === -1) {
                                        next.push({ email: e.target.value, contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] });
                                      } else {
                                        next[idx] = { ...next[idx], email: e.target.value };
                                      }
                                      setFormData({ ...formData, contactEmails: next });
                                    }} type="email" icon={Mail} placeholder="adjuster@insurance.com" required invalid={!!fieldErrors.adjusterEmail} />
                                    <div>
                                      <p className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-tighter">Send copy of</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {SEND_COPY_OPTIONS.map(opt => (
                                          <label key={opt} className="flex items-center gap-1 cursor-pointer text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter hover:text-primary transition-colors">
                                            <input type="checkbox" checked={(primary.sendCopy || []).includes(opt)} onChange={() => {
                                              const next = [...(formData.contactEmails || [])];
                                              const idx = primaryAbsIdx;
                                              if (idx === -1) return;
                                              let currentCopy = primary.sendCopy || [];
                                              if (opt === "all") { currentCopy = currentCopy.includes("all") ? [] : ["all", "report", "invoice", "notifications"]; } else { if (currentCopy.includes(opt)) { currentCopy = currentCopy.filter((o: string) => o !== opt && o !== "all"); } else { currentCopy = [...currentCopy.filter((o: string) => o !== "all"), opt]; if (currentCopy.includes("report") && currentCopy.includes("invoice") && currentCopy.includes("notifications")) { currentCopy = ["all", ...currentCopy]; } } }
                                              next[idx] = { ...next[idx], sendCopy: currentCopy };
                                              setFormData({ ...formData, contactEmails: next });
                                            }} className="w-2.5 h-2.5 rounded border-gray-300 text-primary" />
                                            {opt}
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Additional Adjuster Emails */}
                                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    {adjRecipients.slice(1).map((recipient: any, localIdx: number) => {
                                      const idx = localIdx + 1;
                                      const absIdx = formData.contactEmails.findIndex((c: any, i: number) => c.contactType === "Adjuster (Carrier)" && formData.contactEmails.filter((cc: any, ii: number) => cc.contactType === "Adjuster (Carrier)" && ii < i).length === idx);
                                      return (
                                        <div key={idx} className="bg-gray-50/50 dark:bg-background-dark/60 p-2 rounded-lg border border-gray-100 dark:border-gray-700 space-y-2">
                                          <InputField label={`Additional Adjuster Email #${idx}`} name={`adjEmail_${idx}`} value={recipient.email || ""} onChange={(e) => { const next = [...(formData.contactEmails || [])]; next[absIdx] = { ...next[absIdx], email: e.target.value }; setFormData({ ...formData, contactEmails: next }); }} type="email" icon={Mail} placeholder="additional@company.com" />
                                          <div>
                                            <p className="text-[8px] font-black uppercase text-gray-500 mb-1 tracking-tighter">Send copy of</p>
                                            <div className="flex flex-wrap gap-1.5">
                                              {SEND_COPY_OPTIONS.map(opt => (
                                                <label key={opt} className="flex items-center gap-1 cursor-pointer text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter hover:text-primary transition-colors">
                                                  <input type="checkbox" checked={(recipient.sendCopy || []).includes(opt)} onChange={() => { const next = [...(formData.contactEmails || [])]; let currentCopy = recipient.sendCopy || []; if (opt === "all") { currentCopy = currentCopy.includes("all") ? [] : ["all", "report", "invoice", "notifications"]; } else { if (currentCopy.includes(opt)) { currentCopy = currentCopy.filter((o: string) => o !== opt && o !== "all"); } else { currentCopy = [...currentCopy.filter((o: string) => o !== "all"), opt]; if (currentCopy.includes("report") && currentCopy.includes("invoice") && currentCopy.includes("notifications")) { currentCopy = ["all", ...currentCopy]; } } } next[absIdx] = { ...next[absIdx], sendCopy: currentCopy }; setFormData({ ...formData, contactEmails: next }); }} className="w-2.5 h-2.5 rounded border-gray-300 text-primary" />
                                                  {opt}
                                                </label>
                                              ))}
                                            </div>
                                          </div>
                                          <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, contactEmails: prev.contactEmails.filter((cc: any, i: number) => i !== absIdx) }))} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1">
                                            <X className="w-2.5 h-2.5" />
                                            Remove
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setFormData((prev: any) => ({ ...prev, contactEmails: [...(prev.contactEmails || []), { email: "", contactType: "Adjuster (Carrier)", sendCopy: ["all", "report", "invoice", "notifications"] }] }))}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Another Email
                            </button>
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
                            value={formData.adjusterComments || ""}
                            onChange={handleChange}
                            rows={1}
                            placeholder="Any additional comments from the adjuster..."
                            className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none overflow-hidden transition-all min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* STEP 3: Property Contact Info */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-1 bg-white dark:bg-section-dark px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-800 w-fit">
              <span className="text-sm font-black text-primary">3.</span>
              <h3 className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Property Contact Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
                <SectionHeader title="Property Contact (Policyholder)" icon={User} />

                {/* Primary Contact Details */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="First Name" name="policyholderFirstName" value={formData.policyholderFirstName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.policyholderFirstName} />
                    <InputField label="Last Name" name="policyholderLastName" value={formData.policyholderLastName || ""} onChange={handleChange} icon={UserRound} required invalid={!!fieldErrors.policyholderLastName} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="Property Contact Email" name="propertyContactEmail" value={formData.propertyContactEmail || ""} onChange={handleChange} type="email" placeholder="contact@email.com" icon={Mail} invalid={!!fieldErrors.propertyContactEmail} />
                    <PhoneInputField label="Primary Phone" name="policyholderPhone1" value={formData.policyholderPhone1 || ""} onChange={handleChange} required invalid={!!fieldErrors.policyholderPhone1} />
                  </div>
                </div>

                {/* Secondary Contact Sub-Section */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3 mt-1">
                  <SectionHeader title="Secondary Contact" icon={User} small />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="First Name" name="spouseFirstName" value={formData.spouseFirstName || ""} onChange={handleChange} placeholder="First Name" icon={UserRound} />
                    <InputField label="Last Name" name="spouseLastName" value={formData.spouseLastName || ""} onChange={handleChange} placeholder="Last Name" icon={UserRound} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <PhoneInputField label="Phone" name="policyholderPhone2" value={formData.policyholderPhone2 || ""} onChange={handleChange} placeholder="Optional" invalid={!!fieldErrors.policyholderPhone2} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <AddressGroup
                  streetAddress={formData.streetAddress || ""}
                  addressLine2={formData.addressLine2 || ""}
                  city={formData.city || ""}
                  state={formData.state || ""}
                  zip={formData.zip || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={fieldErrors}
                  hideErrorSMS={true}
                />
              </div>
            </div>
          </section>

          {/* STEP 4: Roofer & Public Adjuster */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-1 bg-white dark:bg-section-dark px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-800 w-fit">
              <span className="text-sm font-black text-primary">4.</span>
              <h3 className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Roofer & Public Adjuster</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2 shadow-sm">
                <SectionHeader title="Roofer Information" icon={Home} optional small />
                <div className="grid grid-cols-2 gap-2">
                  <InputField label="Roofer Name" name="rooferName" value={formData.rooferName || ""} onChange={handleChange} placeholder="Full Name" icon={UserRound} />
                  <InputField label="Roofer Company" name="rooferCompany" value={formData.rooferCompany || ""} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <PhoneInputField label="Roofer Phone" name="rooferPhone" value={formData.rooferPhone || ""} onChange={handleChange} />
                  <InputField label="Roofer Email" name="rooferEmail" value={formData.rooferEmail || ""} onChange={handleChange} type="email" placeholder="roofer@company.com" icon={Mail} />
                </div>
              </div>

              <div className="bg-white dark:bg-background-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <SectionHeader title="Public Adjuster Details" icon={Hand} optional small />
                <div className="grid grid-cols-2 gap-2">
                  <InputField label="Public Adjuster Name" name="publicAdjusterName" value={formData.publicAdjusterName || ""} onChange={handleChange} placeholder="Full Name" icon={UserRound} />
                  <InputField label="Public Company" name="publicAdjusterCompany" value={formData.publicAdjusterCompany || ""} onChange={handleChange} placeholder="Company Name" icon={Building2} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <PhoneInputField label="Phone" name="publicAdjusterPhone" value={formData.publicAdjusterPhone || ""} onChange={handleChange} />
                  <InputField label="Email" name="publicAdjusterEmail" value={formData.publicAdjusterEmail || ""} onChange={handleChange} type="email" placeholder="adjuster@company.com" icon={Mail} />
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer - Ultra Compact */}
        <div className="px-4 py-3 border-t border-gray-200/50 dark:border-gray-800 bg-white dark:bg-background-dark/80 backdrop-blur-lg flex justify-between items-center shrink-0">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">READY FOR SYNC</p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest">Cancel</button>
            <button onClick={handleSubmit} disabled={isSaving} className="px-8 py-2 bg-primary text-white rounded-lg text-[8px] font-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-1.5 uppercase tracking-widest">
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              {isSaving ? "Syncing..." : "Commit Sync"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Add New Company Modal (Nested inside main overlay) ── */}
      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-section-dark w-full max-w-[420px] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-fadeInSection">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-background-dark/50">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="text-primary text-base w-4 h-4" />
                Add New Company
              </h3>
              <button
                onClick={() => setIsAddCompanyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewCompanySubmit} className="px-3.5 py-2.5 space-y-2">
              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Company Name <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="Insurance Co. Name"
                  value={newCompanyData.name}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">CC Invoices To</label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={newCompanyData.ccInvoicesTo}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, ccInvoicesTo: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="splitInvoiceCheckAdmin"
                  checked={newCompanyData.splitInvoice}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, splitInvoice: e.target.checked })}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="splitInvoiceCheckAdmin" className="text-[11px] font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Split Invoice from Report</label>
              </div>

              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Invoice Email</label>
                <input
                  type="email"
                  placeholder="invoice@company.com"
                  value={newCompanyData.invoiceEmail}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, invoiceEmail: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Price List</label>
                <select
                  value={newCompanyData.priceList}
                  onChange={(e) => setNewCompanyData({ ...newCompanyData, priceList: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent cursor-pointer"
                >
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
                <button
                  type="button"
                  disabled={isCreatingCompany || hasSentCompany}
                  onClick={handleAddNewCompanyReset}
                  className="px-3 py-1 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
                {hasSentCompany ? (
                  <div className="px-3.5 py-1 rounded-lg text-[11px] font-bold text-white bg-primary/70 flex items-center gap-1.5 shadow-sm">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-3.5 py-1 rounded-lg text-[11px] font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    Add Company
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInSection {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInSection {
          animation: fadeInSection 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
