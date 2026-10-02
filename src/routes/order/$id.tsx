import { createFileRoute } from "@tanstack/react-router";

import { OrderScreen } from "@/pages/OrderScreen";
import { requireAuth } from "@/lib/routeProtection";

export const Route = createFileRoute("/order/$id")({
  beforeLoad: requireAuth,
  component: OrderScreen,
});
