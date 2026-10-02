import { createFileRoute } from "@tanstack/react-router";

import { CheckoutScreen } from "@/pages/CheckoutScreen";
import { requireAuth } from "@/lib/routeProtection";

export const Route = createFileRoute("/checkout")({
  beforeLoad: requireAuth,
  component: CheckoutScreen,
});
