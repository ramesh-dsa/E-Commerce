"use client";

import React, { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

export interface CountUpProps {
  value: number;
  prefix?: string;
  className?: string;
}

export function CountUp({ value, prefix = "", className = "" }: CountUpProps) {
  // Mount with 0 so NumberFlow animates from 0 -> value on initial load
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <NumberFlow
      value={displayValue}
      locales="en-IN"
      format={{ maximumFractionDigits: 0 }}
      prefix={prefix}
      className={`tabular-nums ${className}`}
    />
  );
}
