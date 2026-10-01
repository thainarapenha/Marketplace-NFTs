import { useState } from "react";
import {
  LogIn,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { AuthModal } from "@/components/login-register/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

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
  const location = useLocation();
  const navigate = useNavigate();

  const { items } = useCart();

  const cartItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const isMarketRoute =
    location.pathname === "/cart" ||
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/nft/") ||
    location.pathname.startsWith("/order/");

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

          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-accent"
            onClick={() => setAuthOpen(true)}
          >
            <LogIn className="size-4" />
            Entrar
          </Button>
        </div>
      </header>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
      />
    </>
  );
};