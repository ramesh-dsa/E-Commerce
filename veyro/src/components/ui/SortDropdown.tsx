"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SortOptionItem<T extends string = string> {
  value: T;
  label: string;
}

interface SortDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SortOptionItem<T>[];
  label?: string;
  className?: string;
}

export function SortDropdown<T extends string = string>({
  value,
  onChange,
  options,
  label = "SORT BY:",
  className = "",
}: SortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 select-none">
          {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`${label} ${selectedOption?.label}`}
          className="group inline-flex items-center justify-between gap-2.5 h-9 bg-white border border-neutral-200/90 hover:border-neutral-400 text-xs font-semibold text-neutral-900 rounded-xl px-3.5 transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-neutral-900/10 shadow-2xs hover:bg-neutral-50/50"
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            size={12}
            className={`text-neutral-400 group-hover:text-neutral-900 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute right-0 top-full mt-1.5 w-48 bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl shadow-xl p-1 z-40 animate-in fade-in zoom-in-95 duration-100"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "font-bold text-neutral-950 bg-neutral-100"
                      : "font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check size={13} className="text-neutral-950 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
