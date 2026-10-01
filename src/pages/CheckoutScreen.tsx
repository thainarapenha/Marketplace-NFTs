import { useMemo, useState } from "react";

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
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const NETWORKS = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"];
const WALLET_TYPES = ["Hot wallet", "Cold wallet", "Custodial"];
const ENS_SUFFIXES = [".eth", ".xyz", ".art"];

const WALLET_OPTIONS = [
  { value: "all", label: null },
  { value: "metamask", label: "MetaMask" },
  { value: "coinbase", label: "Coinbase Wallet" },
];

const NETWORK_FEE = 0.016;

const parseEth = (value: string) => Number.parseFloat(value);

const formatEth = (value: number, decimals = 2) =>
  `${value.toFixed(decimals)} ETH`;

const Required = () => <span className="ml-0.5 text-primary">*</span>;

type FieldProps = {
  id: string;
  label?: string;
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
}: FieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {label ? (
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
        {required && <Required />}
      </Label>
    ) : null}
    {children}
  </div>
);

const inputClass =
  "h-10 rounded-md border-border bg-transparent text-xs placeholder:text-primary/70";

export const CheckoutScreen = () => {
  const { items } = useCart();

  const [useOtherWallet, setUseOtherWallet] = useState(false);
  const [wallet, setWallet] = useState("coinbase");

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
                >
                  <Input id="displayName" className={inputClass} />
                </FormField>

                <FormField id="network" label="Rede" required>
                  <Select>
                    <SelectTrigger
                      id="network"
                      className="h-10 w-full border-border bg-transparent text-xs text-primary/70"
                    >
                      <SelectValue placeholder="Selecione uma rede" />
                    </SelectTrigger>
                    <SelectContent>
                      {NETWORKS.map((network) => (
                        <SelectItem
                          key={network}
                          value={network.toLowerCase()}
                        >
                          {network}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  id="walletAddress"
                  label="Endereço da carteira"
                  required
                >
                  <Input
                    id="walletAddress"
                    placeholder="Endereço 0x da carteira"
                    className={cn(inputClass, "px-5")}
                  />
                </FormField>

                <FormField id="walletType" label="Tipo de carteira" required>
                  <Select>
                    <SelectTrigger
                      id="walletType"
                      className="h-10 w-full border-border bg-transparent text-xs text-primary/70"
                    >
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {WALLET_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type.toLowerCase()}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField id="email" label="E-mail" required>
                  <Input
                    id="email"
                    type="email"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  id="username"
                  label="Nome de usuário"
                  required
                >
                  <Input id="username" className={inputClass} />
                </FormField>

                <FormField
                  id="profileName"
                  label="Nome do perfil"
                  required
                >
                  <Input id="profileName" className={inputClass} />
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
                  required
                >
                  <Input id="referralCode" className={inputClass} />
                </FormField>

                <FormField id="ensSuffix" label="Nome ENS" required>
                  <Select defaultValue=".eth">
                    <SelectTrigger
                      id="ensSuffix"
                      className="h-10 w-24 border-border bg-transparent text-xs"
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
                  console.log("NFT price:", item.nft.price);
                  const itemPrice = parseEth(item.nft.price);
                  const itemSubtotal = itemPrice * item.quantity;
                  const image = item.nft.gallery[0];

                  console.log("Cart items:", items);

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

            <RadioGroup
              value={wallet}
              onValueChange={setWallet}
              className="flex flex-col gap-3"
            >
              {WALLET_OPTIONS.map((option) => {
                const id = `wallet-${option.value}`;
                const selected = wallet === option.value;

                return (
                  <Label
                    key={option.value}
                    htmlFor={id}
                    className={cn(
                      "flex h-11 cursor-pointer items-center gap-3 rounded-md border bg-transparent px-3 text-sm font-normal",
                      selected
                        ? "border-foreground"
                        : "border-border",
                    )}
                  >
                    <RadioGroupItem
                      id={id}
                      value={option.value}
                      className="size-4 border-primary"
                    />

                    {option.label ? (
                      <span>{option.label}</span>
                    ) : (
                      <span className="rounded-md bg-secondary px-3 py-1 text-[8px] font-bold tracking-wide text-primary">
                        METAMASK · WALLETCONNECT · COINBASE
                      </span>
                    )}
                  </Label>
                );
              })}
            </RadioGroup>

            <Button
              type="button"
              disabled={items.length === 0}
              className="mt-2 h-11 w-full bg-primary text-sm font-bold text-primary-foreground hover:bg-accent"
            >
              Confirmar compra
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
};