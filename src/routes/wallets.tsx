import { createFileRoute } from "@tanstack/react-router";

import { WalletsScreen } from "@/pages/WalletsScreen";
import { requireAuth } from "@/lib/routeProtection";

export const Route = createFileRoute("/wallets")({
  beforeLoad: requireAuth,
  component: WalletsScreen,
});
