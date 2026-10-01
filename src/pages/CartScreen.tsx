import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";

import { getNfts } from "@/services/nft";
import { useCart } from "@/lib/cart";

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
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const NETWORK_FEE = 0.016;

const formatEth = (value: number, decimals = 2) =>
  `${value.toFixed(decimals)} ETH`;

export const CartScreen = () => {
  const { items, updateQuantity, removeItem } = useCart();

  const { data: nfts = [] } = useQuery({
    queryKey: ["nfts"],
    queryFn: getNfts,
  });

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const update = () => {
      setSlideCount(carouselApi.scrollSnapList().length);
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    update();

    carouselApi.on("select", update);
    carouselApi.on("reInit", update);

    return () => {
      carouselApi.off("select", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc + Number(item.nft.price) * item.quantity,
        0,
      ),
    [items],
  );

  const total = subtotal - discount + NETWORK_FEE;

  const changeQuantity = (
    nftId: string,
    edition: string,
    delta: number,
  ) => {
    const item = items.find(
      (item) =>
        item.nft.id === nftId &&
        item.edition === edition,
    );

    if (!item) return;

    updateQuantity(
      nftId,
      edition,
      Math.max(1, item.quantity + delta),
    );
  };

  const applyPromo = () => {
    // Validação de cupom será implementada posteriormente.
    setDiscount(0);
  };

  const recommendations = nfts.slice(0, 10);

  return (
    <main className="min-h-screen bg-background px-6 py-6 font-mono text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList className="text-xs font-bold text-foreground sm:gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-foreground">
                  Início
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>/</BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/mercado"
                  className="text-foreground"
                >
                  Mercado
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>/</BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">
                  Carrinho
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            {/* Lista de NFTs */}
            <section>
              {items.length === 0 ? (
                <div className="flex min-h-64 items-center justify-center rounded-md bg-card">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <h2 className="text-base font-bold">
                      Seu carrinho está vazio
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Adicione NFTs ao carrinho para continuar.
                    </p>

                    <Button
                      type="button"
                      className="mt-2 bg-primary text-xs font-bold text-primary-foreground hover:bg-accent"
                    >
                      Continuar explorando
                    </Button>
                  </div>
                </div>
              ) : (
                <Table className="border-separate border-spacing-y-2">
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="px-0 text-sm font-bold text-foreground">
                        NFTs
                      </TableHead>

                      <TableHead className="text-sm font-bold text-foreground">
                        Preço
                      </TableHead>

                      <TableHead className="text-sm font-bold text-foreground">
                        Edições
                      </TableHead>

                      <TableHead className="text-sm font-bold text-foreground">
                        Total
                      </TableHead>

                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {items.map((item) => (
                      <TableRow
                        key={`${item.nft.id}-${item.edition}`}
                        className="border-0 bg-card hover:bg-card"
                      >
                        <TableCell className="rounded-l-md p-0">
                          <div className="flex items-center gap-4">
                            <Avatar className="size-16 rounded-md after:rounded-md">
                              <AvatarImage
                                src={item.nft.gallery[0]}
                                alt={item.nft.name}
                                className="rounded-md object-cover"
                              />

                              <AvatarFallback className="rounded-md">
                                {item.nft.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                              <span className="text-sm font-bold">
                                {item.nft.name}
                              </span>

                              <span className="text-xs text-primary/70">
                                Edição: {item.edition}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-sm font-bold text-primary">
                          {formatEth(Number(item.nft.price))}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              size="icon"
                              aria-label="Diminuir quantidade"
                              onClick={() =>
                                changeQuantity(
                                  item.nft.id,
                                  item.edition,
                                  -1,
                                )
                              }
                              className="size-5 rounded-full bg-primary text-primary-foreground hover:bg-accent"
                            >
                              <Minus className="size-3" />
                            </Button>

                            <span className="w-3 text-center text-sm">
                              {item.quantity}
                            </span>

                            <Button
                              type="button"
                              size="icon"
                              aria-label="Aumentar quantidade"
                              onClick={() =>
                                changeQuantity(
                                  item.nft.id,
                                  item.edition,
                                  1,
                                )
                              }
                              className="size-5 rounded-full bg-primary text-primary-foreground hover:bg-accent"
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        </TableCell>

                        <TableCell className="text-sm font-bold text-primary">
                          {formatEth(
                            Number(item.nft.price) *
                              item.quantity,
                          )}
                        </TableCell>

                        <TableCell className="rounded-r-md">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remover ${item.nft.name}`}
                            onClick={() =>
                              removeItem(
                                item.nft.id,
                                item.edition,
                              )
                            }
                            className="text-muted-foreground hover:bg-transparent hover:text-primary"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>

            {/* Resumo da carteira */}
            <aside className="flex flex-col gap-3 pt-2">
              <h2 className="text-base font-bold">
                Resumo da carteira
              </h2>

              <Separator />

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="promo"
                  className="text-xs font-bold"
                >
                  Código promocional
                </Label>

                <div className="flex">
                  <Input
                    id="promo"
                    value={promoCode}
                    onChange={(e) =>
                      setPromoCode(e.target.value)
                    }
                    placeholder="Digite o código promocional..."
                    className="h-8 rounded-r-none border-primary bg-transparent text-xs"
                  />

                  <Button
                    type="button"
                    onClick={applyPromo}
                    className="h-8 rounded-l-none bg-primary text-xs font-bold text-primary-foreground hover:bg-accent"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>

              <dl className="mt-2 flex flex-col gap-2 text-sm">
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

                <div className="flex flex-col items-end">
                  <div className="flex w-full items-center justify-between">
                    <dt>Taxa de rede</dt>
                    <dd>{formatEth(NETWORK_FEE, 3)}</dd>
                  </div>

                  <span className="mt-1 text-[10px] text-primary">
                    Taxa estimada
                  </span>
                </div>
              </dl>

              <div className="mt-2 flex items-center justify-between text-sm font-bold">
                <span>Total</span>

                <span className="text-primary">
                  {formatEth(total, 3)}
                </span>
              </div>

              <Button
                type="button"
                disabled={items.length === 0}
                className="mt-2 h-9 w-full bg-primary text-sm font-bold text-primary-foreground hover:bg-accent"
              >
                Conectar e finalizar
              </Button>

              <Button
                type="button"
                variant="link"
                className="text-xs text-primary hover:no-underline"
              >
                Continuar explorando
              </Button>
            </aside>
          </div>
        </div>

        {/* Recomendações */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-primary">
            Colecionadores também viram
          </h2>

          <Separator />

          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              slidesToScroll: 5,
            }}
            className="mt-4 w-full"
          >
            <CarouselContent className="-ml-3">
              {recommendations.map((nft) => (
                <CarouselItem
                  key={nft.id}
                  className="basis-1/2 pl-3 md:basis-1/3 lg:basis-1/5"
                >
                  <Card className="rounded-none border-0 bg-card p-0 ring-0">
                    <CardContent className="p-3">
                      <img
                        src={nft.gallery[0]}
                        alt={nft.name}
                        className="aspect-[4/5] w-full rounded-xl object-cover"
                      />
                    </CardContent>
                  </Card>

                  <div className="mt-3 flex flex-col gap-1.5">
                    <span className="text-xs">
                      {nft.name}
                    </span>

                    <span className="text-xs font-bold text-primary">
                      {formatEth(Number(nft.price))}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {slideCount > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: slideCount }).map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Ir para o slide ${index + 1}`}
                    aria-current={
                      index === currentSlide
                    }
                    onClick={() =>
                      carouselApi?.scrollTo(index)
                    }
                    className={`size-2.5 rounded-full border border-primary transition-colors ${
                      index === currentSlide
                        ? "bg-primary"
                        : "bg-transparent"
                    }`}
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};