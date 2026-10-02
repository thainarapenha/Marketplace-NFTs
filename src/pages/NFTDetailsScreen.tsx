import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Mail,
  Minus,
  Plus,
  Search,
  Star,
} from "lucide-react";

import { getNftById, getNfts } from "@/services/nft";
import { useCart } from "@/lib/cart";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

/* ---------- Tela ---------- */
export const NftDetailScreen = () => {
  const { id } = useParams({
    from: "/nft/$id",
  });

  const navigate = useNavigate();
  const { addItem } = useCart();

  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [edition, setEdition] = useState("");

  const [api, setApi] = useState<CarouselApi>();
  const [dot, setDot] = useState(0);
  const [dots, setDots] = useState(0);

  const [isImageExpanded, setIsImageExpanded] = useState(false);

  /* ---------- NFT ---------- */
  const {
    data: nft,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["nft", id],
    queryFn: () => getNftById(id),
  });

  /* ---------- NFTs relacionados ---------- */
  const { data: nfts } = useQuery({
    queryKey: ["nfts"],
    queryFn: getNfts,
  });

  const relatedNfts = useMemo(() => {
    if (!nft || !nfts) return [];

    return nft.relatedIds
      .map((relatedId) =>
        nfts.find((item) => item.id === relatedId),
      )
      .filter(Boolean);
  }, [nft, nfts]);

  /* ---------- Carousel ---------- */
  useEffect(() => {
    if (!api) return;

    const updateCarousel = () => {
      setDots(api.scrollSnapList().length);
      setDot(api.selectedScrollSnap());
    };

    updateCarousel();

    api.on("select", updateCarousel);

    return () => {
      api.off("select", updateCarousel);
    };
  }, [api]);

  /* ---------- Estados da requisição ---------- */
  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        <p className="text-sm text-muted-foreground">
          Carregando NFT...
        </p>
      </main>
    );
  }

  if (isError || !nft) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        <h1 className="text-xl font-bold">NFT não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O NFT solicitado não existe ou não pôde ser carregado.
        </p>
      </main>
    );
  }

  /* ---------- Dados derivados ---------- */
  const currentEdition = edition || nft.defaultEdition;

  return (
    <main className="mx-auto min-w-0 max-w-[1200px] px-4 md:px-6">
      {/* ===== Breadcrumb ===== */}
      <Breadcrumb className="py-4 max-md:hidden">
        <BreadcrumbList className="text-xs font-semibold text-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-foreground">
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">
              Mercado
            </BreadcrumbPage>
          </BreadcrumbItem>

          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">
              {nft.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ===== Produto ===== */}
      <section className="grid min-w-0 gap-6 lg:grid-cols-[84px_minmax(0,480px)_1fr]">
        {/* Miniaturas */}
        <div className="order-2 flex min-w-0 flex-wrap gap-3 lg:order-1 lg:flex-col lg:flex-nowrap">
          {nft.gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Ver imagem ${index + 1}`}
              className={`w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                selected === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <AspectRatio ratio={1}>
                <img
                  src={src}
                  alt={`${nft.name} - imagem ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </button>
          ))}
        </div>

        {/* Imagem principal */}
        <Card className="relative order-1 border-0 bg-card lg:order-2">
          <CardContent className="p-0 md:p-3">
            <AspectRatio
              ratio={1}
              className="overflow-hidden rounded-xl"
            >
              <img
                src={nft.gallery[selected]}
                alt={nft.name}
                className="h-full w-full object-cover"
              />
            </AspectRatio>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Ampliar imagem"
              className="absolute right-2 top-2 size-8 rounded-full bg-card"
              onClick={() => setIsImageExpanded(true)}
            >
              <Search className="size-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Informações */}
        <div className="order-3 min-w-0 space-y-4">
          <h1 className="text-2xl font-bold">{nft.name}</h1>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-lg font-bold text-primary">
              {nft.price}
            </p>

            <div className="flex items-center gap-1 text-xs">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="size-3 fill-primary text-primary"
                />
              ))}

              <span className="ml-1">
                {nft.reviews} avaliações de colecionadores
              </span>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Descrição */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold">
              Sobre este NFT:
            </h2>

            <p className="text-xs leading-6 text-primary">
              {nft.description}
            </p>
          </div>

          {/* Edição */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold">Edição:</h2>

            <div className="flex flex-wrap gap-2">
              {nft.editions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEdition(item)}
                  className={`h-6 rounded-full border px-2 text-[10px] transition-colors ${
                    currentEdition === item
                      ? "border-primary bg-transparent text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade + ações */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                className="size-8 rounded-full"
                aria-label="Diminuir quantidade"
                onClick={() =>
                  setQuantity((value) =>
                    Math.max(1, value - 1),
                  )
                }
              >
                <Minus className="size-4" />
              </Button>

              <span className="w-4 text-center text-sm">
                {quantity}
              </span>

              <Button
                size="icon"
                className="size-8 rounded-full"
                aria-label="Aumentar quantidade"
                onClick={() =>
                  setQuantity((value) => value + 1)
                }
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                size="sm"
                className="text-xs"
                onClick={() => {
                  addItem(
                    nft,
                    currentEdition,
                    quantity,
                  );

                  navigate({
                    to: "/cart",
                  });
                }}
              >
                COMPRAR
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-primary text-xs text-primary"
              >
                <Heart className="size-4" />
                Favoritar
              </Button>
            </div>
          </div>

          {/* Metadados */}
          <ul className="space-y-2 text-xs text-primary">
            {nft.details.map((detail) => (
              <li key={detail.label}>
                <span className="font-semibold">
                  {detail.label}:
                </span>{" "}
                {detail.text}
              </li>
            ))}
          </ul>

          {/* Compartilhar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold">
              Compartilhar este NFT:
            </span>

            <Mail className="size-4" />
          </div>
        </div>
      </section>

      {isImageExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${nft.name}`}
          onClick={() => setIsImageExpanded(false)}
        >
          <img
            src={nft.gallery[selected]}
            alt={nft.name}
            className="max-h-[70vh] max-w-[75vw] object-contain md:max-h-[90vh] md:max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Fechar imagem ampliada"
            className="absolute right-4 top-4 size-10 rounded-full bg-card"
            onClick={() => setIsImageExpanded(false)}
          >
            ×
          </Button>
        </div>
      )}

      {/* ===== Abas ===== */}
      <Tabs defaultValue="details" className="mt-16 min-w-0">
        <TabsList
          variant="line"
          className="h-auto max-w-full flex-wrap gap-6 bg-transparent p-0"
        >
          <TabsTrigger
            value="details"
            className="rounded-none border-transparent bg-transparent px-0 pb-1 text-sm text-muted-foreground shadow-none data-active:text-primary data-active:after:bg-primary"
          >
            Detalhes do NFT
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="rounded-none border-transparent bg-transparent px-0 pb-1 text-sm text-muted-foreground shadow-none data-active:text-primary data-active:after:bg-primary"
          >
            Avaliações de colecionadores ({nft.reviews})
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="details"
          className="mt-4 space-y-4 text-xs leading-6 text-primary"
        >
          {nft.fullDescription.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {nft.details.map((detail) => (
            <div key={detail.label}>
              <p className="font-bold text-foreground">
                {detail.label}:
              </p>

              <p>{detail.text}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent
          value="reviews"
          className="mt-4 text-xs text-muted-foreground"
        >
          Em breve: avaliações de colecionadores.
        </TabsContent>
      </Tabs>

      {/* ===== Mais desta coleção ===== */}
      {relatedNfts.length > 0 && (
        <section className="mt-16">
          <h2 className="border-b border-border pb-2 text-sm font-bold text-primary">
            Mais desta coleção
          </h2>

          <Carousel
            setApi={setApi}
            opts={{ align: "start" }}
            className="mt-6 min-w-0"
          >
            <CarouselContent>
              {relatedNfts.map((related) => (
                <CarouselItem
                  key={related!.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <Link
                    to="/nft/$id"
                    params={{ id: related!.id }}
                    className="block"
                  >
                    <Card className="border-0 bg-card">
                      <CardContent className="p-3">
                        <AspectRatio
                          ratio={1}
                          className="overflow-hidden rounded-lg"
                        >
                          <img
                            src={related!.gallery[0]}
                            alt={related!.name}
                            className="h-full w-full object-cover"
                          />
                        </AspectRatio>
                      </CardContent>
                    </Card>

                    <p className="mt-2 text-xs">
                      {related!.name}
                    </p>

                    <p className="text-xs font-bold text-primary">
                      {related!.price}
                    </p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {dots > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: dots }).map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Ir para o slide ${index + 1}`}
                    onClick={() => api?.scrollTo(index)}
                    className={`size-2.5 rounded-full border border-primary ${
                      dot === index
                        ? "bg-primary"
                        : "bg-transparent"
                    }`}
                  />
                ),
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
};
