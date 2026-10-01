import {
  LogIn,
  Search,
  ShoppingCart,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navLinks = ["Início", "Mercado", "Criadores", "Aprenda"];

export function Header() {
  return (
    <header className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:px-6">
      <span className="text-sm font-bold tracking-wide">KURIO</span>

      <nav className="hidden gap-8 md:flex">
        {navLinks.map((link, i) => (
          <a
            key={link}
            href="#"
            className={`border-b-2 pb-1 text-sm ${
              i === 0
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {link}
          </a>
        ))}
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
        >
          <ShoppingCart className="size-4" />

          <Badge className="absolute -right-1 -top-1 size-4 justify-center rounded-full p-0 text-[10px]">
            1
          </Badge>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary"
        >
          <LogIn className="size-4" />
          Entrar
        </Button>
      </div>
    </header>
  );
}