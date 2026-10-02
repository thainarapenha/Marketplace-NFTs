export type WalletKind = "primary" | "secondary";

export type WalletNetwork =
  | "ethereum"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "base";

export type WalletType = "hot" | "cold" | "custodial";

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  network: WalletNetwork;
  type: WalletType;
  kind: WalletKind;
}

export type CreateWalletInput = Omit<Wallet, "id" | "userId">;

export type UpdateWalletInput = Partial<CreateWalletInput>;
