import {
  BadgePercent,
  Heart,
  HardDriveDownload,
  LogOut,
  MapPin,
  ShoppingCart,
  TriangleAlert,
  User,
  type LucideIcon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ProfileSection =
  | "profile"
  | "wallets"
  | "activity"
  | "wishlist"
  | "offers"
  | "downloads"
  | "support";

type MenuItem = {
  id: ProfileSection;
  label: string;
  icon: LucideIcon;
  route?: "/profile" | "/wallets";
};

const MENU_ITEMS: MenuItem[] = [
  { id: "profile", label: "Dados do perfil", icon: User, route: "/profile" },
  { id: "wallets", label: "Carteiras", icon: MapPin, route: "/wallets" },
  { id: "activity", label: "Atividade", icon: ShoppingCart },
  { id: "wishlist", label: "Lista de interesse", icon: Heart },
  { id: "offers", label: "Ofertas", icon: BadgePercent },
  { id: "downloads", label: "Arquivos baixados", icon: HardDriveDownload },
  { id: "support", label: "Suporte", icon: TriangleAlert },
];

type ProfileSidebarProps = {
  onLogout?: () => void;
};

export const ProfileSidebar = ({ onLogout }: ProfileSidebarProps) => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const activeSection: ProfileSection | undefined =
    pathname === "/profile"
      ? "profile"
      : pathname === "/wallets"
        ? "wallets"
        : undefined;

  return (
    <aside className="h-fit bg-card font-mono">
      <h2 className="px-2.5 pb-1 pt-4 text-lg font-bold">Meu perfil</h2>

      <nav aria-label="Menu do perfil" className="flex flex-col">
        {MENU_ITEMS.map(({ id, label, icon: Icon, route }) => {
          const active = activeSection === id;
          const className = cn(
            "h-[45px] justify-start gap-3 rounded-none border-l-[6px] px-2.5 text-sm font-normal text-primary hover:bg-secondary/40 hover:text-primary",
            active ? "border-l-primary bg-secondary/40" : "border-l-transparent",
          );

          if (route) {
            return (
              <Link
                key={id}
                to={route}
                aria-current={active ? "page" : undefined}
                className={cn(buttonVariants({ variant: "ghost" }), className)}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          }

          return (
            <Button
              key={id}
              type="button"
              variant="ghost"
              aria-current={active ? "page" : undefined}
              className={className}
            >
              <Icon className="size-4" />
              {label}
            </Button>
          );
        })}

        <Separator className="mt-1" />

        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          className="h-12 justify-start gap-3 rounded-none px-4 text-sm font-bold text-primary hover:bg-secondary/40 hover:text-primary"
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </nav>
    </aside>
  );
};
