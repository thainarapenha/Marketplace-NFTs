import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { queryClient } from "./lib/queryClient";
import { router } from "./router";
import "./index.css";
import { CartProvider } from "./lib/cart";
import { AuthProvider, useAuth } from "./lib/auth";
import { ToastProvider } from "./components/ui/toast";

async function enableMocking() {
  const shouldEnableMocks =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === "true";

  if (!shouldEnableMocks) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start();
}

function AppRouter() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    void router.invalidate();
  }, [isAuthenticated, isLoading, user?.id]);

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          user,
          isAuthenticated,
          isLoading,
        },
      }}
    />
  );
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <AppRouter />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
});
