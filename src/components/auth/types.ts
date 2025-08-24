export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthError {
  field?: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  user: User | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'agent';
  avatar?: string;
  lastLogin?: string;
} 