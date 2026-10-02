import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { OrderConfirmationModal } from "@/components/order/OrderConfirmationModal";
import { getOrder } from "@/services/order";

export const OrderScreen = () => {
  const { id } = useParams({ from: "/order/$id" });
  const orderQuery = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(id),
  });

  if (orderQuery.isPending) {
    return <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">Carregando confirmação...</main>;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return <main className="mx-auto max-w-[1200px] px-4 py-8 text-destructive md:px-6">Não foi possível carregar o pedido.</main>;
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
      <h1 className="text-2xl font-bold">Confirmação do pedido</h1>
      <OrderConfirmationModal open onOpenChange={() => undefined} order={orderQuery.data} />
    </main>
  );
};
