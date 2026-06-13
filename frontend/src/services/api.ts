import { AuthResponse, User, Mood, Journal, DashboardStats, AnalyticsData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getToken = (): string | null => localStorage.getItem('mindmate_token');
export const setToken = (token: string) => localStorage.setItem('mindmate_token', token);
export const removeToken = () => localStorage.removeItem('mindmate_token');

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('mindmate_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user: User) => localStorage.setItem('mindmate_user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('mindmate_user');

const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSON parsing failed, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const res = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },
    register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
      const res = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setToken(res.token);
      setUser(res.user);
      return res;
    },
    logout: () => {
      removeToken();
      removeUser();
    },
    isAuthenticated: (): boolean => {
      return !!getToken();
    }
  },
  moods: {
    create: async (mood: string): Promise<Mood> => {
      return apiFetch<Mood>('/moods', {
        method: 'POST',
        body: JSON.stringify({ mood }),
      });
    },
    getAll: async (): Promise<Mood[]> => {
      return apiFetch<Mood[]>('/moods');
    }
  },
  journals: {
    create: async (content: string): Promise<{ journal: Journal; analysis: any }> => {
      return apiFetch<{ journal: Journal; analysis: any }>('/journals', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    getAll: async (): Promise<Journal[]> => {
      return apiFetch<Journal[]>('/journals');
    }
  },
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      return apiFetch<DashboardStats>('/dashboard');
    }
  },
  analytics: {
    get: async (): Promise<AnalyticsData> => {
      return apiFetch<AnalyticsData>('/analytics');
    }
  }
};
