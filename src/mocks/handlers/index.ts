import { nftHandlers } from "./nft";
import { authHandlers } from "./auth";
import { walletHandlers } from "./wallet";
import { orderHandlers } from "./order";

export const handlers = [
  ...nftHandlers,
  ...authHandlers,
  ...walletHandlers,
  ...orderHandlers,
];
