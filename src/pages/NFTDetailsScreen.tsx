import { useEffect, useState } from "react";
import {
  Heart,
  Mail,
  Minus,
  Plus,
  Search,
  Star,
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { nftMock } from "@/mocks/nft";

/* ---------- Tela ---------- */
export const NftDetailScreen = () => {
  const nft = nftMock;
  
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [edition, setEdition] = useState<string[]>(["1/50"]);

  const [api, setApi] = useState<CarouselApi>();
  const [dot, setDot] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!api) return;
    setDots(api.scrollSnapList().length);
    setDot(api.selectedScrollSnap());
    api.on("select", () => setDot(api.selectedScrollSnap()));
  }, [api]);

  return (
    <main className="mx-auto max-w-[1200px] px-4 md:px-6">
      {/* ===== Breadcrumb ===== */}
      <Breadcrumb className="py-4">
        <BreadcrumbList className="text-xs font-semibold text-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-foreground">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">Mercado</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ===== Produto ===== */}
      <section className="grid gap-6 lg:grid-cols-[84px_minmax(0,480px)_1fr]">
        {/* Miniaturas */}
        <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
          {nft.gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`Ver imagem ${i + 1}`}
              className={`w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                selected === i ? "border-accent" : "border-transparent"
              }`}
            >
              <AspectRatio ratio={1}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </AspectRatio>
            </button>
          ))}
        </div>

        {/* Imagem principal */}
        <Card className="relative order-1 border-0 bg-card lg:order-2">
          <CardContent className="p-3">
            <AspectRatio ratio={1} className="overflow-hidden rounded-xl">
              <img
                src={nft.gallery[selected]}
                alt="Emerald Ape #042"
                className="h-full w-full object-cover"
              />
            </AspectRatio>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ampliar imagem"
              className="absolute right-2 top-2 size-8 rounded-full bg-card"
            >
              <Search className="size-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Informações */}
        <div className="order-3 space-y-4">
          <h1 className="text-2xl font-bold">Emerald Ape #042</h1>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-bold text-primary">1.19 ETH</p>
            <div className="flex items-center gap-1 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3 fill-primary text-primary" />
              ))}
              <span className="ml-1">19 avaliações de colecionadores</span>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-2">
            <h2 className="text-xs font-bold">Sobre este NFT:</h2>
            <p className="text-xs leading-6 text-primary">
              Um colecionável digital finalizado à mão da coleção Kurio Editions,
              verificado na Ethereum, com arte desbloqueável e acesso para
              colecionadores.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold">Edição:</h2>
            <ToggleGroup
              value={edition}
              onValueChange={setEdition}
              className="justify-start gap-2"
            >
              {nft.editions.map((e) => (
                <ToggleGroupItem
                  key={e}
                  value={e}
                  className="h-6 rounded-full border border-border px-2 text-[10px] text-muted-foreground data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-primary"
                >
                  {e}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Quantidade + ações */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                className="size-8 rounded-full"
                aria-label="Diminuir"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-4 text-center text-sm">{quantity}</span>
              <Button
                size="icon"
                className="size-8 rounded-full"
                aria-label="Aumentar"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button size="sm" className="text-xs">COMPRAR</Button>
              <Button variant="outline" size="sm" className="border-primary text-xs text-primary">
                <Heart className="size-4" />
                Favoritar
              </Button>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-primary">
            <li>ID do token: #0042</li>
            <li>Coleção: Kurio Apes</li>
            <li>Atributos: Óculos, Esmeralda, Raro</li>
          </ul>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold">Compartilhar este NFT:</span>
            {/* <Linkedin className="size-4" /> */}
            <Mail className="size-4" />
            {/* <Twitter className="size-4" /> */}
          </div>
        </div>
      </section>

      {/* ===== Abas ===== */}
      <Tabs defaultValue="details" className="mt-16">
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
          {[
            ["details", "Detalhes do NFT"],
            ["reviews", "Avaliações de colecionadores (19)"],
          ].map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 text-sm shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4 text-xs leading-6 text-primary">
          <p>
            Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção
            Kurio Editions. Cada atributo fica armazenado nos metadados do token
            e verificado na Ethereum. A obra explora identidade, movimento e luz
            em um mundo digital sem fronteiras.
          </p>
          <p>
            A propriedade inclui arte em alta resolução, lançamentos exclusivos
            para colecionadores e um registro permanente de procedência
            registrada na rede. Nova Sato recebe 5% de direitos autorais nas
            vendas secundárias, apoiando novos trabalhos e lançamentos da
            comunidade.
          </p>
          {nft.details.map((d) => (
            <div key={d.label}>
              <p className="font-bold text-foreground">{d.label}:</p>
              <p>{d.text}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4 text-xs text-muted-foreground">
          Em breve: avaliações de colecionadores.
        </TabsContent>
      </Tabs>

      {/* ===== Mais desta coleção ===== */}
      <section className="mt-16">
        <h2 className="border-b border-border pb-2 text-sm font-bold text-primary">
          Mais desta coleção
        </h2>

        <Carousel setApi={setApi} opts={{ align: "start" }} className="mt-6">
          <CarouselContent>
            {nft.related.map((n) => (
              <CarouselItem key={n.name} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                <Card className="border-0 bg-card">
                  <CardContent className="p-3">
                    <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
                      <img src={n.img} alt={n.name} className="h-full w-full object-cover" />
                    </AspectRatio>
                  </CardContent>
                </Card>
                <p className="mt-2 text-xs">{n.name}</p>
                <p className="text-xs font-bold text-primary">{n.price}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: dots }).map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`size-2.5 rounded-full border border-primary ${
                dot === i ? "bg-primary" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===== Features + Newsletter ===== */}
      <section className="mt-16 grid gap-6 rounded-lg bg-card p-6 md:grid-cols-4">
        {nft.features.map((f) => (
          <div key={f.title} className="space-y-2 md:border-r md:border-border md:pr-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {f.letter}
            </div>
            <h3 className="text-sm font-bold">{f.title}</h3>
            <p className="text-xs leading-5 text-muted-foreground">{f.text}</p>
          </div>
        ))}

        <div className="space-y-3">
          <h3 className="text-sm font-bold">Antecipe-se ao próximo lançamento</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="digite seu e-mail..."
              className="h-8 border-0 bg-secondary text-xs"
            />
            <Button size="sm" className="h-8 text-xs">Enviar</Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </div>
      </section>
    </main>
  );
}