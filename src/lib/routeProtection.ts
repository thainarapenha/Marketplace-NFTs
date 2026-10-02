import { redirect } from "@tanstack/react-router";

import type { RouterContext } from "@/router-context";

export const AUTH_RETURN_PARAM = "returnTo";

export const getAuthReturnLocation = (search: string) => {
  const returnLocation = new URLSearchParams(search).get(AUTH_RETURN_PARAM);

  if (
    !returnLocation ||
    !returnLocation.startsWith("/") ||
    returnLocation.startsWith("//")
  ) {
    return null;
  }

  return returnLocation;
};

export const requireAuth = ({
  context,
  location,
}: {
  context: RouterContext;
  location: { href: string };
}) => {
  if (context.auth.isLoading) {
    return;
  }

  if (!context.auth.isAuthenticated) {
    throw redirect({
      href: `/?${AUTH_RETURN_PARAM}=${encodeURIComponent(location.href)}`,
    });
  }
};
