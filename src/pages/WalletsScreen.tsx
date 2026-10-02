import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";

import { ProfileSidebar } from "@/components/profile-wallet/ProfileSidebar";
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
import { useToast } from "@/components/ui/toast";
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
  const { toast } = useToast();
  const [activeWalletTab, setActiveWalletTab] = useState<"primary" | "secondary">("primary");
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
      toast("error", "Preencha os campos obrigatórios da carteira.");
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
      toast("success", id ? "Carteira editada com sucesso." : "Carteira cadastrada com sucesso.");
    } catch (cause) {
      const message = getApiErrorMessage(cause);
      setError(message);
      toast("error", message);
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
    if (activeWalletTab === "primary") {
      void saveWallet(primaryForm, "primary", primaryWallet?.id);
    } else {
      void saveWallet(secondaryForm, "secondary", editingSecondaryId ?? undefined);
    }
  };

  const isPrimaryTab = activeWalletTab === "primary";
  const activeForm = isPrimaryTab ? primaryForm : secondaryForm;
  const hasActiveChanges = isPrimaryTab ? hasPrimaryChanges : hasSecondaryChanges;
  const handleCancel = isPrimaryTab ? handleCancelPrimary : handleCancelSecondary;
  const setActiveForm = (update: (current: WalletForm) => WalletForm) => {
    if (isPrimaryTab) {
      setPrimaryForm(update);
    } else {
      setSecondaryForm(update);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-8 font-mono text-foreground">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 lg:grid-cols-[310px_1fr]">
        <ProfileSidebar />

        <div className="flex flex-col gap-6">
          <nav className="flex items-center gap-6 border-b border-border" aria-label="Carteiras">
            {(["primary", "secondary"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveWalletTab(tab)}
                className={cn(
                  "border-b-2 pb-2 text-sm font-bold transition-colors",
                  activeWalletTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/60 hover:text-primary",
                )}
                aria-current={activeWalletTab === tab ? "page" : undefined}
              >
                {tab === "primary" ? "Carteira principal" : "Carteira secundária"}
              </button>
            ))}
          </nav>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <header className="flex flex-col items-start gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
              <p className="text-xs text-primary/80">
                Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
              </p>
              {!isPrimaryTab && (
                <div className="flex shrink-0 items-center gap-2">
                  <Checkbox
                    id="sameAsMain"
                    checked={sameAsMain}
                    onCheckedChange={(checked) => {
                      const enabled = checked === true;
                      setSameAsMain(enabled);
                      if (enabled) setSecondaryForm(primaryForm);
                    }}
                    className="size-4 rounded-full border-primary"
                  />
                  <Label htmlFor="sameAsMain" className="text-xs font-normal">
                    Igual à carteira principal
                  </Label>
                </div>
              )}
            </header>

            <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-6">
                <FormField id={`${activeWalletTab}-displayName`} label="Nome de exibição">
                  <Input id={`${activeWalletTab}-displayName`} value={user?.username ?? ""} disabled className={inputClass} />
                </FormField>
                <FormField id={`${activeWalletTab}-network`} label="Rede" required>
                  <Select
                    value={activeForm.network}
                    onValueChange={(value) => setActiveForm((current) => ({ ...current, network: value as WalletNetwork }))}
                    disabled={isSaving || (!isPrimaryTab && sameAsMain)}
                  >
                    <SelectTrigger id={`${activeWalletTab}-network`} className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione uma rede" />
                    </SelectTrigger>
                    <SelectContent>{NETWORKS.map((network) => <SelectItem key={network.value} value={network.value}>{network.label}</SelectItem>)}</SelectContent>
                  </Select>
                </FormField>
                <FormField id={`${activeWalletTab}-address`} label="Endereço da carteira" required>
                  <Input
                    id={`${activeWalletTab}-address`}
                    placeholder="Endereço 0x da carteira"
                    value={activeForm.address}
                    onChange={(event) => setActiveForm((current) => ({ ...current, address: event.target.value }))}
                    disabled={isSaving || (!isPrimaryTab && sameAsMain)}
                    className={inputClass}
                  />
                </FormField>
                <FormField id={`${activeWalletTab}-type`} label="Tipo de carteira" required>
                  <Select
                    value={activeForm.type}
                    onValueChange={(value) => setActiveForm((current) => ({ ...current, type: value as WalletType }))}
                    disabled={isSaving || (!isPrimaryTab && sameAsMain)}
                  >
                    <SelectTrigger id={`${activeWalletTab}-type`} className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>{WALLET_TYPES.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent>
                  </Select>
                </FormField>
                <FormField id={`${activeWalletTab}-email`} label="E-mail">
                  <Input id={`${activeWalletTab}-email`} type="email" value={user?.email ?? ""} disabled className={inputClass} />
                </FormField>
              </div>

              <div className="flex flex-col gap-6">
                <FormField id={`${activeWalletTab}-nickname`} label="Apelido da carteira">
                  <Input id={`${activeWalletTab}-nickname`} className={inputClass} />
                </FormField>
                <FormField id={`${activeWalletTab}-profileName`} label="Nome do perfil">
                  <Input id={`${activeWalletTab}-profileName`} value={user?.username ?? ""} disabled className={inputClass} />
                </FormField>
                <FormField id={`${activeWalletTab}-referralCode`} label="Código de indicação">
                  <Input id={`${activeWalletTab}-referralCode`} className={inputClass} />
                </FormField>
                <FormField id={`${activeWalletTab}-ensName`} label="Nome ENS">
                  <div className="flex gap-2.5">
                    <Select defaultValue=".eth">
                      <SelectTrigger aria-label="Sufixo ENS" className="h-10 w-[78px] shrink-0 rounded-sm border-border bg-transparent px-3 text-sm text-primary/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>{ENS_SUFFIXES.map((suffix) => <SelectItem key={suffix} value={suffix}>{suffix}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input id={`${activeWalletTab}-ensName`} className={cn(inputClass, "min-w-0 flex-1")} />
                  </div>
                </FormField>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving || walletsQuery.isPending} className="h-10 w-fit rounded-sm bg-primary px-3 text-xs font-bold text-primary-foreground hover:bg-accent">
                {isSaving ? "Salvando..." : "Salvar carteira"}
              </Button>
              {hasActiveChanges && <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving} className="h-10 rounded-sm px-3 text-xs font-bold">Cancelar</Button>}
            </div>
            {walletsQuery.isPending && <p className="text-xs text-primary/80" role="status">Carregando carteiras...</p>}
            {walletsQuery.isError && <p className="text-xs text-destructive" role="alert">{getApiErrorMessage(walletsQuery.error)}</p>}
            {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
            {success && <p className="text-xs text-primary" role="status">{success}</p>}
          </form>
        </div>
      </div>
    </main>
  );
};
