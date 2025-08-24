import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckboxRoot, CheckboxLabel, CheckboxControl } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, Shield, Zap } from "lucide-react";
import type { LoginFormData, AuthError } from "./types";
import { validateLoginForm } from "./utils";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: AuthError | null;
}

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<AuthError | null>(null);

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationError?.field === field) {
      setValidationError(null);
    }
  };

  const rememberMe = () => {
    setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }));
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateLoginForm(formData);
    if (error) {
      setValidationError(error);
      return;
    }

    onSubmit(formData);
  };

  const currentError = error || validationError;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 flex items-center">
            <Mail className="size-4 mr-2" />
            Email Address
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={twMerge(
                "w-full",
                currentError?.field === "email" && "border-red-500"
              )}
            />
            {currentError?.field === "email" && (
              <div className="text-red-400 text-xs mt-1 flex items-center">
                <Shield className="size-3 mr-1" />
                {currentError.message}
              </div>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80 flex items-center">
            <Lock className="size-4 mr-2" />
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={twMerge(
                "w-full pr-12",
                currentError?.field === "password" && "border-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            {currentError?.field === "password" && (
              <div className="text-red-400 text-xs mt-1 flex items-center">
                <Shield className="size-3 mr-1" />
                {currentError.message}
              </div>
            )}
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <CheckboxRoot
            checked={formData.rememberMe}
            onCheckedChange={rememberMe}
            onClick={rememberMe}
          >
            <CheckboxControl />
            <CheckboxLabel className="text-sm text-foreground/70">
              Remember me
            </CheckboxLabel>
          </CheckboxRoot>
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-medium"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Signing in...
            </div>
          ) : (
            <div className="flex items-center">
              <Zap className="size-4 mr-2" />
              Sign In
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}; 