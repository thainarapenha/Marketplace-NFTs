import { useEffect, useRef, useState } from "react";
import {
  LogIn,
  LogOut,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

import { AuthModal } from "@/components/login-register/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { getAuthReturnLocation } from "@/lib/routeProtection";

const navLinks = [
  { label: "Início", path: "/" },
  { label: "Mercado", path: "/" },
  { label: "Criadores", path: "/" },
  { label: "Aprenda", path: "/" },
];

export const Header = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
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

  const isHomeRoute = location.pathname === "/";
  const isCheckoutRoute = location.pathname === "/checkout";

  const handleLogout = async () => {
    setAuthOpen(false);
    setUserDrawerOpen(false);
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

  const handleFilterClick = () => {
    window.dispatchEvent(new CustomEvent("kurio:open-mobile-filters"));
  };

  return (
    <>
      <header className="mx-auto mb-6 flex h-14 max-w-[1200px] items-center justify-between border-b border-border px-4 max-md:mb-4 max-md:h-auto max-md:border-b-0 max-md:pb-0 max-md:pt-4 md:px-6">
        <span className="text-sm font-bold tracking-wide max-md:hidden">
          KURIO
        </span>

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

        <div className="flex min-w-0 items-center gap-3 max-md:w-full">
          {/* Busca mobile */}
          <div className="relative min-w-0 flex-1 md:hidden">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" />

            <input
              type="search"
              placeholder="Explorar coleções"
              aria-label="Explorar coleções"
              className="h-12 w-full rounded-xl border-0 bg-card pl-12 pr-4 text-sm outline-none placeholder:text-primary/70 focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Controles mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="relative size-12 shrink-0 rounded-xl md:hidden"
            aria-label="Carrinho"
            onClick={() => navigate({ to: "/cart" })}
          >
            <ShoppingCart className="size-5" />

            {cartItemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {isAuthenticated && user ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-12 shrink-0 rounded-xl md:hidden"
              aria-label="Abrir menu do usuário"
              onClick={() => setUserDrawerOpen(true)}
            >
              <User className="size-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-12 shrink-0 rounded-xl md:hidden"
              aria-label="Entrar"
              onClick={() => setAuthOpen(true)}
            >
              <User className="size-5" />
            </Button>
          )}

          {isHomeRoute && (
            <Button
              size="icon"
              className="size-12 shrink-0 rounded-xl bg-gradient-to-b from-accent to-primary text-primary-foreground md:hidden"
              aria-label="Abrir filtros"
              onClick={handleFilterClick}
            >
              <SlidersHorizontal className="size-5" />
            </Button>
          )}

          {/* Controles desktop */}
          {!isCheckoutRoute && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              aria-label="Buscar"
            >
              <Search className="size-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative hidden md:inline-flex"
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
              <Link
                to="/profile"
                className={`hidden items-center gap-2 border-b-2 pb-1 text-sm md:inline-flex ${
                  location.pathname === "/profile"
                    ? "border-primary !text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="size-4" />
                {user.username}
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
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
              className="hidden bg-primary text-primary-foreground hover:bg-accent md:inline-flex"
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

      <Drawer open={userDrawerOpen} onOpenChange={setUserDrawerOpen}>
        <DrawerContent className="md:hidden">
          <DrawerHeader className="px-5 pb-4 text-left">
            <DrawerTitle className="flex items-center gap-2">
              <User className="size-4" />@
              <Link
                to="/profile"
                onClick={() => setUserDrawerOpen(false)}
                className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {user?.username}
              </Link>
            </DrawerTitle>
            <DrawerDescription>
              Gerencie sua conta e sessão atual.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-5 pb-6">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
