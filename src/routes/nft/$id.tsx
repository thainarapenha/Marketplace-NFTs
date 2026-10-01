import { createFileRoute } from "@tanstack/react-router";

import { NftDetailScreen } from "@/pages/NFTDetailsScreen";

export const Route = createFileRoute("/nft/$id")({
  component: NftDetailScreen,
});