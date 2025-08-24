import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercentage(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  const colors = {
    success: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "text-emerald-600",
    },
    warning: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: "text-amber-600",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: "text-red-600",
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "text-blue-600",
    },
    default: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: "text-gray-600",
    },
  };

  return colors[status as keyof typeof colors] || colors.default;
}

export function generateGradient(colors: string[]): string {
  return `linear-gradient(135deg, ${colors.join(", ")})`;
}
// Enhanced error handling utilities
