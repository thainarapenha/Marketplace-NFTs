import { createFileRoute } from "@tanstack/react-router";

import { ProfileScreen } from "@/pages/ProfileScreen";
import { requireAuth } from "@/lib/routeProtection";

export const Route = createFileRoute("/profile")({
  beforeLoad: requireAuth,
  component: ProfileScreen,
});
