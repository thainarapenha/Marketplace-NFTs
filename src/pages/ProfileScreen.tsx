// src/screens/ProfileScreen.tsx
import { useEffect, useRef, useState } from "react";
import {
  BadgePercent,
  Eye,
  EyeOff,
  Heart,
  HardDriveDownload,
  ImageIcon,
  LogOut,
  MapPin,
  ShoppingCart,
  TriangleAlert,
  User,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const MENU_ITEMS: MenuItem[] = [
  { id: "profile", label: "Dados do perfil", icon: User },
  { id: "wallets", label: "Carteiras", icon: MapPin },
  { id: "activity", label: "Atividade", icon: ShoppingCart },
  { id: "wishlist", label: "Lista de interesse", icon: Heart },
  { id: "offers", label: "Ofertas", icon: BadgePercent },
  { id: "downloads", label: "Arquivos baixados", icon: HardDriveDownload },
  { id: "support", label: "Suporte", icon: TriangleAlert },
];

const ENS_SUFFIXES = [".eth", ".xyz", ".art"];

const inputClass =
  "h-10 rounded-sm border-border bg-transparent px-3 text-sm";

const Required = () => <span className="ml-0.5 text-primary">*</span>;

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

const FormField = ({ id, label, required, className, children }: FormFieldProps) => (
  <div className={cn("flex flex-col gap-3", className)}>
    <Label htmlFor={id} className="text-sm font-normal">
      {label}
      {required && <Required />}
    </Label>
    {children}
  </div>
);

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete?: string;
};

const PasswordField = ({ id, label, autoComplete }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <FormField id={id} label={label}>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className={cn(inputClass, "pr-11")}
        />
        <button
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 transition-colors hover:text-primary"
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>
    </FormField>
  );
};

export const ProfileScreen = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Libera a URL temporária da pré-visualização
  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("newPassword") !== data.get("confirmNewPassword")) {
      setError("As senhas não coincidem.");
      return;
    }

    setError(null);
    // TODO: enviar os dados para a API
  };

  return (
    <main className="min-h-screen bg-background px-6 py-8 font-mono text-foreground">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 lg:grid-cols-[310px_1fr]">
        {/* Menu lateral */}
        <aside className="h-fit bg-card">
          <h2 className="px-2.5 pb-1 pt-4 text-lg font-bold">Meu perfil</h2>

          <nav aria-label="Menu do perfil" className="flex flex-col">
            {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;

              return (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "h-[45px] justify-start gap-3 rounded-none border-l-[6px] px-2.5 text-sm font-normal text-primary hover:bg-secondary/40 hover:text-primary",
                    active
                      ? "border-l-primary bg-secondary/40"
                      : "border-l-transparent",
                  )}
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
              className="h-12 justify-start gap-3 rounded-none px-4 text-sm font-bold text-primary hover:bg-secondary/40 hover:text-primary"
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </nav>
        </aside>

        {/* Conteúdo */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <h1 className="text-sm font-bold">Perfil do colecionador</h1>

          <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2">
            {/* Coluna esquerda */}
            <div className="flex flex-col gap-6">
              <FormField id="displayName" label="Nome de exibição" required>
                <Input id="displayName" name="displayName" className={inputClass} />
              </FormField>

              <FormField id="email" label="E-mail" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                />
              </FormField>

              <FormField id="walletNickname" label="Apelido da carteira" required>
                <Input
                  id="walletNickname"
                  name="walletNickname"
                  className={inputClass}
                />
              </FormField>
            </div>

            {/* Coluna direita */}
            <div className="flex flex-col gap-6">
              <FormField id="username" label="Nome de usuário" required>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  className={inputClass}
                />
              </FormField>

              <FormField id="ensName" label="Nome ENS" required>
                <div className="flex gap-2.5">
                  <Select defaultValue=".eth">
                    <SelectTrigger
                      aria-label="Sufixo ENS"
                      className="h-10 w-[78px] shrink-0 border-border bg-transparent px-3 text-sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENS_SUFFIXES.map((suffix) => (
                        <SelectItem key={suffix} value={suffix}>
                          {suffix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input id="ensName" name="ensName" className={inputClass} />
                </div>
              </FormField>

              <div className="flex flex-col gap-3">
                <span className="text-sm">Avatar</span>
                <div className="flex items-center gap-6">
                  <Avatar className="size-[50px] border border-border bg-card">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt="Seu avatar" />}
                    <AvatarFallback className="bg-card text-primary">
                      <ImageIcon className="size-5" />
                    </AvatarFallback>
                  </Avatar>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 rounded-sm bg-primary px-6 text-xs font-bold text-primary-foreground hover:bg-accent"
                  >
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAvatarUrl(null)}
                    disabled={!avatarUrl}
                    className="h-auto p-0 text-xs font-normal hover:bg-transparent hover:text-primary"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Alterar senha */}
          <section className="flex max-w-[417px] flex-col gap-5">
            <h2 className="text-sm font-bold">Alterar senha</h2>

            <PasswordField
              id="currentPassword"
              label="Senha atual"
              autoComplete="current-password"
            />
            <PasswordField
              id="newPassword"
              label="Nova senha"
              autoComplete="new-password"
            />
            <PasswordField
              id="confirmNewPassword"
              label="Confirmar nova senha"
              autoComplete="new-password"
            />

            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
          </section>

          <Button
            type="submit"
            className="h-10 w-[131px] rounded-sm bg-primary text-xs font-bold text-primary-foreground hover:bg-accent"
          >
            Salvar
          </Button>
        </form>
      </div>
    </main>
  );
};