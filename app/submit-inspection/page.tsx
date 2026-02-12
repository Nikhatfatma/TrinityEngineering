"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SubmitInspectionPage() {
  const [currentStage, setCurrentStage] = useState(0); // 0 = service selection, 1-4 = form stages
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    incidentDate: "",
    priority: "standard",
    description: "",
  });

  const services = [
    {
      name: "Structural Failure",
      slug: "structural",
      icon: "architecture",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
      description: "Foundation settlement, framing failures, load-bearing analysis",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Storm Damage",
      slug: "storm-damage",
      icon: "cyclone",
      image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&q=80",
      description: "Hurricane, wind, hail, tornado damage assessment",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Water Loss",
      slug: "water-loss",
      icon: "opacity",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
      description: "Plumbing failure, flooding, intrusion analysis",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      name: "FORTIFIED Roof",
      slug: "fortified",
      icon: "roofing",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&q=80",
      description: "Official FORTIFIED certification and evaluation",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Large Loss",
      slug: "large-loss",
      icon: "warning",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
      description: "Complex multi-discipline catastrophic investigations",
      color: "from-red-500 to-red-600",
    },
    {
      name: "Lightning Damage",
      slug: "lightning",
      icon: "bolt",
      image: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=600&q=80",
      description: "Direct and indirect lightning strike analysis",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Chimney Collapse",
      slug: "chimney",
      icon: "home",
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
      description: "Masonry failure and structural chimney investigation",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Component Failure",
      slug: "component",
      icon: "build",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80",
      description: "HVAC, appliance, building system component analysis",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      name: "HVAC/Electrical",
      slug: "hvac",
      icon: "electrical_services",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
      description: "Mechanical and electrical system failure investigation",
      color: "from-teal-500 to-teal-600",
    },
    {
      name: "Fire Investigation",
      slug: "fire",
      icon: "local_fire_department",
      image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=600&q=80",
      description: "Origin and cause determination for fires",
      color: "from-rose-500 to-rose-600",
    },
    {
      name: "Plumbing Failure",
      slug: "plumbing",
      icon: "plumbing",
      image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80",
      description: "Water heater, pipe breaks, fixture malfunction",
      color: "from-sky-500 to-sky-600",
    },
    {
      name: "Fraud Investigation",
      slug: "fraud",
      icon: "gavel",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
      description: "Forensic analysis of intentional vs accidental damage",
      color: "from-gray-600 to-gray-700",
    },
  ];

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  ];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStage(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, service: selectedService.name });
    // Handle form submission
  };

  const stages = [
    { title: "Select Service", icon: "category" },
    { title: "Contact Info", icon: "person" },
    { title: "Location", icon: "location_on" },
    { title: "Case Details", icon: "description" },
    { title: "Review & Submit", icon: "check_circle" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background-dark dark:via-section-dark dark:to-background-dark">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent px-5 py-3 rounded-full mb-6 border border-primary/20">
              <span className="material-symbols-outlined text-base">send</span>
              <span className="font-bold text-sm uppercase tracking-wider">
                New Investigation Request
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Submit Inspection Request
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {currentStage === 0 
                ? "Select your investigation type to get started" 
                : "Complete the form and our PE engineers will respond within 24 hours"}
            </p>
          </div>

          {/* Progress Bar */}
          {currentStage > 0 && (
            <div className="mb-12">
              <div className="relative max-w-4xl mx-auto">
                {/* Background connecting line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
                
                {/* Active progress line */}
                <div 
                  className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 via-primary to-accent transition-all duration-500"
                  style={{ 
                    width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` 
                  }}
                ></div>

                {/* Steps */}
                <div className="relative flex items-center justify-between">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex flex-col items-center relative z-10">
                      {/* Circle with shadow */}
                      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-all duration-300 ${
                        index < currentStage 
                          ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                          : index === currentStage
                          ? 'bg-primary dark:bg-accent shadow-xl shadow-primary/50 dark:shadow-accent/50 scale-110'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <span className={`material-symbols-outlined text-xl transition-all ${
                          index <= currentStage ? 'text-white' : 'text-gray-500'
                        }`}>
                          {index < currentStage ? 'check' : stage.icon}
                        </span>
                        
                        {/* Pulse animation for active step */}
                        {index === currentStage && (
                          <span className="absolute inset-0 rounded-full bg-primary dark:bg-accent animate-ping opacity-20"></span>
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={`text-xs font-bold mt-3 text-center max-w-[80px] hidden md:block transition-colors ${
                        index <= currentStage ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {stage.title}
                      </span>
                      
                      {/* Step number for mobile */}
                      <span className={`text-xs font-bold mt-2 md:hidden ${
                        index <= currentStage ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stage 0: Service Selection Grid */}
          {currentStage === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <button
                  key={service.slug}
                  onClick={() => handleServiceSelect(service)}
                  className="group relative bg-white dark:bg-section-dark rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-accent transition-all hover:shadow-2xl hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-60`}></div>
                    
                    {/* Icon */}
                    <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 dark:bg-black/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <span className={`material-symbols-outlined text-3xl bg-gradient-to-br ${service.color} bg-clip-text text-transparent`}>
                        {service.icon}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Arrow */}
                    <div className="mt-4 flex items-center text-primary dark:text-accent font-bold text-sm">
                      <span>Select Service</span>
                      <span className="material-symbols-outlined ml-2 group-hover:translate-x-2 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Form Stages */}
          {currentStage > 0 && (
            <div className="max-w-4xl mx-auto">
              {/* Selected Service Banner */}
              <div className="mb-8 bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-3xl text-white">
                        {selectedService.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Selected Service</p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">{selectedService.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStage(0);
                      setSelectedService(null);
                    }}
                    className="text-sm font-bold text-gray-500 hover:text-primary dark:hover:text-accent transition-colors"
                  >
                    Change Service
                  </button>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white dark:bg-section-dark rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Stage 1: Contact Information */}
                  {currentStage === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                            person
                          </span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                          Contact Information
                        </h2>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">badge</span>
                            Full Name *
                          </label>
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                            placeholder="John Smith"
                            type="text"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">business</span>
                            Company/Organization
                          </label>
                          <input
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                            placeholder="ABC Insurance Company"
                            type="text"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">email</span>
                            Email Address *
                          </label>
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                            placeholder="john@company.com"
                            type="email"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">phone</span>
                            Phone Number *
                          </label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                            placeholder="+1 (555) 000-0000"
                            type="tel"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 2: Property Location */}
                  {currentStage === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                            location_on
                          </span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                          Property Location
                        </h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">home</span>
                            Street Address *
                          </label>
                          <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                            placeholder="123 Main Street"
                            type="text"
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              City *
                            </label>
                            <input
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                              placeholder="City"
                              type="text"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              State *
                            </label>
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                              required
                            >
                              <option value="">Select</option>
                              {states.map((state) => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              ZIP Code *
                            </label>
                            <input
                              name="zip"
                              value={formData.zip}
                              onChange={handleChange}
                              className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                              placeholder="12345"
                              type="text"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 3: Case Details */}
                  {currentStage === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary dark:text-accent text-2xl">
                            description
                          </span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                          Case Details
                        </h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-sm">event</span>
                              Incident Date
                            </label>
                            <input
                              name="incidentDate"
                              value={formData.incidentDate}
                              onChange={handleChange}
                              className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all"
                              type="date"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-sm">speed</span>
                              Priority Level *
                            </label>
                            <select
                              name="priority"
                              value={formData.priority}
                              onChange={handleChange}
                              className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                              required
                            >
                              <option value="standard">Standard (3-5 days)</option>
                              <option value="expedited">Expedited (24-48 hours)</option>
                              <option value="emergency">Emergency (Same Day)</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                            Incident Description *
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-background-dark border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent resize-none transition-all"
                            placeholder="Please provide a detailed description of the damage, incident, or failure requiring investigation..."
                            rows={8}
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage 4: Review & Submit */}
                  {currentStage === 4 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-green-500 text-2xl">
                            check_circle
                          </span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                          Review & Submit
                        </h2>
                      </div>

                      {/* Review Summary */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Contact Information</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Name</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{formData.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Email</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{formData.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Phone</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{formData.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Company</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{formData.company || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Property Location</h4>
                          <p className="text-gray-900 dark:text-white font-semibold">
                            {formData.address}, {formData.city}, {formData.state} {formData.zip}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Case Details</h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Service Type</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{selectedService.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Priority</p>
                              <p className="font-semibold text-gray-900 dark:text-white capitalize">{formData.priority}</p>
                            </div>
                            {formData.incidentDate && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Incident Date</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{formData.incidentDate}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-500 dark:text-gray-400 mb-2">Description</p>
                              <p className="text-gray-900 dark:text-white">{formData.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
                    {currentStage > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStage(currentStage - 1)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                      </button>
                    )}
                    
                    {currentStage < 4 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStage(currentStage + 1)}
                        className="ml-auto inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        Continue
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="ml-auto inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        <span className="material-symbols-outlined">send</span>
                        Submit Request
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
