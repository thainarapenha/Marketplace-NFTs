import { createFileRoute } from "@tanstack/react-router";

import { OrderScreen } from "@/pages/OrderScreen";

export const Route = createFileRoute("/order/$id")({
  component: OrderScreen,
});