"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  icon?: React.ReactNode;
}

export default function AnimatedSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  icon,
}: AnimatedSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          "w-full rounded-lg border-2 border-input bg-background px-4 py-3",
          "text-foreground placeholder:text-muted-foreground",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200",
          "hover:border-primary/50"
        )}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}