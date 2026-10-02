// src/screens/WalletsScreen.tsx
import { useState } from "react";

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

const NETWORKS = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"];
const WALLET_TYPES = ["Hot wallet", "Cold wallet", "Custodial"];
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

export const WalletsScreen = () => {
  const [activeSection, setActiveSection] = useState<ProfileSection>("wallets");
  const [sameAsMain, setSameAsMain] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: enviar a carteira principal para a API
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
              <Button
                type="button"
                variant="ghost"
                className="h-auto p-0 text-sm font-bold text-primary hover:bg-transparent hover:text-accent"
              >
                Adicionar
              </Button>
            </header>

            <div className="grid grid-cols-1 gap-x-11 gap-y-6 md:grid-cols-2">
              {/* Coluna esquerda */}
              <div className="flex flex-col gap-6">
                <FormField id="displayName" label="Nome de exibição" required>
                  <Input id="displayName" name="displayName" className={inputClass} />
                </FormField>

                <FormField id="network" label="Rede" required>
                  <Select>
                    <SelectTrigger id="network" className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione uma rede" />
                    </SelectTrigger>
                    <SelectContent>
                      {NETWORKS.map((network) => (
                        <SelectItem key={network} value={network.toLowerCase()}>
                          {network}
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
                    className={inputClass}
                  />
                </FormField>

                <FormField id="walletType" label="Tipo de carteira" required>
                  <Select>
                    <SelectTrigger id="walletType" className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione uma carteira" />
                    </SelectTrigger>
                    <SelectContent>
                      {WALLET_TYPES.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>

              {/* Coluna direita */}
              <div className="flex flex-col gap-6">
                <FormField id="walletNickname" label="Apelido da carteira" required>
                  <Input
                    id="walletNickname"
                    name="walletNickname"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="profileName" label="Nome do perfil" required>
                  <Input id="profileName" name="profileName" className={inputClass} />
                </FormField>

                <FormField>
                  <Input
                    name="secondaryWallet"
                    aria-label="ENS ou carteira secundária"
                    placeholder="ENS ou carteira secundária (opcional)"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="referralCode" label="Código de indicação" required>
                  <Input
                    id="referralCode"
                    name="referralCode"
                    className={inputClass}
                  />
                </FormField>

                <FormField id="ensName" label="Nome ENS" required>
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

            <Button
              type="submit"
              className="h-10 w-fit rounded-sm bg-primary px-3 text-xs font-bold text-primary-foreground hover:bg-accent"
            >
              Salvar carteira
            </Button>
          </form>

          {/* Carteira secundária */}
          <section className="flex flex-col gap-1.5">
            <header className="flex items-center justify-between gap-4">
              <h2 className="text-base font-bold">Carteira secundária</h2>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="sameAsMain"
                  checked={sameAsMain}
                  onCheckedChange={(checked) => setSameAsMain(checked === true)}
                  className="size-4 rounded-full border-primary"
                />
                <Label htmlFor="sameAsMain" className="text-xs font-normal">
                  Igual à carteira principal
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={sameAsMain}
                  className="h-auto p-0 text-sm font-bold text-primary hover:bg-transparent hover:text-accent"
                >
                  Adicionar
                </Button>
              </div>
            </header>

            <p className="text-xs text-primary/80">
              Você ainda não adicionou uma carteira secundária.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};