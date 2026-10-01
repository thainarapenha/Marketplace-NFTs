import { useEffect, useMemo, useState } from "react";

import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight } from "lucide-react";

import { NftImage } from "@/components/home/NftImage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

import { getNfts } from "@/services/nft";

import {
  banners,
  networks,
  posts,
} from "@/mocks/home";

export const HomeScreen = () => {
  const defaultMinPrice = 0.02;
const defaultMaxPrice = 12.38;
  const itemsPerPage = 9;

  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState([defaultMinPrice, defaultMaxPrice]);
  const [sort, setSort] = useState("recent");
  const [tab, setTab] = useState("all");
  const [heroIndex, setHeroIndex] = useState(0);

  const {
    data: nfts = [],
    isLoading: isNftsLoading,
    isError: isNftsError,
  } = useQuery({
    queryKey: ["nfts"],
    queryFn: getNfts,
  });

  useEffect(() => {
    if (nfts.length < 3) return;

    const interval = setInterval(() => {
      setHeroIndex((current) => (current + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, [nfts.length]);

  const toggle = (name: string) => {
    setChecked((prev) => {
      const next = prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];

      setPage(1);

      return next;
    });
  };

  const filteredNfts = useMemo(() => {
    const filtered = nfts.filter((nft) => {
      const numericPrice = Number.parseFloat(nft.price);

      const matchesCollection =
        checked.length === 0 || checked.includes(nft.collection);

      const matchesPrice =
        numericPrice >= price[0] && numericPrice <= price[1];

      return matchesCollection && matchesPrice;
    });

    if (sort === "low") {
      return [...filtered].sort(
        (a, b) =>
          Number.parseFloat(a.price) - Number.parseFloat(b.price),
      );
    }

    if (sort === "high") {
      return [...filtered].sort(
        (a, b) =>
          Number.parseFloat(b.price) - Number.parseFloat(a.price),
      );
    }

    return filtered;
  }, [nfts, checked, price, sort]);

  const tabNfts = useMemo(() => {
    if (tab === "new") {
      return [...filteredNfts].sort(
        (a, b) => Number(b.id) - Number(a.id),
      );
    }

    if (tab === "hot") {
      return [...filteredNfts].sort((a, b) => b.reviews - a.reviews);
    }

    return filteredNfts;
  }, [filteredNfts, tab]);

  const totalPages = Math.max(
    1,
    Math.ceil(tabNfts.length / itemsPerPage),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedNfts = tabNfts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const collectionOptions = useMemo(() => {
    const counts = new Map<string, number>();

    nfts.forEach((nft) => {
      counts.set(nft.collection, (counts.get(nft.collection) ?? 0) + 1);
    });

    return Array.from(counts.entries());
  }, [nfts]);

  return (
    <main className="mx-auto max-w-[1200px] px-4 md:px-6">
      {/* ---------- Hero ---------- */}

      <section className="mt-2 grid items-stretch gap-6 rounded-2xl md:grid-cols-[6fr_4fr]">
        <div className="flex flex-col justify-center space-y-5 py-8 md:pl-10">
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

          <Button className="self-start">EXPLORAR</Button>

          <div className="flex gap-1.5 pt-4 md:pl-[70%]">
            {nfts.slice(0, 3).map((nft, index) => (
              <button
                key={nft.id}
                type="button"
                aria-label={`Exibir ${nft.name}`}
                onClick={() => setHeroIndex(index)}
                className={`size-1.5 rounded-full transition-opacity ${
                  heroIndex === index ? "bg-primary" : "bg-primary/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-3xl md:min-h-0">
          {nfts.slice(0, 3).map((nft, index) => (
            <img
              key={nft.id}
              src={nft.gallery[0]}
              alt={nft.name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                heroIndex === index
                  ? "translate-x-0 opacity-100"
                  : index < heroIndex
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
              }`}
            />
          ))}
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
                  {collectionOptions.map(([name, count]) => (
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
                  min={defaultMinPrice}
                  max={defaultMaxPrice}
                  step={0.01}
                  value={price}
                  onValueChange={(value) => {
                    if (!Array.isArray(value)) return;

                    setPrice([...value]);
                    setPage(1);
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  Preço: {price[0].toFixed(2)} - {price[1].toFixed(2)} ETH
                </p>

                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPage(1)}
                >
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

          {nfts[0] && (
            <Card className="overflow-hidden border-0 bg-secondary">
              <CardContent className="p-0">
                <div className="space-y-1 p-3">
                  <p className="text-sm font-bold text-primary">
                    NFT EM DESTAQUE
                  </p>

                  <p className="text-xs font-semibold">{nfts[0].name}</p>
                </div>

                <AspectRatio ratio={4 / 5}>
                  <Link
                    to="/nft/$id"
                    params={{ id: nfts[0].id }}
                    className="block h-full"
                  >
                    <img
                      src={nfts[0].gallery[0]}
                      alt={nfts[0].name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </AspectRatio>
              </CardContent>
            </Card>
          )}
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={tab}
              onValueChange={(value) => {
                if (!value) return;

                setTab(value);
                setPage(1);
              }}
            >
              <TabsList variant="line" className="h-auto gap-4 bg-transparent p-0">
                {[
                  ["all", "Todos os NFTs"],
                  ["new", "Novos lançamentos"],
                  ["hot", "Em alta"],
                ].map(([value, label]) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-none border-transparent bg-transparent px-0 pb-1 text-xs text-muted-foreground shadow-none data-active:text-[#E89B55] data-active:after:bg-[#E89B55]"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              Ordenar por:

              <Select
                value={sort}
                onValueChange={(value) => {
                  if (!value) return;

                  setSort(value);
                  setPage(1);
                }}
              >
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

          {/* ---------- NFT Grid ---------- */}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {isNftsLoading && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                Carregando NFTs...
              </div>
            )}

            {isNftsError && (
              <div className="col-span-full py-12 text-center text-sm text-destructive">
                Não foi possível carregar os NFTs.
              </div>
            )}

            {!isNftsLoading &&
              !isNftsError &&
              paginatedNfts.length === 0 && (
                <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                  Nenhum NFT encontrado com os filtros selecionados.
                </div>
              )}

            {!isNftsLoading &&
              !isNftsError &&
              paginatedNfts.map((nft) => (
                <Link
                  key={nft.id}
                  to="/nft/$id"
                  params={{ id: nft.id }}
                  className="block"
                >
                  <Card className="border-0 bg-card transition-opacity hover:opacity-90">
                    <CardContent className="space-y-3 p-3">
                      <NftImage
                        src={nft.gallery[0]}
                        alt={nft.name}
                      />

                      <div>
                        <p className="text-xs">{nft.name}</p>

                        <p className="mt-1 text-xs font-semibold text-primary">
                          {nft.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>

          {/* ---------- Pagination ---------- */}

          {!isNftsLoading && !isNftsError && totalPages > 1 && (
            <Pagination className="mt-8 justify-end">
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        size="icon"
                        isActive={currentPage === pageNumber}
                        onClick={(event) => {
                          event.preventDefault();
                          goToPage(pageNumber);
                        }}
                        className={
                          currentPage === pageNumber
                            ? "border-0 bg-accent text-accent-foreground"
                            : "border-0 bg-card"
                        }
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                    className="border-0 bg-card [&>span]:hidden"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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
    </main>
  );
};