import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SocialAuthButton } from "./SocialAuthButton";

type AuthTab = "login" | "register";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

  const triggerClass = (active: boolean) =>
    cn(
      "h-auto flex-none rounded-none border-0 bg-transparent! px-3 pb-1 pt-0 text-lg font-bold shadow-none! hover:bg-transparent",
      active
        ? "border-b-2 border-primary !text-primary"
        : "border-b-2 border-transparent !text-foreground",
    );

  const fieldClass =
    "h-10 rounded-md border-border bg-transparent px-4 text-sm placeholder:text-primary/70 focus:bg-transparent focus-visible:bg-transparent";

type PasswordFieldProps = {
  id: string;
  placeholder: string;
  withToggle?: boolean;
  autoComplete?: string;
};

const PasswordField = ({
  id,
  placeholder,
  withToggle = false,
  autoComplete,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={id}
        type={withToggle && visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={placeholder}
        className={cn(
          fieldClass,
          withToggle && "pr-11",
          "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_hsl(var(--card))]",
        )}
      />

      {withToggle && (
        <button
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 transition-colors hover:text-primary"
        >
          {visible ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
        </button>
      )}
    </div>
  );
};

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [tab, setTab] = useState<AuthTab>("login");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTab("login");
      setError(null);
    }
  }, [open]);

  const handleTabChange = (value: string) => {
    setTab(value as AuthTab);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (tab === "register") {
      if (data.get("password") !== data.get("confirmPassword")) {
        setError("As senhas não coincidem.");
        return;
      }

      // TODO: chamar a API de cadastro
    } else {
      // TODO: chamar a API de login
    }

    setError(null);
  };

  const fieldClass =
    "h-10 rounded-md border-border bg-transparent px-4 text-sm placeholder:text-primary/70 focus:bg-transparent focus-visible:bg-transparent";

  const isRegister = tab === "register";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-0 overflow-hidden rounded-none border-0 bg-card p-0 sm:max-w-[460px] [&>button]:text-primary">
        <DialogTitle className="sr-only">
          {tab === "login" ? "Entrar" : "Criar conta"}
        </DialogTitle>

        <DialogDescription className="sr-only">
          Entre ou crie sua conta de colecionador.
        </DialogDescription>

        <div
          className={cn(
            "px-8 font-mono sm:px-12",
            isRegister ? "pb-6 pt-7" : "pb-8 pt-8",
          )}
        >
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="mx-auto flex h-auto w-fit items-center bg-transparent p-0">
              <TabsTrigger
                value="login"
                className={triggerClass(tab === "login")}
              >
                Entrar
              </TabsTrigger>

              <span className="h-5 w-px bg-primary" aria-hidden="true" />

              <TabsTrigger
                value="register"
                className={triggerClass(tab === "register")}
              >
                Criar conta
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <p
            className={cn(
              "mx-auto max-w-[420px] text-center text-sm leading-snug",
              isRegister ? "mt-5" : "mt-6",
            )}
          >
            {tab === "login"
              ? "Entre na sua conta para acompanhar seus NFTs e finalizar compras."
              : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
          </p>

          <form
            onSubmit={handleSubmit}
            className={cn(
              "flex flex-col",
              isRegister ? "mt-5 gap-2" : "mt-6 gap-2.5",
            )}
            noValidate
          >
            {tab === "login" ? (
              <>
                <Input
                  name="login"
                  autoComplete="username"
                  placeholder="Nome de usuário ou e-mail"
                  aria-label="Nome de usuário ou e-mail"
                  className={cn(fieldClass)}
                />

                <PasswordField
                  id="password"
                  placeholder="Senha"
                  autoComplete="current-password"
                  withToggle
                />
              </>
            ) : (
              <>
                <Input
                  name="username"
                  autoComplete="username"
                  placeholder="Nome de usuário"
                  aria-label="Nome de usuário"
                  className={cn(fieldClass)}
                />

                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  aria-label="E-mail"
                  className={cn(fieldClass)}
                />

                <PasswordField
                  id="password"
                  placeholder="Senha"
                  autoComplete="new-password"
                  withToggle
                />

                <div className="flex flex-col gap-1">
                  <PasswordField
                    id="confirmPassword"
                    placeholder="Confirmar senha"
                    autoComplete="new-password"
                  />

                  {error && (
                    <p role="alert" className="text-xs text-destructive">
                      {error}
                    </p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full bg-primary text-base font-bold text-primary-foreground hover:bg-accent",
                isRegister ? "mt-3 h-10" : "mt-4 h-10",
              )}
            >
              {tab === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
        </div>

        <div className="relative flex items-center justify-center">
          <Separator className="absolute inset-x-0 top-1/2" />

          <span className="relative bg-card px-3 font-mono text-sm">
            Ou continue com
          </span>
        </div>

        <div className="flex flex-col gap-3 px-8 pb-8 pt-5 font-mono sm:px-12">
          <SocialAuthButton provider="google" />
          <SocialAuthButton provider="facebook" />
        </div>

        <div className="h-2 w-full bg-primary" />
      </DialogContent>
    </Dialog>
  );
};