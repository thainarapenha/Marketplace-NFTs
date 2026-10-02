import { api } from "@/services/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  SessionResponse,
} from "@/types/auth";
import type { Profile, UpdateProfileInput } from "@/types/profile";

export const register = async (
  credentials: RegisterCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    credentials,
  );

  return response.data;
};

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);

  return response.data;
};

export const getSession = async (token: string): Promise<SessionResponse> => {
  const response = await api.get<SessionResponse>("/auth/session", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const logout = async (token: string): Promise<void> => {
  await api.post("/auth/logout", undefined, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProfile = async (token: string): Promise<Profile> => {
  const response = await api.get<Profile>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateProfile = async (
  token: string,
  profile: UpdateProfileInput,
): Promise<Profile> => {
  const response = await api.patch<Profile>("/profile", profile, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const authService = {
  register,
  login,
  getSession,
  logout,
  getProfile,
  updateProfile,
};
