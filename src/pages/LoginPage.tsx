import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginFormData } from "../types/auth";
import { authenticate } from "../services/auth.service";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { LoginCard } from "../components/auth/LoginCard";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    accessCode: "",
    role: "PARENT",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userRole) {
      navigate(`/${userRole.toLowerCase()}`);
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authenticate(formData.accessCode, formData.role);

      if (response.success && response.user) {
        login(response.user);
        navigate(`/${response.user.role.toLowerCase()}`);
        toast.success("Login successful!");
      } else {
        toast.error(response.error || "Invalid access code");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjMDAwIiBzdG9wLW9wYWNpdHk9Ii4wNSIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiMwMDAiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIxMDAlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGgxNDQwdjUxMkgweiIgZmlsbD0idXJsKCNhKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50" />

      <LoginCard
        formData={formData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onRoleChange={(role) => setFormData((prev) => ({ ...prev, role }))}
        onAccessCodeChange={(accessCode) =>
          setFormData((prev) => ({ ...prev, accessCode }))
        }
        logoUrl="https://fs001.classter.com/londonacademy/8537/4/2024/9/Photo/thumbnail-logo-elite-copy-ab093918-86d9-4f71-99e7-170f3773aafa.png" // Replace with your logo URL
      />
    </div>
  );
}
