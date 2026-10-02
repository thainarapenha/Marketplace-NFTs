import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { RouterContext } from "@/router-context";

function RootLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
