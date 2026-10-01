import { createFileRoute } from "@tanstack/react-router";

import { CartScreen } from "@/pages/CartScreen";

export const Route = createFileRoute("/cart")({
  component: CartScreen,
});