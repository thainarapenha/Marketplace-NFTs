import { createFileRoute } from "@tanstack/react-router";

import { NFTDetailsPage } from "@/pages/NFTDetailsPage";

export const Route = createFileRoute("/nft/$id")({
  component: NFTDetailsPage,
});