import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  actions?: React.ReactNode;
  loading?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  variant = "default",
  actions,
  loading = false,
}) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-lg",
    glass: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl",
    gradient:
      "bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-xl",
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variants[variant],
          className,
        )}
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && <div className="h-8 w-8 rounded-lg bg-gray-200" />}
              <div className="space-y-2">
                <div className="h-5 w-32 rounded bg-gray-200" />
                {subtitle && <div className="h-3 w-48 rounded bg-gray-200" />}
              </div>
            </div>
            {actions && <div className="h-8 w-24 rounded bg-gray-200" />}
          </div>
          <div className="h-80 rounded-lg bg-gray-200" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl relative",
        variants[variant],
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {Icon && (
            <motion.div
              className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5 text-blue-600" />
            </motion.div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>

        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {actions}
          </motion.div>
        )}
      </div>

      {/* Chart Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        {children}
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-20 -z-10" />
    </motion.div>
  );
};

export { ChartContainer };
