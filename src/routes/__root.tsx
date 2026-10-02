import {
  createRootRouteWithContext,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { RouterContext } from "@/router-context";

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const hideFooter = pathname === "/profile" || pathname === "/wallets";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <Outlet />
      {!hideFooter && <Footer />}
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
