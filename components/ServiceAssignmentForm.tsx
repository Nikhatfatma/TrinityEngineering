"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface ServiceAssignmentFormProps {
  serviceType?: string;
}

export default function ServiceAssignmentForm({ serviceType = "" }: ServiceAssignmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    
    // Property Information
    propertyAddress: "",
    city: "",
    state: "",
    zip: "",
    propertyType: "",
    
    // Claim Information
    claimNumber: "",
    dateOfLoss: "",
    insuranceCarrier: "",
    policyNumber: "",
    
    // Assignment Details
    serviceType: serviceType,
    priorityLevel: "standard",
    inspectionContact: "",
    inspectionPhone: "",
    accessInstructions: "",
    
    // Description
    lossDescription: "",
    specificConcerns: "",
    
    // File Upload
    files: [] as File[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const propertyTypes = [
    "Single Family Residence",
    "Multi-Family Dwelling",
    "Condominium",
    "Townhome",
    "Commercial Building",
    "Industrial Facility",
    "Warehouse",
    "Office Building",
    "Retail Center",
    "Other",
  ];

  const priorityLevels = [
    { value: "standard", label: "Standard (5-7 business days)", color: "blue" },
    { value: "expedited", label: "Expedited (48-72 hours)", color: "orange" },
    { value: "emergency", label: "Emergency (24 hours)", color: "red" },
  ];

  const steps = [
    { number: 1, title: "Contact Info", icon: "person" },
    { number: 2, title: "Property Details", icon: "home" },
    { number: 3, title: "Claim Information", icon: "assignment" },
    { number: 4, title: "Assignment Details", icon: "schedule" },
    { number: 5, title: "Review & Submit", icon: "check_circle" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.propertyAddress && formData.city && formData.state && formData.zip && formData.propertyType);
      case 3:
        return !!formData.dateOfLoss;
      case 4:
        return !!(formData.serviceType && formData.inspectionContact && formData.inspectionPhone && formData.lossDescription);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      alert("Please fill in all required fields before continuing.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Assignment submitted:", formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white dark:bg-section-dark rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">
              check_circle
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Assignment Submitted Successfully!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Your case has been received and assigned reference number:
          </p>
          <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-6 mb-8">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-500 mb-2">
              Reference Number
            </div>
            <div className="text-3xl font-bold text-primary dark:text-accent">
              TRI-{new Date().getTime().toString().slice(-6)}
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined text-primary dark:text-accent">
                schedule
              </span>
              <span>Our team will contact you within 24 hours</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined text-primary dark:text-accent">
                email
              </span>
              <span>Confirmation email sent to {formData.email}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setCurrentStep(1);
                setFormData({
                  firstName: "",
                  lastName: "",
                  company: "",
                  email: "",
                  phone: "",
                  propertyAddress: "",
                  city: "",
                  state: "",
                  zip: "",
                  propertyType: "",
                  claimNumber: "",
                  dateOfLoss: "",
                  insuranceCarrier: "",
                  policyNumber: "",
                  serviceType: serviceType,
                  priorityLevel: "standard",
                  inspectionContact: "",
                  inspectionPhone: "",
                  accessInstructions: "",
                  lossDescription: "",
                  specificConcerns: "",
                  files: [],
                });
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white rounded-lg font-semibold transition-all"
            >
              Submit Another Assignment
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>
          <div
            className="absolute top-6 left-0 h-0.5 bg-primary dark:bg-accent transition-all duration-500 -z-10"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step.number < currentStep
                    ? "bg-primary dark:bg-accent text-white"
                    : step.number === currentStep
                    ? "bg-primary dark:bg-accent text-white ring-4 ring-primary/20 dark:ring-accent/20"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500"
                }`}
              >
                {step.number < currentStep ? (
                  <span className="material-icons text-lg">check</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">{step.icon}</span>
                )}
              </div>
              <div
                className={`mt-2 text-xs font-semibold text-center hidden md:block ${
                  step.number <= currentStep
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-500"
                }`}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-section-dark rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Let us know how to reach you
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Property Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us about the property to be inspected
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Property Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Claim Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Claim Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide insurance and claim details
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Claim Number
                  </label>
                  <input
                    type="text"
                    name="claimNumber"
                    value={formData.claimNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date of Loss <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfLoss"
                    value={formData.dateOfLoss}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Insurance Carrier
                  </label>
                  <input
                    type="text"
                    name="insuranceCarrier"
                    value={formData.insuranceCarrier}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Assignment Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Assignment Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us about your investigation needs
                </p>
              </div>
              <div className="space-y-6">
                {!serviceType && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Investigation Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Investigation Type</option>
                      <option value="Structural Analysis">Structural Analysis</option>
                      <option value="Storm Damage Assessment">Storm Damage Assessment</option>
                      <option value="Water Loss Investigation">Water Loss Investigation</option>
                      <option value="FORTIFIED Roof Certification">FORTIFIED Roof Certification</option>
                      <option value="Large Loss Assessment">Large Loss Assessment</option>
                      <option value="Lightning Damage Analysis">Lightning Damage Analysis</option>
                      <option value="Fraud Investigation">Vandalism/Fraud Investigation</option>
                      <option value="Chimney Collapse Investigation">Chimney Collapse Investigation</option>
                      <option value="Component Failure Analysis">Component Failure Analysis</option>
                      <option value="HVAC/Electrical Failures">HVAC/Electrical Failures</option>
                      <option value="Fire Investigation">Small Fire Investigation</option>
                      <option value="Plumbing Failure Analysis">Plumbing Failure Analysis</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {priorityLevels.map((level) => (
                      <label
                        key={level.value}
                        className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.priorityLevel === level.value
                            ? "border-primary dark:border-accent bg-primary/5 dark:bg-accent/5"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="priorityLevel"
                          value={level.value}
                          checked={formData.priorityLevel === level.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {level.label}
                          </p>
                        </div>
                        {formData.priorityLevel === level.value && (
                          <span className="material-symbols-outlined text-primary dark:text-accent">
                            check_circle
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      On-Site Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="inspectionContact"
                      value={formData.inspectionContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      On-Site Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="inspectionPhone"
                      value={formData.inspectionPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description of Loss/Damage <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="lossDescription"
                    value={formData.lossDescription}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all resize-none"
                    placeholder="Provide a detailed description of the damage..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Access Instructions
                  </label>
                  <textarea
                    name="accessInstructions"
                    value={formData.accessInstructions}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all resize-none"
                    placeholder="Gate codes, lockbox information, parking instructions..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary dark:hover:border-accent transition-all">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 block">
                        cloud_upload
                      </span>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PDF, DOC, JPG, PNG, HEIC (max 10MB per file)
                      </p>
                    </label>
                  </div>
                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary dark:text-accent">
                              description
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <span className="material-icons text-lg">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Review Your Assignment
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please review the information below before submitting
                </p>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-accent">person</span>
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Name:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Company:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.company || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Email:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Phone:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-accent">home</span>
                    Property Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Address:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.propertyAddress}, {formData.city}, {formData.state} {formData.zip}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Property Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.propertyType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="bg-gray-50 dark:bg-background-dark rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-accent">assignment</span>
                    Assignment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Investigation Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.serviceType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Priority:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {priorityLevels.find(l => l.value === formData.priorityLevel)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Date of Loss:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.dateOfLoss}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Files Attached:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
                        {formData.files.length} file(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
              >
                <span className="material-icons">arrow_back</span>
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Next Step
                <span className="material-icons">arrow_forward</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-icons animate-spin">refresh</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-icons">send</span>
                    Submit Assignment
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
