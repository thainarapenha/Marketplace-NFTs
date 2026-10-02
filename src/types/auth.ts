export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  displayName?: string;
  walletNickname?: string;
  ensName?: string;
  avatarUrl?: string | null;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface SessionResponse {
  user: User;
  session: Session;
}

export interface AuthErrorResponse {
  code: string;
  message: string;
}
