import { nftHandlers } from "./nft";
import { authHandlers } from "./auth";

export const handlers = [...nftHandlers, ...authHandlers];
