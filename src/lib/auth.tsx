import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSession,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/services/auth";
import {
  clearPrivateQueryCache,
  PRIVATE_QUERY_META,
} from "@/lib/queryClient";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

const AUTH_TOKEN_KEY = "marketplace-auth-token";
const SESSION_QUERY_KEY = ["auth", "session"];

const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getAuthToken = () => getStoredToken();

const storeToken = (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token);

const clearStoredToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    meta: PRIVATE_QUERY_META,
    queryFn: async () => {
      const token = getStoredToken();

      if (!token) {
        return null;
      }

      try {
        return await getSession(token);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          clearStoredToken();
          return null;
        }

        throw error;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      storeToken(response.session.token);
      queryClient.setQueryData(SESSION_QUERY_KEY, response);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (response) => {
      storeToken(response.session.token);
      queryClient.setQueryData(SESSION_QUERY_KEY, response);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = getStoredToken();

      if (token) {
        await logoutRequest(token);
      }
    },
    onSettled: () => {
      clearStoredToken();
      clearPrivateQueryCache(queryClient);
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
    },
  });

  const session = sessionQuery.data;

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isAuthenticated: Boolean(session?.user),
        isLoading:
          sessionQuery.isPending ||
          loginMutation.isPending ||
          registerMutation.isPending ||
          logoutMutation.isPending,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
};

const isUnauthorizedError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "response" in error &&
  (error.response as { status?: number } | undefined)?.status === 401;
