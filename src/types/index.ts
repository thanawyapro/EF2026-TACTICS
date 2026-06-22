export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isPro: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PrivacySettings {
  isProfilePublic: boolean;
  allowTacticsSharing: boolean;
  shareDataAnalytic: boolean;
}

export interface PreferencesSettings {
  language: 'en' | 'ar';
  theme: 'dark' | 'light';
  pushNotifications: boolean;
  emailDigest: boolean;
}
