import { createFileRoute } from "@tanstack/react-router";

import { LoginScreen } from "@/pages/LoginScreen";

export const Route = createFileRoute("/login")({
  component: LoginScreen,
});