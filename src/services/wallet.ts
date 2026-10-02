import { api } from "@/services/api";
import type {
  CreateWalletInput,
  UpdateWalletInput,
  Wallet,
} from "@/types/wallet";

const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getWallets = async (token: string): Promise<Wallet[]> => {
  const response = await api.get<Wallet[]>("/wallets", authHeaders(token));

  return response.data;
};

export const createWallet = async (
  token: string,
  wallet: CreateWalletInput,
): Promise<Wallet> => {
  const response = await api.post<Wallet>(
    "/wallets",
    wallet,
    authHeaders(token),
  );

  return response.data;
};

export const updateWallet = async (
  token: string,
  id: string,
  wallet: UpdateWalletInput,
): Promise<Wallet> => {
  const response = await api.patch<Wallet>(
    `/wallets/${id}`,
    wallet,
    authHeaders(token),
  );

  return response.data;
};

export const walletService = {
  getWallets,
  createWallet,
  updateWallet,
};
