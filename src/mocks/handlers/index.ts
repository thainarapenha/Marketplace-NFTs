import { nftHandlers } from "./nft";
import { authHandlers } from "./auth";
import { walletHandlers } from "./wallet";

export const handlers = [...nftHandlers, ...authHandlers, ...walletHandlers];
