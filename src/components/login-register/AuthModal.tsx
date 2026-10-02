import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
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
import { useAuth } from "@/lib/auth";
import type { AuthErrorResponse } from "@/types/auth";
import { SocialAuthButton } from "./SocialAuthButton";
import { useToast } from "@/components/ui/toast";

type AuthTab = "login" | "register";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
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

export const AuthModal = ({
  open,
  onOpenChange,
  onSuccess,
}: AuthModalProps) => {
  const [tab, setTab] = useState<AuthTab>("login");
  const [error, setError] = useState<string | null>(null);
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    setError(null);

    try {
      if (tab === "register") {
        const username = String(data.get("username") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const confirmPassword = String(data.get("confirmPassword") ?? "");

        if (!username || !email || !password || !confirmPassword) {
          setError("Preencha todos os campos.");
          toast("error", "Preencha todos os campos.");
          return;
        }

        if (password !== confirmPassword) {
          setError("As senhas não coincidem.");
          toast("error", "As senhas não coincidem.");
          return;
        }

        await register({ username, email, password });
      } else {
        const email = String(data.get("login") ?? "").trim();
        const password = String(data.get("password") ?? "");

        if (!email || !password) {
          setError("Informe seu usuário ou e-mail e sua senha.");
          toast("error", "Informe seu usuário e sua senha.");
          return;
        }

        await login({ email, password });
      }

      onSuccess?.();
      toast("success", tab === "register" ? "Cadastro realizado com sucesso." : "Login realizado com sucesso.");
      onOpenChange(false);
    } catch (requestError) {
      const message = getAuthErrorMessage(requestError);
      setError(message);
      toast("error", message);
    }
  };

  const fieldClass =
    "h-10 rounded-md border-border bg-transparent px-4 text-sm placeholder:text-primary/70 focus:bg-transparent focus-visible:bg-transparent";

  const isRegister = tab === "register";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] max-w-[460px] gap-0 overflow-y-auto rounded-none border-0 bg-card p-0 sm:max-w-[460px] [&>button]:text-primary">
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

                {error && (
                  <p role="alert" className="text-xs text-destructive">
                    {error}
                  </p>
                )}
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
              disabled={isLoading}
            >
              {isLoading
                ? "Aguarde..."
                : tab === "login"
                  ? "Entrar"
                  : "Criar conta"}
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

const getAuthErrorMessage = (error: unknown) => {
  if (isAxiosError<AuthErrorResponse>(error)) {
    switch (error.response?.data.code) {
      case "INVALID_CREDENTIALS":
        return "E-mail/usuário ou senha inválidos.";
      case "USER_ALREADY_EXISTS":
        return "E-mail ou nome de usuário já cadastrado.";
      case "INVALID_DATA":
        return error.response.data.message;
    }
  }

  return "Não foi possível concluir a autenticação. Tente novamente.";
};
