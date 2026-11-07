import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "danger" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-brand-primary text-white hover:bg-brand-primary/80",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-status-danger-bg text-status-danger-text",
    outline: "text-gray-800 border border-gray-300",
    success: "bg-status-success-bg text-status-success-text",
    danger: "bg-status-danger-bg text-status-danger-text",
    warning: "bg-status-warning-bg text-status-warning-text",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };