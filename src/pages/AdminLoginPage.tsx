import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLoginCard } from "../components/auth/admin/AdminLoginCard";
import { useAuth } from "../hooks/useAuth"; // Import useAuth
import toast from "react-hot-toast";

const VITE_API_URL = import.meta.env.VITE_API_URL as string;

interface AdminLoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string; // Should match "ADMIN"
  };
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from useAuth
  const [formData, setFormData] = useState<AdminLoginForm>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${VITE_API_URL}/api/auth/clogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Call login from useAuth to update state
      login({
        id: data.user.id,
        role: data.user.role as "ADMIN", // Ensure the role is correct
        name: data.user.name,
      });

      // Store the token in localStorage (if required for API calls)
      localStorage.setItem("token", data.token);

      // Redirect to the admin dashboard
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login failed:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-50" />
      <AdminLoginCard
        formData={formData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))}
        onPasswordChange={(password) =>
          setFormData((prev) => ({ ...prev, password }))
        }
        logoUrl="https://fs001.classter.com/londonacademy/8537/4/2024/9/Photo/thumbnail-logo-elite-copy-ab093918-86d9-4f71-99e7-170f3773aafa.png"
        error={error}
      />
    </div>
  );
}
