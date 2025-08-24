import React from "react";
import { Users, School } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: "PARENT" | "TEACHER") => void;
  isLoading: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onRoleChange("PARENT")}
        className={`group relative p-6 rounded-xl border-2 transition-all duration-200 ${
          selectedRole === "PARENT"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
        }`}
        disabled={isLoading}
      >
        <div className="flex flex-col items-center">
          <div
            className={`p-3 rounded-full mb-3 transition-colors duration-200 ${
              selectedRole === "PARENT"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
            }`}
          >
            <Users className="w-6 h-6" />
          </div>
          <span
            className={`font-medium ${
              selectedRole === "PARENT" ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Parent
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onRoleChange("TEACHER")}
        className={`group relative p-6 rounded-xl border-2 transition-all duration-200 ${
          selectedRole === "TEACHER"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
        }`}
        disabled={isLoading}
      >
        <div className="flex flex-col items-center">
          <div
            className={`p-3 rounded-full mb-3 transition-colors duration-200 ${
              selectedRole === "TEACHER"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
            }`}
          >
            <School className="w-6 h-6" />
          </div>
          <span
            className={`font-medium ${
              selectedRole === "TEACHER" ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Teacher
          </span>
        </div>
      </button>
    </div>
  );
};
