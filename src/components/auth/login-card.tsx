import { twMerge } from "tailwind-merge";
import { Frame } from "@/components/ui/frame";
import { Shield, Zap, Users } from "lucide-react";
import { LoginForm } from "./login-form";
import type { LoginFormData, AuthError } from "./types";

interface LoginCardProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: AuthError | null;
}

export const LoginCard = ({ onSubmit, isLoading = false, error }: LoginCardProps) => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main Card Frame */}
      <div
        className={twMerge([
          "relative px-12 py-16",
          "[--color-frame-1-stroke:var(--color-primary)]",
          "[--color-frame-1-fill:var(--color-primary)]/15",
          "[--color-frame-2-stroke:var(--color-primary)]/40",
          "[--color-frame-2-fill:transparent]",
          "[--color-frame-3-stroke:var(--color-accent)]/30",
          "[--color-frame-3-fill:var(--color-accent)]/10",
        ])}
      >
        <Frame
          enableBackdropBlur
          className="drop-shadow-2xl drop-shadow-primary/30"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","25","12"],["L","100% - 23","12"],["L","100% - 7","30"],["L","100% - 6","0% + 26.666666666666668%"],["L","100% - 14","0% + 28.641975308641975%"],["L","100% - 14","100% - 35.55555555555556%"],["L","100% - 7","100% - 33.33333333333332%"],["L","100% - 7","100% - 40"],["L","100% - 22","100% - 25"],["L","50% + 7.5","100% - 25"],["L","50% - 6.5","100% - 9"],["L","24","100% - 9"],["L","9","100% - 24"],["L","9","100% - 33.58024691358026%"],["L","17","100% - 36.04938271604938%"],["L","17","0% + 28.641975308641975%"],["L","8","0% + 26.666666666666668%"],["L","8","30"],["L","25","12"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","50% + 12.5","100% - 19"],["L","50% + 25","100% - 19"],["L","50% + 17","100% - 11.5"],["L","50% + 4.5","100% - 11.5"],["L","50% + 12.5","100% - 19"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","50% + 30.5","100% - 19"],["L","50% + 40","100% - 19"],["L","50% + 34","100% - 13.5"],["L","50% + 24.5","100% - 13.5"],["L","50% + 30.5","100% - 19"]]}]'
          )}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                  <Shield className="size-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent/80 rounded-full flex items-center justify-center">
                  <Zap className="size-3 text-accent-foreground" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-shadow-lg text-shadow-primary mb-2">
              Access Control
            </h1>
            <p className="text-foreground/60 text-sm">
              Enter your credentials to access the secure dashboard
            </p>
          </div>

          {/* Login Form */}
          <LoginForm 
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-foreground/40 text-xs">
              <Users className="size-3 mr-1" />
              <span>Secure access for authorized personnel only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 border border-primary/30 rounded-full" />
      <div className="absolute -bottom-4 -right-4 w-6 h-6 border border-accent/30 rounded-full" />
      <div className="absolute top-1/2 -left-2 w-4 h-4 border border-primary/20 rounded-full" />
      <div className="absolute top-1/3 -right-2 w-3 h-3 border border-accent/20 rounded-full" />
    </div>
  );
}; 