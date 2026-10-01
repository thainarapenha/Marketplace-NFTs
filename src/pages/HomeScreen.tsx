import { useState } from "react";

import { ArrowRight, ChevronRight } from "lucide-react";

import { NftImage } from "@/components/home/NftImage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  banners,
  collections,
  features,
  img,
  networks,
  nfts,
  posts,
} from "@/mocks/home";

export const HomeScreen = () => {
  const price = [0.02, 12.38];

  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const toggle = (name: string) =>
    setChecked((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name],
    );

  return (
    <main className="mx-auto max-w-[1200px] px-4 md:px-6">
      {/* ---------- Hero ---------- */}

      <section className="mt-2 grid items-center gap-6 rounded-2xl md:grid-cols-2">
        <div className="space-y-5 py-8 md:pl-10">
          <p className="text-xs text-muted-foreground">
            Bem-vindo à Kurio
          </p>

          <h1 className="text-[43px] font-bold leading-[70px] max-md:text-3xl max-md:leading-tight">
            SEJA DONO DO FUTURO DA ARTE DIGITAL
          </h1>

          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </p>

          <Button>EXPLORAR</Button>

          <div className="flex gap-1.5 pt-4 md:pl-[70%]">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-primary/60" />
            <span className="size-1.5 rounded-full bg-primary/60" />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl">
          <AspectRatio ratio={1}>
            <img
              src={img(1)}
              alt="NFT em destaque"
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </div>
      </section>

      {/* ---------- Marketplace ---------- */}

      <section className="mt-16 grid gap-6 lg:grid-cols-[190px_1fr]">
        <aside className="space-y-8">
          <Card className="border-0 bg-card">
            <CardContent className="space-y-5 p-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold">Coleções</h3>

                <ul className="space-y-2.5">
                  {collections.map(([name, count]) => (
                    <li
                      key={name}
                      className="flex items-center justify-between text-xs"
                    >
                      <label className="flex cursor-pointer items-center gap-2 text-primary">
                        <Checkbox
                          checked={checked.includes(name)}
                          onCheckedChange={() => toggle(name)}
                        />
                        {name}
                      </label>

                      <span className="text-muted-foreground">
                        ({count})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Faixa de preço</h3>

                <Slider
                  min={0.02}
                  max={12.38}
                  step={0.01}
                  value={price}
                />

                <p className="text-xs text-muted-foreground">
                  Preço: {price[0].toFixed(2)} - {price[1].toFixed(2)} ETH
                </p>

                <Button size="sm" className="h-7 text-xs">
                  Aplicar
                </Button>
              </div>

              <Separator className="bg-border" />

              <div>
                <h3 className="mb-3 text-sm font-semibold">Rede</h3>

                <ul className="space-y-2.5">
                  {networks.map(([name, count]) => (
                    <li
                      key={name}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-muted-foreground">{name}</span>
                      <span className="text-muted-foreground">
                        ({count})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 bg-secondary">
            <CardContent className="p-0">
              <div className="space-y-1 p-3">
                <p className="text-sm font-bold text-primary">
                  NFT EM DESTAQUE
                </p>

                <p className="text-xs font-semibold">OFERTA LIMITADA</p>
              </div>

              <AspectRatio ratio={4 / 5}>
                <img
                  src={img(2)}
                  alt="NFT em destaque"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </CardContent>
          </Card>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Tabs defaultValue="all">
              <TabsList className="h-auto gap-4 bg-transparent p-0">
                {[
                  ["all", "Todos os NFTs"],
                  ["new", "Novos lançamentos"],
                  ["hot", "Em alta"],
                ].map(([value, label]) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-1 text-xs text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Ordenar por:

              <Select defaultValue="recent">
                <SelectTrigger className="h-8 w-[170px] border-0 bg-transparent text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="recent">
                    Listados recentemente
                  </SelectItem>

                  <SelectItem value="low">Menor preço</SelectItem>

                  <SelectItem value="high">Maior preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {nfts.map((nft, i) => (
              <Card key={i} className="border-0 bg-card">
                <CardContent className="space-y-3 p-3">
                  <NftImage src={nft.img} alt={nft.name} />

                  <div>
                    <p className="text-xs">{nft.name}</p>

                    <p className="mt-1 text-xs font-semibold text-primary">
                      {nft.price}

                      {nft.old && (
                        <span className="ml-2 font-normal text-muted-foreground line-through">
                          {nft.old}
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination className="mt-8 justify-end">
            <PaginationContent>
              {[1, 2, 3, 4].map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    size="icon"
                    isActive={page === n}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(n);
                    }}
                    className={
                      page === n
                        ? "border-0 bg-accent text-accent-foreground"
                        : "border-0 bg-card"
                    }
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  className="border-0 bg-card [&>span]:hidden"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* ---------- Banners ---------- */}

      <section className="mt-16 grid gap-4 md:grid-cols-2">
        {banners.map((banner) => (
          <Card
            key={banner.title}
            className="overflow-hidden border-0 bg-card"
          >
            <CardContent className="grid grid-cols-[1fr_1.1fr] p-0">
              <img
                src={banner.img}
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="flex flex-col justify-center gap-2 p-4">
                <h3 className="text-sm font-bold">{banner.title}</h3>

                <p className="text-[11px] leading-4 text-muted-foreground">
                  {banner.text}
                </p>

                <Button size="sm" className="mt-1 h-7 w-fit text-xs">
                  Explorar
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ---------- Blog ---------- */}

      <section className="mt-16">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">Diário da Cunhagem</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Histórias, guias e insights para colecionadores sobre o universo
            da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {posts.map((post) => (
            <Card
              key={post.title}
              className="overflow-hidden border-0 bg-card"
            >
              <AspectRatio ratio={1}>
                <img
                  src={post.img}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </AspectRatio>

              <CardContent className="space-y-1.5 p-3">
                <p className="text-[10px] text-muted-foreground">
                  {post.date} | Leitura de {post.read}
                </p>

                <h3 className="text-xs font-bold">{post.title}</h3>

                <p className="text-[10px] text-muted-foreground">
                  {post.text}
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[10px] text-primary"
                >
                  Ler mais
                  <ChevronRight className="size-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Features + Newsletter ---------- */}

      <section className="mt-16 grid gap-6 rounded-lg bg-card p-6 md:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="space-y-2 md:border-r md:border-border md:pr-6"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {feature.letter}
            </div>

            <h3 className="text-sm font-bold">{feature.title}</h3>

            <p className="text-xs leading-5 text-muted-foreground">
              {feature.text}
            </p>
          </div>
        ))}

        <div className="space-y-3">
          <h3 className="text-sm font-bold">
            Antecipe-se ao próximo lançamento
          </h3>

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="digite seu e-mail..."
              className="h-8 border-0 bg-secondary text-xs"
            />

            <Button size="sm" className="h-8 text-xs">
              Enviar
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Receba lançamentos selecionados, histórias de criadores e
            novidades do mercado.
          </p>
        </div>
      </section>
    </main>
  );
};