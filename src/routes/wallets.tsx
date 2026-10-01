import { createFileRoute } from "@tanstack/react-router";

import { WalletsScreen } from "@/pages/WalletsScreen";

export const Route = createFileRoute("/wallets")({
  component: WalletsScreen,
});