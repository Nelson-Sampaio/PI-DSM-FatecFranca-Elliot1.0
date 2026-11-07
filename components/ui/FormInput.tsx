
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors",
            error ? "border-status-danger-text focus:ring-status-danger-text" : "border-border",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-status-danger-text">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
