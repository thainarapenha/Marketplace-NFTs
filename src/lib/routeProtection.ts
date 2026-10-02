import { redirect } from "@tanstack/react-router";

import type { RouterContext } from "@/router-context";

export const requireAuth = ({
  context,
}: {
  context: RouterContext;
}) => {
  if (context.auth.isLoading) {
    return;
  }

  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: "/",
    });
  }
};