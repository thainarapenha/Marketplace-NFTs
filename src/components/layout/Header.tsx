import { useEffect, useRef, useState } from "react";
import {
  LogIn,
  LogOut,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { AuthModal } from "@/components/login-register/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import {
  getAuthReturnLocation,
} from "@/lib/routeProtection";

const navLinks = [
  {
    label: "Início",
    path: "/",
  },
  {
    label: "Mercado",
    path: "/",
  },
  {
    label: "Criadores",
    path: "/",
  },
  {
    label: "Aprenda",
    path: "/",
  },
];

export const Header = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const authSuccessRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const returnLocation = getAuthReturnLocation(location.searchStr);

  useEffect(() => {
    if (returnLocation) {
      setAuthOpen(true);
    }
  }, [returnLocation]);

  const isMarketRoute =
    location.pathname === "/cart" ||
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/nft/") ||
    location.pathname.startsWith("/order/");

  const handleLogout = async () => {
    setAuthOpen(false);
    await logout();
  };

  const clearAuthReturnLocation = () => {
    if (returnLocation) {
      void navigate({ href: "/" });
    }
  };

  const handleAuthSuccess = () => {
    authSuccessRef.current = true;

    if (returnLocation) {
      void navigate({ href: returnLocation });
    }
  };

  return (
    <>
      <header className="mx-auto mb-6 flex h-14 max-w-[1200px] items-center justify-between border-b border-border px-4 md:px-6">
        <span className="text-sm font-bold tracking-wide">KURIO</span>

        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.label === "Início"
                ? location.pathname === "/"
                : link.label === "Mercado"
                  ? isMarketRoute
                  : false;

            return (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  if (link.label === "Início") {
                    navigate({ to: "/" });
                  }
                }}
                className={`border-b-2 pb-1 text-sm ${
                  isActive
                    ? "border-primary !text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Buscar">
            <Search className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Carrinho"
            onClick={() => navigate({ to: "/cart" })}
          >
            <ShoppingCart className="size-4" />

            {cartItemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.username}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="size-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-accent"
              onClick={() => setAuthOpen(true)}
            >
              <LogIn className="size-4" />
              Entrar
            </Button>
          )}
        </div>
      </header>

      <AuthModal
        open={authOpen}
        onOpenChange={(open) => {
          setAuthOpen(open);

          if (!open) {
            if (authSuccessRef.current) {
              authSuccessRef.current = false;
            } else {
              clearAuthReturnLocation();
            }
          }
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
