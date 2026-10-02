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
  <div className="flex min-w-0 flex-col px-4 first:pl-0 last:pr-0">
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
        className="max-h-[calc(100vh-4rem)] max-w-[578px] gap-0 overflow-y-auto overflow-x-hidden rounded-none border-0 bg-card p-0 font-mono sm:max-w-[578px] [&>button]:text-primary"
      >
        <DialogTitle className="sr-only">Pedido confirmado</DialogTitle>

        <DialogDescription className="sr-only">
          Resumo da transação e dos NFTs adquiridos.
        </DialogDescription>

        <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-6">
          <ThankYouIcon className="size-20 text-primary" />

          <p className="text-center text-base font-bold text-primary">
            Seus NFTs agora estão na sua carteira
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 divide-x divide-primary/60 border-y border-primary/60 px-9 py-3 md:grid-cols-4 [&>*:nth-child(odd)]:border-l-0">
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

        <div className="flex flex-col gap-3 px-9 pt-5">
          <h3 className="text-sm">Detalhes da transação</h3>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="h-8 px-0 text-sm font-normal text-foreground">
                  NFTs
                </TableHead>

                <TableHead className="h-8 text-center text-sm font-normal text-foreground">
                  Edições
                </TableHead>

                <TableHead className="h-8 px-0 text-right text-sm font-normal text-foreground">
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
                  <TableCell className="px-0 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-[70px] rounded-md after:rounded-md">
                        <AvatarImage
                          src={item.image}
                          alt={item.name}
                          className="rounded-md object-cover"
                        />

                        <AvatarFallback className="rounded-md">
                          {item.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="text-sm font-bold">
                          {item.name}
                        </span>

                        <span className="text-xs text-primary/70">
                          Edição: {item.tokenId ?? "—"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-sm text-primary/80">
                    (x {item.quantity})
                  </TableCell>

                  <TableCell className="px-0 text-right text-base font-bold text-primary">
                    {formatEth(item.unitPrice * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <dl className="flex flex-col gap-1.5">
            <div className="flex items-center justify-end gap-12">
              <dt className="text-sm">Subtotal</dt>

              <dd className="min-w-[110px] text-right">
                {formatEth(order.subtotal)}
              </dd>
            </div>

            <div className="flex items-center justify-end gap-12">
              <dt className="text-sm">Desconto</dt>

              <dd className="min-w-[110px] text-right">
                -{formatEth(order.discount)}
              </dd>
            </div>

            <div className="flex items-center justify-end gap-12">
              <dt className="text-sm">Taxa de rede</dt>

              <dd className="min-w-[110px] text-right">
                {formatEth(order.networkFee, 3)}
              </dd>
            </div>

            <div className="flex items-center justify-end gap-12">
              <dt className="text-sm font-bold">Total</dt>

              <dd className="min-w-[110px] text-right text-base font-bold text-primary">
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
                "mx-auto mb-6 mt-1 h-12 rounded-md bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-accent",
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