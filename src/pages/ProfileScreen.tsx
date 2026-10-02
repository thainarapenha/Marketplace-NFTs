import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, ImageIcon } from "lucide-react";

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
import { ProfileSidebar } from "@/components/profile-wallet/ProfileSidebar";
import { getAuthToken, useAuth } from "@/lib/auth";
import { PRIVATE_QUERY_META } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import {
  changePassword,
  getProfile,
  removeAvatar,
  updateAvatar,
  updateProfile,
} from "@/services/auth";
import type { ChangePasswordInput } from "@/types/auth";
import type { Profile, UpdateProfileInput } from "@/types/profile";

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

const FormField = ({
  id,
  label,
  required,
  className,
  children,
}: FormFieldProps) => (
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
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const PasswordField = ({
  id,
  label,
  autoComplete,
  value,
  onChange,
  disabled,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <FormField id={id} label={label}>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(inputClass, "pr-11")}
        />

        <button
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 transition-colors hover:text-primary"
        >
          {visible ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </button>
      </div>
    </FormField>
  );
};

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [form, setForm] = useState<UpdateProfileInput>({
    displayName: "",
    email: "",
    username: "",
    walletNickname: "",
    ensName: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileQuery = useQuery({
    queryKey: ["profile", user?.id],
    meta: PRIVATE_QUERY_META,
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Sessão não encontrada.");
      }

      return getProfile(token);
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (values: UpdateProfileInput) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Sessão não encontrada.");
      }

      return updateProfile(token, values);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", user?.id], profile);
      void queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });

      setForm(profileToForm(profile));
      setSuccess("Perfil atualizado com sucesso.");
      setError(null);
    },
    onError: (cause) => {
      setSuccess(null);
      setError(getApiErrorMessage(cause));
    },
  });

  const avatarMutation = useMutation({
    mutationFn: async (avatar: string) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Sessão não encontrada.");
      }

      return updateAvatar(token, { avatarUrl: avatar });
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", user?.id], profile);

      setAvatarError(null);
      setAvatarSuccess("Avatar atualizado com sucesso.");
      setSuccess(null);
      setError(null);
    },
    onError: (cause) => {
      setAvatarSuccess(null);
      setSuccess(null);
      setAvatarError(getApiErrorMessage(cause));
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: async () => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Sessão não encontrada.");
      }

      return removeAvatar(token);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", user?.id], profile);

      setAvatarError(null);
      setAvatarSuccess("Avatar removido com sucesso.");
      setSuccess(null);
      setError(null);
    },
    onError: (cause) => {
      setAvatarSuccess(null);
      setSuccess(null);
      setAvatarError(getApiErrorMessage(cause));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: ChangePasswordInput) => {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Sessão não encontrada.");
      }

      return changePassword(token, {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setPasswordError(null);
      setPasswordSuccess("Senha alterada com sucesso.");
    },
    onError: (cause) => {
      setPasswordSuccess(null);
      setPasswordError(
        getApiErrorMessage(
          cause,
          "Não foi possível alterar a senha.",
        ),
      );
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setForm(profileToForm(profileQuery.data));
    }
  }, [profileQuery.data]);

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("A imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setAvatarError(null);
      setAvatarSuccess(null);
      setSuccess(null);

      avatarMutation.mutate(reader.result);
    };

    reader.onerror = () => {
      setAvatarError("Não foi possível ler a imagem.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleAvatarRemove = () => {
    setAvatarError(null);
    setAvatarSuccess(null);
    setSuccess(null);

    removeAvatarMutation.mutate();
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    profileMutation.mutate(form);
  };

  const handlePasswordSubmit = () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmNewPassword
    ) {
      setPasswordError("Preencha todos os campos de senha.");
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmNewPassword
    ) {
      setPasswordError(
        "A nova senha e a confirmação devem coincidir.",
      );
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const updateField =
    (field: keyof UpdateProfileInput) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const updatePasswordField =
    (field: keyof typeof passwordForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));

      setPasswordError(null);
      setPasswordSuccess(null);
    };

  const isLoading = profileQuery.isPending;

  const isAvatarPending =
    avatarMutation.isPending ||
    removeAvatarMutation.isPending;

  const displayedAvatarUrl = profileQuery.data?.avatarUrl;

  return (
    <main className="min-h-screen bg-background px-6 py-8 font-mono text-foreground">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 lg:grid-cols-[310px_1fr]">
        <ProfileSidebar onLogout={logout} />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
            <h1 className="text-sm font-bold">
              Perfil do colecionador
            </h1>

            {isLoading && (
              <p className="text-xs text-primary/70">
                Carregando perfil...
              </p>
            )}

            {profileQuery.isError &&
              !profileMutation.isPending && (
                <p
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {getApiErrorMessage(profileQuery.error)}
                </p>
              )}

            <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-6">
                <FormField
                  id="displayName"
                  label="Nome de exibição"
                  required
                >
                  <Input
                    id="displayName"
                    name="displayName"
                    value={form.displayName}
                    onChange={updateField("displayName")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="email"
                  label="E-mail"
                  required
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={updateField("email")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="walletNickname"
                  label="Apelido da carteira"
                  required
                >
                  <Input
                    id="walletNickname"
                    name="walletNickname"
                    value={form.walletNickname}
                    onChange={updateField("walletNickname")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="flex flex-col gap-6">
                <FormField
                  id="username"
                  label="Nome de usuário"
                  required
                >
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    value={form.username}
                    onChange={updateField("username")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="ensName"
                  label="Nome ENS"
                  required
                >
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
                          <SelectItem
                            key={suffix}
                            value={suffix}
                          >
                            {suffix}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      id="ensName"
                      name="ensName"
                      value={form.ensName}
                      onChange={updateField("ensName")}
                      disabled={isLoading}
                      className={inputClass}
                    />
                  </div>
                </FormField>

                <div className="flex flex-col gap-3">
                  <span className="text-sm">Avatar</span>

                  <div className="flex items-center gap-6">
                    <Avatar className="size-[50px] border border-border bg-card">
                      <AvatarFallback className="bg-card text-primary">
                        <ImageIcon className="size-5" />
                      </AvatarFallback>

                      {displayedAvatarUrl && (
                        <AvatarImage
                          src={displayedAvatarUrl}
                          alt="Seu avatar"
                        />
                      )}
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
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={isAvatarPending || isLoading}
                      className="h-10 rounded-sm bg-primary px-6 text-xs font-bold text-primary-foreground hover:bg-accent"
                    >
                      {avatarMutation.isPending
                        ? "Salvando..."
                        : "Alterar"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleAvatarRemove}
                      disabled={
                        isAvatarPending ||
                        isLoading ||
                        !profileQuery.data?.avatarUrl
                      }
                      className="h-auto p-0 text-xs font-normal hover:bg-transparent hover:text-primary"
                    >
                      {removeAvatarMutation.isPending
                        ? "Removendo..."
                        : "Remover"}
                    </Button>
                  </div>

                  {avatarError && (
                    <p
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {avatarError}
                    </p>
                  )}

                  {avatarSuccess && (
                    <p
                      role="status"
                      className="text-xs text-primary"
                    >
                      {avatarSuccess}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                isLoading ||
                profileMutation.isPending ||
                !profileQuery.data
              }
              className="h-10 w-[131px] rounded-sm bg-primary text-xs font-bold text-primary-foreground hover:bg-accent"
            >
              {profileMutation.isPending
                ? "Salvando..."
                : "Salvar"}
            </Button>

            <section
              className="flex max-w-[417px] flex-col gap-5"
              aria-labelledby="change-password-title"
            >
              <h2
                id="change-password-title"
                className="text-sm font-bold"
              >
                Alterar senha
              </h2>

              <PasswordField
                id="currentPassword"
                label="Senha atual"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={updatePasswordField(
                  "currentPassword",
                )}
                disabled={
                  isLoading || passwordMutation.isPending
                }
              />

              <PasswordField
                id="newPassword"
                label="Nova senha"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={updatePasswordField("newPassword")}
                disabled={
                  isLoading || passwordMutation.isPending
                }
              />

              <PasswordField
                id="confirmNewPassword"
                label="Confirmar nova senha"
                autoComplete="new-password"
                value={passwordForm.confirmNewPassword}
                onChange={updatePasswordField(
                  "confirmNewPassword",
                )}
                disabled={
                  isLoading || passwordMutation.isPending
                }
              />

              {passwordError && (
                <p
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p
                  role="status"
                  className="text-xs text-primary"
                >
                  {passwordSuccess}
                </p>
              )}

              <Button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={
                  isLoading || passwordMutation.isPending
                }
                className="h-10 w-[131px] rounded-sm bg-primary text-xs font-bold text-primary-foreground hover:bg-accent"
              >
                {passwordMutation.isPending
                  ? "Salvando..."
                  : "Alterar senha"}
              </Button>
            </section>

            {error && (
              <p
                role="alert"
                className="text-xs text-destructive"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="text-xs text-primary"
              >
                {success}
              </p>
            )}
          </form>
      </div>
    </main>
  );
};

const profileToForm = (
  profile: Profile,
): UpdateProfileInput => ({
  displayName: profile.displayName,
  email: profile.email,
  username: profile.username,
  walletNickname: profile.walletNickname,
  ensName: profile.ensName,
});

const getApiErrorMessage = (
  cause: unknown,
  fallback = "Não foi possível atualizar o perfil.",
) => {
  if (isAxiosError<{ message?: string }>(cause)) {
    return cause.response?.data?.message ?? fallback;
  }

  return cause instanceof Error ? cause.message : fallback;
};
