import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { LoginCard } from "./login-card";
import { AuthToast } from "./auth-toast";
import { showAuthToast } from "./auth-toast";
import type { LoginFormData, AuthError } from "./types";

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation - you can replace this with actual API call
      if (data.email === "admin@dome.com" && data.password === "password123") {
        showAuthToast.success("Login successful! Redirecting to dashboard...");
        // Here you would typically:
        // 1. Store auth token
        // 2. Update user state
        // 3. Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      const authError: AuthError = {
        message: errorMessage,
        type: "error"
      };
      setError(authError);
      showAuthToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={twMerge([
        "min-h-screen flex items-center justify-center p-4 flex-col",
        "before:fixed before:inset-0 before:bg-noise before:z-[-1]",
        "after:bg-temper after:opacity-15 after:bg-contain after:fixed after:inset-0 after:blur-xl after:z-[-1]",
      ])}
    >
      {/* Background gradient */}
      <div className="before:fixed before:inset-x-0 before:top-0 before:h-80 before:bg-gradient-to-b before:from-black/50 before:to-transparent before:z-[-1]" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-shadow-lg text-shadow-primary mb-2">
              Dome Security
            </h1>
            <p className="text-foreground/60 text-lg">
              Advanced Intelligence Platform
            </p>
          </div>
        </div>

        {/* Login Card */}
        <LoginCard
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />

        {/* Demo credentials */}
      </div>
      <div className="mt-8 text-center relative md:absolute md:top-12 md:right-12">
        <div className="inline-block p-4 rounded-lg border border-foreground/20 bg-foreground/5">
          <p className="text-foreground/60 text-sm mb-2">Demo Credentials:</p>
          <div className="text-xs text-foreground/50 space-y-1">
            <div>Email: admin@dome.com</div>
            <div>Password: password123</div>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-full" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-accent/10 rounded-full" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-primary/5 rounded-full" />
        <div className="absolute top-1/3 right-10 w-20 h-20 border border-accent/5 rounded-full" />
      </div>

      {/* Toast notifications */}
      <AuthToast />
    </div>
  );
}; 