import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAuthToken, useAuth } from "@/lib/auth";
import { PRIVATE_QUERY_META } from "@/lib/queryClient";
import {
  createWallet,
  getWallets,
  updateWallet,
} from "@/services/wallet";
import type {
  CreateWalletInput,
  UpdateWalletInput,
  Wallet,
} from "@/types/wallet";

export const walletKeys = {
  all: ["wallets"] as const,
  list: (userId: string | undefined) => ["wallets", userId] as const,
};

const requireAuth = () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Sessão não encontrada.");
  }

  return token;
};

export const useWallets = () => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: walletKeys.list(userId),
    meta: PRIVATE_QUERY_META,
    enabled: Boolean(userId && isAuthenticated),
    queryFn: () => getWallets(requireAuth()),
  });
};

export const useCreateWallet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: (wallet: CreateWalletInput) =>
      createWallet(requireAuth(), wallet),
    onSuccess: (wallet) => {
      if (!userId) {
        return;
      }

      const queryKey = walletKeys.list(userId);
      queryClient.setQueryData<Wallet[]>(queryKey, (wallets = []) => [
        ...wallets,
        wallet,
      ]);
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useUpdateWallet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ id, wallet }: { id: string; wallet: UpdateWalletInput }) =>
      updateWallet(requireAuth(), id, wallet),
    onSuccess: (updatedWallet) => {
      if (!userId) {
        return;
      }

      const queryKey = walletKeys.list(userId);
      queryClient.setQueryData<Wallet[]>(queryKey, (wallets = []) =>
        wallets.map((wallet) =>
          wallet.id === updatedWallet.id ? updatedWallet : wallet,
        ),
      );
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
