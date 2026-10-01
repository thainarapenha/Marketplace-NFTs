import type { Nft } from "@/types/nft";

export interface CartItem {
  nft: Nft;
  edition: string;
  quantity: number;
}