import type { Order } from "@/types/order";
import { api } from "@/services/api";

export type CreateOrderPayload = Omit<
  Order,
  "id" | "status" | "transactionReference" | "createdAt" | "updatedAt"
>;

export const createOrder = async (
  payload: CreateOrderPayload,
  idempotencyKey: string,
) => {
  const response = await api.post<Order>("/orders", payload, {
    headers: { "Idempotency-Key": idempotencyKey },
  });

  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
};
