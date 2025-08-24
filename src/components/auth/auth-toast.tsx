import { createToaster, Toaster as ToasterRoot, ToastRoot, ToastTitle, ToastDescription, ToastCloseTrigger } from "@/components/ui/toast";
import { CheckCircle, Info, XCircle } from "lucide-react";
import type { AuthError } from "./types";

// Create toaster instance
export const authToaster = createToaster({
  placement: "bottom-end",
  duration: 5000,
});

interface AuthToastProps {
  error?: AuthError | null;
  success?: string;
  info?: string;
}

export const AuthToast = ({ error, success, info }: AuthToastProps) => {
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;
    const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info';
    
    authToaster.create({
      title: (
        <ToastTitle>
          <div className="flex items-center">
            {icon({ className: "size-4 mr-2" })}
            {title}
          </div>
        </ToastTitle>
      ),
      description: <ToastDescription>{message}</ToastDescription>,
    });
  };

  // Show toasts based on props
  if (error) {
    showToast('error', error.message);
  }
  if (success) {
    showToast('success', success);
  }
  if (info) {
    showToast('info', info);
  }

  return (
    <ToasterRoot toaster={authToaster}>
      {(toast: any) => (
        <ToastRoot>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
          <ToastCloseTrigger />
        </ToastRoot>
      )}
    </ToasterRoot>
  );
};

// Utility functions for showing toasts
export const showAuthToast = {
  success: (message: string) => {
    authToaster.create({
      title: (
        <ToastTitle>
          <div className="flex items-center">
            <CheckCircle className="size-4 mr-2" />
            Success
          </div>
        </ToastTitle>
      ),
      description: <ToastDescription>{message}</ToastDescription>,
    });
  },
  error: (message: string) => {
    authToaster.create({
      title: (
        <ToastTitle>
          <div className="flex items-center">
            <XCircle className="size-4 mr-2" />
            Error
          </div>
        </ToastTitle>
      ),
      description: <ToastDescription>{message}</ToastDescription>,
    });
  },
  info: (message: string) => {
    authToaster.create({
      title: (
        <ToastTitle>
          <div className="flex items-center">
            <Info className="size-4 mr-2" />
            Info
          </div>
        </ToastTitle>
      ),
      description: <ToastDescription>{message}</ToastDescription>,
    });
  },
}; 