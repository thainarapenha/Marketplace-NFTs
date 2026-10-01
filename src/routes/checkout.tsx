import { createFileRoute } from "@tanstack/react-router";

import { CheckoutScreen } from "@/pages/CheckoutScreen";

export const Route = createFileRoute("/checkout")({
  component: CheckoutScreen,
});