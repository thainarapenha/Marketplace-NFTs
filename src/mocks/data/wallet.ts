import type { Wallet } from "@/types/wallet";

const wallets: Wallet[] = [];
const STORAGE_KEY = "marketplace-wallet-mock-state";

try {
  const storedWallets = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "[]",
  ) as unknown;

  if (Array.isArray(storedWallets)) {
    wallets.push(...(storedWallets as Wallet[]));
  }
} catch {
  // The mock starts empty when browser storage is unavailable or invalid.
}

const persistState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  } catch {
    // Persistence is best effort for the browser mock.
  }
};

export const findWalletsByUserId = (userId: string) =>
  wallets.filter((wallet) => wallet.userId === userId);

export const findWalletById = (id: string) =>
  wallets.find((wallet) => wallet.id === id);

export const findWalletByAddressAndNetwork = (
  userId: string,
  address: string,
  network: Wallet["network"],
  excludedId?: string,
) =>
  wallets.find(
    (wallet) =>
      wallet.userId === userId &&
      wallet.id !== excludedId &&
      wallet.address.toLowerCase() === address.toLowerCase() &&
      wallet.network === network,
  );

export const addWallet = (wallet: Wallet) => {
  wallets.push(wallet);
  persistState();
  return wallet;
};

export const updateWallet = (wallet: Wallet, changes: Partial<Wallet>) => {
  Object.assign(wallet, changes);
  persistState();
  return wallet;
};
