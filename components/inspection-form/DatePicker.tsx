"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: any;
  invalid?: boolean;
  error?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  invalid,
  error,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse current value to highlight selected date
  const selectedDate = (() => {
    if (!value) return null;
    const parts = value.split("/");
    if (parts.length !== 3) return null;
    const m = parseInt(parts[0]);
    const d = parseInt(parts[1]);
    const y = parseInt(parts[2]);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  })();

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const m = String(viewDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const y = viewDate.getFullYear();
    const formattedDate = `${m}/${d}/${y}`;
    
    // Create a synthetic event
    const event = {
      target: {
        name,
        value: formattedDate,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(event);
    setIsOpen(false);
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const renderCalendar = () => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const monthName = viewDate.toLocaleString("default", { month: "long" });

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate && 
                        selectedDate.getDate() === d && 
                        selectedDate.getMonth() === month && 
                        selectedDate.getFullYear() === year;
      
      const isToday = new Date().getDate() === d && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={`h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
            isSelected 
              ? "bg-primary text-white" 
              : isToday 
                ? "text-primary border border-primary/30" 
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-background-dark"
          }`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="absolute z-50 mt-2 bg-white dark:bg-section-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 w-64 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {monthName} {year}
          </h4>
          <div className="flex gap-1">
            <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-background-dark rounded">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-background-dark rounded">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={`${day}-${idx}`} className="h-8 w-8 flex items-center justify-center text-[10px] font-bold text-gray-400">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label htmlFor={name} className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
        <CalendarIcon className="text-primary dark:text-accent w-3 h-3" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-gray-50 dark:bg-background-dark border rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-8 ${
            invalid
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-200 focus:ring-primary dark:border-gray-700 dark:focus:ring-accent"
          }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary dark:hover:text-accent transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <p className="text-[10px] text-gray-900 font-black bg-gray-200/80 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 inline-block border border-gray-300/50">
          {error}
        </p>
      )}
      {isOpen && renderCalendar()}
    </div>
  );
};
