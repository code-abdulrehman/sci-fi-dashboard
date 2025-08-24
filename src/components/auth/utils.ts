import type { LoginFormData, AuthError } from './types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateLoginForm = (data: LoginFormData): AuthError | null => {
  if (!data.email.trim()) {
    return {
      field: 'email',
      message: 'Email is required',
      type: 'error'
    };
  }

  if (!validateEmail(data.email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address',
      type: 'error'
    };
  }

  if (!data.password.trim()) {
    return {
      field: 'password',
      message: 'Password is required',
      type: 'error'
    };
  }

  if (!validatePassword(data.password)) {
    return {
      field: 'password',
      message: 'Password must be at least 6 characters long',
      type: 'error'
    };
  }

  return null;
};

export const formatErrorMessage = (error: AuthError): string => {
  if (error.field) {
    return `${error.field.charAt(0).toUpperCase() + error.field.slice(1)}: ${error.message}`;
  }
  return error.message;
}; 