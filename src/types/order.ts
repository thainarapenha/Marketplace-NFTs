import type { WalletNetwork } from "@/types/wallet";

export type OrderStatus = "pending" | "confirmed" | "rejected";

export interface OrderItem {
  nftId: string;
  name: string;
  tokenId?: string;
  image?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  networkFee: number;
  total: number;
  wallet: string;
  network: WalletNetwork;
  transactionReference: string | null;
  createdAt: string;
  updatedAt: string;
}
