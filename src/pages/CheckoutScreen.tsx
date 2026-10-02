import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useWallets } from "@/hooks/useWallets";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { createOrder, getOrder } from "@/services/order";
import { cn } from "@/lib/utils";
import type { Wallet } from "@/types/wallet";

const NETWORK_LABELS: Record<Wallet["network"], string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  base: "Base",
};

const WALLET_TYPE_LABELS: Record<Wallet["type"], string> = {
  hot: "Hot wallet",
  cold: "Cold wallet",
  custodial: "Custodial",
};

const NETWORK_FEE = 0.016;

const parseEth = (value: string) => Number.parseFloat(value);

const formatEth = (value: number, decimals = 2) =>
  `${value.toFixed(decimals)} ETH`;

const getWalletsErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Não foi possível carregar suas carteiras.";

const Required = () => <span className="ml-0.5 text-primary">*</span>;

type FieldProps = {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

const FormField = ({
  id,
  label,
  required,
  error,
  className,
  children,
}: FieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {label ? (
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
        {required && <Required />}
      </Label>
    ) : null}
    {children}
    {error ? (
      <p className="text-xs text-destructive" role="alert">
        {error}
      </p>
    ) : null}
  </div>
);

const inputClass =
  "h-10 rounded-md border-border bg-transparent text-xs placeholder:text-primary/70";

export const CheckoutScreen = () => {
  const { items, removeQuantities } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const walletsQuery = useWallets();
  const wallets = walletsQuery.data ?? [];

  const [useOtherWallet, setUseOtherWallet] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string>();
  const [idempotencyKey, setIdempotencyKey] = useState<string>();

  useEffect(() => {
    if (!wallets.some((wallet) => wallet.id === selectedWalletId)) {
      setSelectedWalletId(
        wallets.find((wallet) => wallet.kind === "primary")?.id ??
          wallets[0]?.id ??
          "",
      );
    }
  }, [selectedWalletId, wallets]);

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId,
  );
  const displayNameError = !user?.displayName?.trim()
    ? "Preencha: nome de exibição."
    : undefined;
  const usernameError = !user?.username?.trim()
    ? "Preencha: nome de usuário."
    : undefined;
  const emailError = !user?.email?.trim()
    ? "Preencha: e-mail."
    : undefined;
  const addressError = selectedWallet && !selectedWallet.address?.trim()
    ? "Preencha/complete os dados da carteira."
    : undefined;
  const networkError = selectedWallet && !selectedWallet.network
    ? "Preencha/complete os dados da carteira."
    : undefined;
  const walletTypeError = selectedWallet && !selectedWallet.type
    ? "Preencha/complete os dados da carteira."
    : undefined;
  const hasRequiredFields =
    !displayNameError &&
    !usernameError &&
    !emailError &&
    items.length > 0 &&
    Boolean(selectedWallet) &&
    !addressError &&
    !networkError &&
    !walletTypeError;
  const canConfirm =
    hasRequiredFields &&
    !walletsQuery.isPending &&
    !walletsQuery.isError;

  const confirmPurchase = async () => {
    if (isProcessing) return;

    setPurchaseError(undefined);

    if (!hasRequiredFields || !selectedWallet) {
      setPurchaseError("Revise os dados obrigatórios antes de confirmar a compra.");
      return;
    }

    const attemptKey = idempotencyKey ?? crypto.randomUUID();
    setIdempotencyKey(attemptKey);
    setIsProcessing(true);

    try {
      const pendingOrder = await createOrder(
        {
          items: items.map((item) => ({
            nftId: item.nft.id,
            name: item.nft.name,
            tokenId: item.edition,
            image: item.nft.gallery[0],
            quantity: item.quantity,
            unitPrice: parseEth(item.nft.price),
          })),
          subtotal,
          discount,
          networkFee: NETWORK_FEE,
          total,
          wallet: selectedWallet.address,
          network: selectedWallet.network,
        },
        attemptKey,
      );

      // A única consulta após o processamento simulado mantém o fluxo simples
      // nesta issue, sem introduzir polling ou recuperação avançada.
      await new Promise((resolve) => setTimeout(resolve, 800));
      const order = await getOrder(pendingOrder.id);

      if (order.status === "confirmed") {
        removeQuantities(
          order.items.map((item) => ({
            nftId: item.nftId,
            edition: item.tokenId ?? "",
            quantity: item.quantity,
          })),
        );
        await navigate({ to: "/order/$id", params: { id: order.id } });
        return;
      }

      setPurchaseError("Não foi possível confirmar a compra. Tente novamente.");
      setIdempotencyKey(undefined);
    } catch (error) {
      setPurchaseError(
        error instanceof Error
          ? error.message
          : "Não foi possível processar a compra. Tente novamente.",
      );
      setIdempotencyKey(undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc + parseEth(item.nft.price) * item.quantity,
        0,
      ),
    [items],
  );

  const discount = 0;
  const total = subtotal - discount + NETWORK_FEE;

  return (
    <main className="min-h-screen bg-background px-6 py-6 font-mono text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList className="text-xs font-bold text-foreground sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-foreground">
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/mercado" className="text-foreground">
                Mercado
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground">
                Pagamento
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_390px]">
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-bold">Perfil do colecionador</h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <FormField
                  id="displayName"
                  label="Nome de exibição"
                  required
                  error={displayNameError}
                >
                  <Input
                    id="displayName"
                    value={user?.displayName ?? ""}
                    readOnly
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="network"
                  label="Rede"
                  required
                  error={networkError}
                >
                  <Select value={selectedWallet?.network ?? ""} disabled>
                    <SelectTrigger
                      id="network"
                      className="h-10 w-full border-border bg-transparent text-xs text-primary/70"
                    >
                      <SelectValue placeholder="Não informada" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NETWORK_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  id="walletAddress"
                  label="Endereço da carteira"
                  required
                  error={addressError}
                >
                  <Input
                    id="walletAddress"
                    value={selectedWallet?.address ?? ""}
                    placeholder="Não informado"
                    readOnly
                    className={cn(inputClass, "px-5")}
                  />
                </FormField>

                <FormField
                  id="walletType"
                  label="Tipo de carteira"
                  required
                  error={walletTypeError}
                >
                  <Select value={selectedWallet?.type ?? ""} disabled>
                    <SelectTrigger
                      id="walletType"
                      className="h-10 w-full border-border bg-transparent text-xs text-primary/70"
                    >
                      <SelectValue placeholder="Não informado" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(WALLET_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField id="email" label="E-mail" required error={emailError}>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email ?? ""}
                    readOnly
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  id="username"
                  label="Nome de usuário"
                  required
                  error={usernameError}
                >
                  <Input
                    id="username"
                    value={user?.username ?? ""}
                    readOnly
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  id="secondaryWallet"
                  className="md:mt-[1.625rem]"
                >
                  <Input
                    id="secondaryWallet"
                    aria-label="ENS ou carteira secundária"
                    placeholder="ENS ou carteira secundária (opcional)"
                    className={cn(inputClass, "px-5")}
                  />
                </FormField>

                <FormField
                  id="referralCode"
                  label="Código de indicação"
                >
                  <Input id="referralCode" className={inputClass} />
                </FormField>

                <FormField id="ensName" label="Nome ENS">
                  <Input
                    id="ensName"
                    value={user?.ensName ?? ""}
                    placeholder="Não informado"
                    readOnly
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="otherWallet"
                checked={useOtherWallet}
                onCheckedChange={(checked) =>
                  setUseOtherWallet(checked === true)
                }
                className="size-4 rounded-full border-primary"
              />
              <Label
                htmlFor="otherWallet"
                className="text-sm font-normal"
              >
                Usar outra carteira?
              </Label>
            </div>

            <FormField
              id="note"
              label="Observação do colecionador (opcional)"
            >
              <Textarea
                id="note"
                className="min-h-36 w-full resize-none rounded-md border-border bg-transparent text-xs md:w-[calc(50%-1.5rem+2rem)]"
              />
            </FormField>
          </section>

          <aside className="flex flex-col gap-3">
            <h2 className="text-base font-bold">Seus NFTs</h2>

            <div className="flex items-center justify-between text-sm font-bold">
              <span>NFTs</span>
              <span>Subtotal</span>
            </div>

            {items.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {items.map((item) => {
                  const itemPrice = parseEth(item.nft.price);
                  const itemSubtotal = itemPrice * item.quantity;
                  const image = item.nft.gallery[0];

                  return (
                    <li
                      key={`${item.nft.id}-${item.edition}`}
                      className="flex items-center gap-3 rounded-md bg-card p-0.5 pr-4"
                    >
                      <Avatar className="size-16 rounded-md after:rounded-md">
                        <AvatarImage
                          src={image}
                          alt={item.nft.name}
                          className="rounded-md object-cover"
                        />
                        <AvatarFallback className="rounded-md">
                          {item.nft.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-bold">
                          {item.nft.name}
                        </span>
                        <span className="text-[11px] text-primary/70">
                          Edição: {item.edition}
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        (x {item.quantity})
                      </span>

                      <span className="text-sm font-bold text-primary">
                        {formatEth(itemSubtotal)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-md border border-border p-6 text-center text-sm text-muted-foreground">
                Seu carrinho está vazio.
              </div>
            )}

            <Button
              type="button"
              variant="link"
              className="h-auto self-center p-0 text-xs font-normal text-foreground hover:no-underline"
            >
              Tem um código promocional? Aplique aqui
            </Button>

            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{formatEth(subtotal)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Desconto do lançamento</dt>
                <dd>
                  (-) {discount.toFixed(2).padStart(5, "0")}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Taxa de rede</dt>
                <dd>{formatEth(NETWORK_FEE, 3)}</dd>
              </div>

              <span className="text-center text-[10px] text-primary">
                Taxa estimada
              </span>
            </dl>

            <Separator />

            <div className="flex items-center justify-between px-4 text-sm font-bold">
              <span>Total</span>
              <span className="text-primary">
                {formatEth(total, 3)}
              </span>
            </div>

            <h3 className="text-center text-sm font-bold">
              Carteira e rede
            </h3>

            {walletsQuery.isPending ? (
              <div
                role="status"
                className="rounded-md border border-border p-4 text-xs text-primary/80"
              >
                Carregando suas carteiras...
              </div>
            ) : walletsQuery.isError ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 p-4 text-xs text-destructive"
              >
                {getWalletsErrorMessage(walletsQuery.error)}
              </div>
            ) : wallets.length === 0 ? (
              <div className="rounded-md border border-border p-4 text-xs text-muted-foreground">
                Você ainda não possui carteiras cadastradas.
              </div>
            ) : (
              <RadioGroup
                value={selectedWalletId}
                onValueChange={setSelectedWalletId}
                className="flex flex-col gap-3"
              >
                {wallets.map((wallet) => {
                  const inputId = `wallet-${wallet.id}`;
                  const selected = selectedWalletId === wallet.id;

                  return (
                    <Label
                      key={wallet.id}
                      htmlFor={inputId}
                      className={cn(
                        "flex min-h-16 cursor-pointer items-start gap-3 rounded-md border bg-transparent px-3 py-2.5 text-sm font-normal",
                        selected ? "border-foreground" : "border-border",
                      )}
                    >
                      <RadioGroupItem
                        id={inputId}
                        value={wallet.id}
                        className="mt-0.5 size-4 shrink-0 border-primary"
                      />

                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold">
                          <span>
                            {wallet.kind === "primary"
                              ? "Carteira principal"
                              : "Carteira secundária"}
                          </span>
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-[9px] font-normal text-primary">
                            {NETWORK_LABELS[wallet.network]}
                          </span>
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-[9px] font-normal text-primary">
                            {WALLET_TYPE_LABELS[wallet.type]}
                          </span>
                        </span>
                        <span className="break-all text-[11px] text-primary/70">
                          {wallet.address}
                        </span>
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {!walletsQuery.isPending &&
              !walletsQuery.isError &&
              wallets.length > 0 &&
              !selectedWallet && (
                <p className="text-xs text-destructive" role="alert">
                  Selecione uma carteira para continuar.
                </p>
              )}

            <Button
              type="button"
              disabled={!canConfirm || isProcessing}
              onClick={() => void confirmPurchase()}
              className="mt-2 h-11 w-full bg-primary text-sm font-bold text-primary-foreground hover:bg-accent"
            >
              {isProcessing ? "Processando compra..." : "Confirmar compra"}
            </Button>
            {purchaseError ? (
              <p className="text-center text-xs text-destructive" role="alert">
                {purchaseError}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
};
