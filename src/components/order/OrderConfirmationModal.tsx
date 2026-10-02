import { useNavigate } from "@tanstack/react-router";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/types/order";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThankYouIcon } from "./ThankYouIcon";

type OrderConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
};

const formatEth = (value: number, decimals = 2) =>
  `${value.toFixed(decimals)} ETH`;

const shortenId = (id: string) =>
  id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));

const SummaryCell = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex min-w-0 flex-col px-2 first:pl-0 last:pr-0 sm:px-4">
    <span className={cn("text-sm", bold && "font-bold")}>{label}</span>
    <span className="truncate text-sm text-primary/80">{value}</span>
  </div>
);

export const OrderConfirmationModal = ({
  open,
  onOpenChange,
  order,
}: OrderConfirmationModalProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
    navigate({ to: "/" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="w-[calc(100%-2rem)] max-h-[calc(100vh-4rem)] max-w-[578px] gap-0 overflow-y-auto overflow-x-hidden rounded-none border-0 bg-card p-0 font-mono sm:max-w-[578px] [&>button]:text-primary"
      >
        <DialogTitle className="sr-only">Pedido confirmado</DialogTitle>

        <DialogDescription className="sr-only">
          Resumo da transação e dos NFTs adquiridos.
        </DialogDescription>

        <div className="flex flex-col items-center gap-3 px-4 pb-4 pt-4 sm:gap-4 sm:px-6 sm:pb-6 sm:pt-6">
          <ThankYouIcon className="size-16 text-primary sm:size-20" />

          <p className="text-center text-base font-bold text-primary">
            Seus NFTs agora estão na sua carteira
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 divide-x divide-primary/60 border-y border-primary/60 px-4 py-2.5 sm:gap-y-3 sm:px-9 sm:py-3 md:grid-cols-4 [&>*:nth-child(odd)]:border-l-0">
          <SummaryCell
            label="ID do pedido"
            value={shortenId(order.id)}
            bold
          />

          <SummaryCell
            label="Data"
            value={formatDate(order.createdAt)}
          />

          <SummaryCell
            label="Total"
            value={formatEth(order.total, 3)}
          />

          <SummaryCell
            label="Carteira"
            value={shortenId(order.wallet)}
            bold
          />
        </div>

        <div className="flex flex-col gap-2.5 px-4 pt-4 sm:gap-3 sm:px-9 sm:pt-5">
          <h3 className="text-sm">Detalhes da transação</h3>

          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="h-8 px-0 text-xs font-normal text-foreground sm:text-sm">
                  NFTs
                </TableHead>

                <TableHead className="h-8 w-[4.5rem] px-1 text-center text-xs font-normal text-foreground sm:w-auto sm:px-2 sm:text-sm">
                  Edições
                </TableHead>

                <TableHead className="h-8 w-[5.75rem] px-0 text-right text-xs font-normal text-foreground sm:w-auto sm:text-sm">
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {order.items.map((item) => (
                <TableRow
                  key={item.nftId}
                  className="border-0 hover:bg-transparent"
                >
                  <TableCell className="max-w-0 px-0 py-2.5 sm:py-3">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <Avatar className="size-14 shrink-0 rounded-md after:rounded-md sm:size-[70px]">
                        <AvatarImage
                          src={item.image}
                          alt={item.name}
                          className="rounded-md object-cover"
                        />

                        <AvatarFallback className="rounded-md">
                          {item.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold sm:text-sm">
                          {item.name}
                        </span>

                        <span className="block truncate text-[0.6875rem] text-primary/70 sm:text-xs">
                          Edição: {item.tokenId ?? "—"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-1 text-center text-xs text-primary/80 sm:px-2 sm:text-sm">
                    (x {item.quantity})
                  </TableCell>

                  <TableCell className="px-0 text-right text-sm font-bold text-primary sm:text-base">
                    {formatEth(item.unitPrice * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <dl className="flex flex-col gap-1.5">
            <div className="flex items-center justify-end gap-4 sm:gap-12">
              <dt className="text-sm">Subtotal</dt>

              <dd className="min-w-[96px] text-right sm:min-w-[110px]">
                {formatEth(order.subtotal)}
              </dd>
            </div>

            <div className="flex items-center justify-end gap-4 sm:gap-12">
              <dt className="text-sm">Desconto</dt>

              <dd className="min-w-[96px] text-right sm:min-w-[110px]">
                -{formatEth(order.discount)}
              </dd>
            </div>

            <div className="flex items-center justify-end gap-4 sm:gap-12">
              <dt className="text-sm">Taxa de rede</dt>

              <dd className="min-w-[96px] text-right sm:min-w-[110px]">
                {formatEth(order.networkFee, 3)}
              </dd>
            </div>

            <div className="flex items-center justify-end gap-4 sm:gap-12">
              <dt className="text-sm font-bold">Total</dt>

              <dd className="min-w-[96px] text-right text-base font-bold text-primary sm:min-w-[110px]">
                {formatEth(order.total, 3)}
              </dd>
            </div>
          </dl>

          <Separator className="bg-primary/40" />

          <p className="text-center text-sm leading-relaxed text-primary/80">
            Transação confirmada na rede {order.network}.
          </p>

          {order.transactionReference ? (
            <button
              type="button"
              className={cn(
                buttonVariants(),
                "mx-auto mb-4 mt-0 h-11 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-accent sm:mb-6 sm:mt-1 sm:h-12 sm:px-8",
              )}
            >
              Ver transação
            </button>
          ) : null}
        </div>

        <div className="h-2 w-full bg-primary" />
      </DialogContent>
    </Dialog>
  );
};
