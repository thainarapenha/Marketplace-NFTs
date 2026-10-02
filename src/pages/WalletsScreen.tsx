import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";

import { ProfileSidebar, type ProfileSection } from "@/components/profile-wallet/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useCreateWallet, useUpdateWallet, useWallets } from "@/hooks/useWallets";
import type { Wallet, WalletNetwork, WalletType } from "@/types/wallet";

const NETWORKS = [
  { label: "Ethereum", value: "ethereum" },
  { label: "Polygon", value: "polygon" },
  { label: "Arbitrum", value: "arbitrum" },
  { label: "Optimism", value: "optimism" },
  { label: "Base", value: "base" },
] as const;

const WALLET_TYPES = [
  { label: "Hot wallet", value: "hot" },
  { label: "Cold wallet", value: "cold" },
  { label: "Custodial", value: "custodial" },
] as const;

const ENS_SUFFIXES = [".eth", ".xyz", ".art"];

const inputClass =
  "h-10 rounded-sm border-border bg-transparent px-3 text-sm placeholder:text-primary/70";

const selectTriggerClass =
  "h-10 w-full rounded-sm border-border bg-transparent px-3 text-sm text-primary/70";

const Required = () => <span className="ml-0.5 text-primary">*</span>;

type FormFieldProps = {
  id?: string;
  label?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

const FormField = ({ id, label, required, className, children }: FormFieldProps) => (
  <div className={cn("flex flex-col gap-3", className)}>
    {label ? (
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
        {required && <Required />}
      </Label>
    ) : (
      // Espaço do rótulo, para alinhar campos sem label com os vizinhos
      <span aria-hidden="true" className="hidden h-5 md:block" />
    )}
    {children}
  </div>
);

type WalletForm = {
  address: string;
  network: WalletNetwork | "";
  type: WalletType | "";
};

const emptyWalletForm: WalletForm = { address: "", network: "", type: "" };

const isWalletFormEqual = (a: WalletForm, b: WalletForm) =>
  a.address === b.address &&
  a.network === b.network &&
  a.type === b.type;

const walletToForm = (wallet?: Wallet): WalletForm =>
  wallet
    ? { address: wallet.address, network: wallet.network, type: wallet.type }
    : emptyWalletForm;

const getApiErrorMessage = (cause: unknown) => {
  if (isAxiosError<{ message?: string }>(cause)) {
    return cause.response?.data?.message ?? "Não foi possível salvar a carteira.";
  }

  return cause instanceof Error ? cause.message : "Não foi possível salvar a carteira.";
};

export const WalletsScreen = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<ProfileSection>("wallets");
  const [sameAsMain, setSameAsMain] = useState(false);
  const [primaryForm, setPrimaryForm] = useState<WalletForm>(emptyWalletForm);
  const [secondaryForm, setSecondaryForm] = useState<WalletForm>(emptyWalletForm);
  const [initialPrimaryForm, setInitialPrimaryForm] =
    useState<WalletForm>(emptyWalletForm);
  const [initialSecondaryForm, setInitialSecondaryForm] =
    useState<WalletForm>(emptyWalletForm);
  const [editingSecondaryId, setEditingSecondaryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const loadedPrimaryWallet = useRef<Wallet | undefined>(undefined);
  const loadedSecondaryWallet = useRef<Wallet | undefined>(undefined);
  const hasLoadedWallets = useRef(false);

  const walletsQuery = useWallets();
  const createWalletMutation = useCreateWallet();
  const updateWalletMutation = useUpdateWallet();
  const wallets = walletsQuery.data ?? [];
  const primaryWallet = wallets.find((wallet) => wallet.kind === "primary");
  const secondaryWallet = wallets.find((wallet) => wallet.kind === "secondary");
  const isSaving = createWalletMutation.isPending || updateWalletMutation.isPending;

  useEffect(() => {
    if (walletsQuery.isSuccess) {
      const primaryChanged =
        !hasLoadedWallets.current || loadedPrimaryWallet.current !== primaryWallet;
      const secondaryChanged =
        !hasLoadedWallets.current || loadedSecondaryWallet.current !== secondaryWallet;

      if (primaryChanged && isWalletFormEqual(primaryForm, initialPrimaryForm)) {
        const nextPrimaryForm = walletToForm(primaryWallet);
        setPrimaryForm(nextPrimaryForm);
        setInitialPrimaryForm(nextPrimaryForm);
      }

      if (secondaryChanged && isWalletFormEqual(secondaryForm, initialSecondaryForm)) {
        const nextSecondaryForm = walletToForm(secondaryWallet);
        setSecondaryForm(nextSecondaryForm);
        setInitialSecondaryForm(nextSecondaryForm);
        setEditingSecondaryId(secondaryWallet?.id ?? null);
      }

      loadedPrimaryWallet.current = primaryWallet;
      loadedSecondaryWallet.current = secondaryWallet;
      hasLoadedWallets.current = true;
    }
  }, [
    walletsQuery.isSuccess,
    primaryWallet,
    secondaryWallet,
    primaryForm,
    initialPrimaryForm,
    secondaryForm,
    initialSecondaryForm,
  ]);

  const hasPrimaryChanges = !isWalletFormEqual(primaryForm, initialPrimaryForm);
  const hasSecondaryChanges = !isWalletFormEqual(secondaryForm, initialSecondaryForm);

  const saveWallet = async (form: WalletForm, kind: Wallet["kind"], id?: string) => {
    if (!form.address.trim() || !form.network || !form.type) {
      setSuccess(null);
      setError("Preencha os campos obrigatórios da carteira.");
      return;
    }

    setError(null);
    setSuccess(null);
    try {
      const values = { address: form.address.trim(), network: form.network, type: form.type, kind } as const;
      if (id) {
        await updateWalletMutation.mutateAsync({ id, wallet: values });
      } else {
        await createWalletMutation.mutateAsync(values);
      }

      const savedForm: WalletForm = {
        address: values.address,
        network: values.network,
        type: values.type,
      };
      if (kind === "primary") {
        setPrimaryForm(savedForm);
        setInitialPrimaryForm(savedForm);
      } else {
        setSecondaryForm(savedForm);
        setInitialSecondaryForm(savedForm);
      }
      setSuccess(kind === "primary" ? "Carteira principal salva com sucesso." : "Carteira secundária salva com sucesso.");
    } catch (cause) {
      setError(getApiErrorMessage(cause));
    }
  };

  const handleCancelPrimary = () => {
    setPrimaryForm(initialPrimaryForm);
  };

  const handleCancelSecondary = () => {
    setSecondaryForm(initialSecondaryForm);
    setSameAsMain(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveWallet(primaryForm, "primary", primaryWallet?.id);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-8 font-mono text-foreground">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 lg:grid-cols-[310px_1fr]">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex flex-col gap-10">
          {/* Carteira principal */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-sm font-bold">Carteira principal</h1>
                <p className="text-xs text-primary/80">
                  Estas carteiras ficam disponíveis no pagamento e para receber NFTs
                  comprados.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2">
              {/* Coluna esquerda */}
              <div className="flex flex-col gap-6">
                <FormField id="displayName" label="Nome de exibição">
                  <Input
                    id="displayName"
                    name="displayName"
                    value={user?.username ?? ""}
                    disabled
                    className={inputClass}
                  />
                </FormField>

                <FormField id="network" label="Rede" required>
                  <Select
                    value={primaryForm.network}
                    onValueChange={(value) => setPrimaryForm((current) => ({ ...current, network: value as WalletNetwork }))}
                    disabled={isSaving}
                  >
                    <SelectTrigger id="network" className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione uma rede" />
                    </SelectTrigger>
                    <SelectContent>
                      {NETWORKS.map((network) => (
                        <SelectItem key={network.value} value={network.value}>
                          {network.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField id="walletAddress" label="Endereço da carteira" required>
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    placeholder="Endereço 0x da carteira"
                    value={primaryForm.address}
                    onChange={(event) => setPrimaryForm((current) => ({ ...current, address: event.target.value }))}
                    disabled={isSaving}
                    className={inputClass}
                  />
                </FormField>

                <FormField id="walletType" label="Tipo de carteira" required>
                  <Select
                    value={primaryForm.type}
                    onValueChange={(value) => setPrimaryForm((current) => ({ ...current, type: value as WalletType }))}
                    disabled={isSaving}
                  >
                    <SelectTrigger id="walletType" className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {WALLET_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField id="email" label="E-mail">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={user?.email ?? ""}
                    disabled
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* Coluna direita */}
              <div className="flex flex-col gap-6">
                <FormField id="walletNickname" label="Apelido da carteira">
                  <Input
                    id="walletNickname"
                    name="walletNickname"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="profileName" label="Nome do perfil">
                  <Input
                    id="profileName"
                    name="profileName"
                    value={user?.username ?? ""}
                    disabled
                    className={inputClass}
                  />
                </FormField>

                <FormField id="referralCode" label="Código de indicação">
                  <Input
                    id="referralCode"
                    name="referralCode"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="ensName" label="Nome ENS">
                  <div className="flex gap-2.5">
                    <Select defaultValue=".eth">
                      <SelectTrigger
                        aria-label="Sufixo ENS"
                        className="h-10 w-[78px] shrink-0 rounded-sm border-border bg-transparent px-3 text-sm"
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
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSaving || walletsQuery.isPending}
                className="h-10 w-fit rounded-sm bg-primary px-3 text-xs font-bold text-primary-foreground hover:bg-accent"
              >
                {isSaving ? "Salvando..." : "Salvar carteira"}
              </Button>
              {hasPrimaryChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPrimary}
                  disabled={isSaving}
                  className="h-10 rounded-sm px-3 text-xs font-bold"
                >
                  Cancelar
                </Button>
              )}
            </div>
            {walletsQuery.isPending && <p className="text-xs text-primary/80" role="status">Carregando carteiras...</p>}
            {walletsQuery.isError && <p className="text-xs text-destructive" role="alert">{getApiErrorMessage(walletsQuery.error)}</p>}
            {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
            {success && <p className="text-xs text-primary" role="status">{success}</p>}
          </form>

          {/* Carteira secundária */}
          <section className="flex flex-col gap-6">
            <header className="flex items-center justify-between gap-4">
              <h2 className="text-base font-bold">Carteira secundária</h2>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="sameAsMain"
                  checked={sameAsMain}
                  onCheckedChange={(checked) => {
                    const enabled = checked === true;
                    setSameAsMain(enabled);
                    if (enabled) {
                      setSecondaryForm(primaryForm);
                    }
                  }}
                  className="size-4 rounded-full border-primary"
                />
                <Label htmlFor="sameAsMain" className="text-xs font-normal">
                  Igual à carteira principal
                </Label>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2">
              <FormField id="secondaryNetwork" label="Rede" required>
                <Select
                  value={secondaryForm.network}
                  onValueChange={(value) => setSecondaryForm((current) => ({ ...current, network: value as WalletNetwork }))}
                  disabled={isSaving || sameAsMain}
                >
                  <SelectTrigger id="secondaryNetwork" className={selectTriggerClass}>
                    <SelectValue placeholder="Selecione uma rede" />
                  </SelectTrigger>
                  <SelectContent>
                    {NETWORKS.map((network) => (
                      <SelectItem key={network.value} value={network.value}>
                        {network.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id="secondaryAddress" label="Endereço da carteira" required>
                <Input
                  id="secondaryAddress"
                  name="secondaryWallet"
                  placeholder="Endereço 0x da carteira"
                  value={secondaryForm.address}
                  onChange={(event) => setSecondaryForm((current) => ({ ...current, address: event.target.value }))}
                  disabled={isSaving || sameAsMain}
                  className={inputClass}
                />
              </FormField>

              <FormField id="secondaryWalletType" label="Tipo de carteira" required>
                <Select
                  value={secondaryForm.type}
                  onValueChange={(value) => setSecondaryForm((current) => ({ ...current, type: value as WalletType }))}
                  disabled={isSaving || sameAsMain}
                >
                  <SelectTrigger id="secondaryWalletType" className={selectTriggerClass}>
                    <SelectValue placeholder="Selecione uma carteira" />
                  </SelectTrigger>
                  <SelectContent>
                    {WALLET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  void saveWallet(
                    secondaryForm,
                    "secondary",
                    editingSecondaryId ?? undefined,
                  )
                }
                className="h-10 w-fit rounded-sm bg-primary px-3 text-xs font-bold text-primary-foreground hover:bg-accent"
              >
                {isSaving ? "Salvando..." : "Salvar carteira"}
              </Button>
              {hasSecondaryChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelSecondary}
                  disabled={isSaving}
                  className="h-10 rounded-sm px-3 text-xs font-bold"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
