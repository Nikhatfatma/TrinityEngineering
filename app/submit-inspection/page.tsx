"use client";

import { useState } from "react";
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
  { id: "structural-loss", title: "Structural Loss", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80" },
  { id: "storm-damage", title: "Storm Damage", image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80" },
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
  { id: "light-commercial", title: "Light Commercial (<10,000 sf)", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
  { id: "commercial", title: "Commercial (>10,000 sf)", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { id: "municipal-religious-other", title: "Municipal / Religious / Other", image: "https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=800&q=80" },
  { id: "multiple-structures", title: "Multiple Structures", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
];

const INSURANCE_COMPANIES = [
  "State Farm", "Allstate", "GEICO", "Progressive", "USAA",
  "Liberty Mutual", "Farmers Insurance", "Nationwide", "Travelers",
  "American Family", "Erie Insurance", "Auto-Owners Insurance",
  "Chubb", "Hartford", "Hanover Insurance", "Cincinnati Financial",
  "Amica Mutual", "Safeco", "MetLife", "AIG", "Other",
];

const WIZARD_STEPS = [
  { title: "Inspection", icon: "assignment" },
  { title: "Insurance", icon: "shield" },
  { title: "Policyholder", icon: "person" },
  { title: "Roofer", icon: "roofing" },
  { title: "Adjuster", icon: "gavel" },
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
  iaEmail: string;
  iaPhone: string;
  iaCompany: string;
  iaSecondEmail: string;
  iaThirdEmail: string;
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
  iaEmail: "",
  iaPhone: "",
  iaCompany: "",
  iaSecondEmail: "",
  iaThirdEmail: "",
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

  /* ---- handlers ---- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    // Validation for Step 1
    if (currentStep === 0) {
      if (!formData.inspectionType || !formData.buildingType) {
        setShowErrors(true);
        // Scroll to the first error
        window.scrollTo({ top: 0, behavior: "smooth" });
        return; // Prevent proceeding
      }
      setShowErrors(false); // Clear errors if valid
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
    console.log("Inspection form submitted:", formData);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---- helpers ---- */

  const labelFor = (id: string, list: { id: string; title: string }[]) =>
    list.find((i) => i.id === id)?.title ?? "—";

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
          <div className="bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 sm:p-8 md:p-12 shadow-2xl">
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
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Inspection Type <span className="text-red-500">*</span>
                  </h3>
                  <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1 rounded-2xl transition-colors ${showErrors && !formData.inspectionType ? "border-2 border-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-2 border-transparent"}`}>
                    {INSPECTION_TYPES.map((t) => (
                      <SelectCard
                        key={t.id}
                        label={t.title}
                        value={t.id}
                        image={t.image}
                        selected={formData.inspectionType === t.id}
                        onSelect={() => {
                          setFormData({ ...formData, inspectionType: t.id });
                          if (formData.buildingType) setShowErrors(false);
                        }}
                      />
                    ))}
                  </div>
                  {showErrors && !formData.inspectionType && (
                    <p className="text-red-500 text-sm font-semibold mt-2 ml-1 animate-fadeIn">
                      Please select an inspection type.
                    </p>
                  )}
                </div>

                {/* Building Type */}
                <div>
                  <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Building Type <span className="text-red-500">*</span>
                  </h3>
                  <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1 rounded-2xl transition-colors ${showErrors && !formData.buildingType ? "border-2 border-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-2 border-transparent"}`}>
                    {BUILDING_TYPES.map((b) => (
                      <SelectCard
                        key={b.id}
                        label={b.title}
                        value={b.id}
                        image={b.image}
                        selected={formData.buildingType === b.id}
                        onSelect={() => {
                          setFormData({ ...formData, buildingType: b.id });
                          if (formData.inspectionType) setShowErrors(false);
                        }}
                      />
                    ))}
                  </div>
                  {showErrors && !formData.buildingType && (
                    <p className="text-red-500 text-sm font-semibold mt-2 ml-1 animate-fadeIn">
                      Please select a building type.
                    </p>
                  )}
                </div>
              </FormSection>
            )}

            {/* ======================================= */}
            {/*  STEP 2 – Insurance Carrier Information */}
            {/* ======================================= */}
            {currentStep === 1 && (
              <FormSection
                title="Insurance Carrier Information"
                icon="shield"
                subtitle="Provide the insurance carrier and adjuster details"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="Claim Number"
                      name="claimNumber"
                      value={formData.claimNumber}
                      onChange={handleChange}
                      placeholder="CLM-123456"
                      required
                      icon="tag"
                    />
                    {/* Insurance Company Dropdown */}
                    <div className="space-y-2">
                      <label
                        htmlFor="insuranceCompany"
                        className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-primary dark:text-accent text-sm">business</span>
                        Insurance Company
                      </label>
                      <select
                        id="insuranceCompany"
                        name="insuranceCompany"
                        value={formData.insuranceCompany}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="">Select Insurance Company</option>
                        {INSURANCE_COMPANIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="Adjuster Email"
                      name="adjusterEmail"
                      value={formData.adjusterEmail}
                      onChange={handleChange}
                      type="email"
                      placeholder="adjuster@insurance.com"
                      required
                      icon="email"
                    />
                    <InputField
                      label="Second Email for Report"
                      name="secondEmailForReport"
                      value={formData.secondEmailForReport}
                      onChange={handleChange}
                      type="email"
                      placeholder="optional@email.com"
                      icon="alternate_email"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="Adjuster Phone"
                      name="adjusterPhone"
                      value={formData.adjusterPhone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      icon="phone"
                    />
                    <InputField
                      label="Adjuster Phone Extension"
                      name="adjusterPhoneExt"
                      value={formData.adjusterPhoneExt}
                      onChange={handleChange}
                      placeholder="Ext. 123"
                      icon="dialpad"
                    />
                  </div>

                  {/* Adjuster Comments */}
                  <div className="space-y-2">
                    <label
                      htmlFor="adjusterComments"
                      className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-primary dark:text-accent text-sm">comment</span>
                      Adjuster&apos;s Comments
                    </label>
                    <textarea
                      id="adjusterComments"
                      name="adjusterComments"
                      value={formData.adjusterComments}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Any additional comments from the adjuster..."
                      className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none transition-all"
                    />
                  </div>

                  {/* IA Toggle */}
                  <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <CheckboxToggle
                      label="This claim is being submitted by an IA"
                      checked={formData.isIAClaim}
                      onChange={(checked) =>
                        setFormData({ ...formData, isIAClaim: checked })
                      }
                    >
                      <div className="bg-white dark:bg-section-dark rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-5">
                        <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Independent Adjuster Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <InputField label="IA First Name" name="iaFirstName" value={formData.iaFirstName} onChange={handleChange} placeholder="First Name" icon="badge" />
                          <InputField label="IA Last Name" name="iaLastName" value={formData.iaLastName} onChange={handleChange} placeholder="Last Name" icon="badge" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <InputField label="IA Email" name="iaEmail" value={formData.iaEmail} onChange={handleChange} type="email" placeholder="ia@company.com" icon="email" />
                          <InputField label="IA Phone" name="iaPhone" value={formData.iaPhone} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" icon="phone" />
                        </div>
                        <InputField label="IA Company" name="iaCompany" value={formData.iaCompany} onChange={handleChange} placeholder="Company Name" icon="business" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <InputField label="IA Second Email" name="iaSecondEmail" value={formData.iaSecondEmail} onChange={handleChange} type="email" placeholder="optional@email.com" icon="alternate_email" />
                          <InputField label="IA Third Email" name="iaThirdEmail" value={formData.iaThirdEmail} onChange={handleChange} type="email" placeholder="optional@email.com" icon="alternate_email" />
                        </div>
                      </div>
                    </CheckboxToggle>
                  </div>
                </div>
              </FormSection>
            )}

            {/* ====================================== */}
            {/*  STEP 3 – Policyholder Information     */}
            {/* ====================================== */}
            {currentStep === 2 && (
              <FormSection
                title="Policyholder Information"
                icon="person"
                subtitle="Enter the policyholder and property details"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Policyholder First Name" name="policyholderFirstName" value={formData.policyholderFirstName} onChange={handleChange} placeholder="First Name" required icon="badge" />
                    <InputField label="Policyholder Last Name" name="policyholderLastName" value={formData.policyholderLastName} onChange={handleChange} placeholder="Last Name" required icon="badge" />
                  </div>
                  <InputField label="Policyholder Phone 1" name="policyholderPhone1" value={formData.policyholderPhone1} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" required icon="phone" />

                  {/* Spouse / Second Policyholder */}
                  <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary dark:text-accent text-base">group</span>
                      Spouse / Second Policyholder
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField label="First Name" name="spouseFirstName" value={formData.spouseFirstName} onChange={handleChange} placeholder="First Name" icon="badge" />
                      <InputField label="Last Name" name="spouseLastName" value={formData.spouseLastName} onChange={handleChange} placeholder="Last Name" icon="badge" />
                    </div>
                  </div>

                  <InputField label="Policyholder Phone 2" name="policyholderPhone2" value={formData.policyholderPhone2} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" icon="phone" />

                  {/* Address */}
                  <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                    <AddressGroup
                      streetAddress={formData.streetAddress}
                      addressLine2={formData.addressLine2}
                      city={formData.city}
                      state={formData.state}
                      zip={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </FormSection>
            )}

            {/* ============================== */}
            {/*  STEP 4 – Roofer Information   */}
            {/* ============================== */}
            {currentStep === 3 && (
              <FormSection
                title="Roofer Information"
                icon="roofing"
                subtitle="Provide roofer details if applicable"
                optional
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Roofer Name" name="rooferName" value={formData.rooferName} onChange={handleChange} placeholder="Full Name" icon="badge" />
                    <InputField label="Roofer Company" name="rooferCompany" value={formData.rooferCompany} onChange={handleChange} placeholder="Company Name" icon="business" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Roofer Phone" name="rooferPhone" value={formData.rooferPhone} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" icon="phone" />
                    <InputField label="Inspection Name" name="inspectionName" value={formData.inspectionName} onChange={handleChange} placeholder="Inspection Name" icon="description" />
                  </div>
                </div>
              </FormSection>
            )}

            {/* ======================================== */}
            {/*  STEP 5 – Public Adjuster Information    */}
            {/* ======================================== */}
            {currentStep === 4 && (
              <FormSection
                title="Public Adjuster Information"
                icon="gavel"
                subtitle="Provide public adjuster details if applicable"
                optional
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Public Adjuster Name" name="publicAdjusterName" value={formData.publicAdjusterName} onChange={handleChange} placeholder="Full Name" icon="badge" />
                    <InputField label="Public Adjuster Company" name="publicAdjusterCompany" value={formData.publicAdjusterCompany} onChange={handleChange} placeholder="Company Name" icon="business" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Public Adjuster Phone" name="publicAdjusterPhone" value={formData.publicAdjusterPhone} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" icon="phone" />
                    <InputField label="Public Adjuster Email" name="publicAdjusterEmail" value={formData.publicAdjusterEmail} onChange={handleChange} type="email" placeholder="adjuster@company.com" icon="email" />
                  </div>
                </div>
              </FormSection>
            )}

            {/* ========================= */}
            {/*  STEP 6 – Review & Submit */}
            {/* ========================= */}
            {currentStep === 5 && (
              <FormSection
                title="Review & Submit"
                icon="check_circle"
                subtitle="Review your information before submitting"
              >
                <div className="space-y-5">
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
                        <ReviewRow label="IA Email" value={formData.iaEmail} />
                        <ReviewRow label="IA Phone" value={formData.iaPhone} />
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
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">send</span>
                  Send Inspection
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </main>

      <Footer />

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
