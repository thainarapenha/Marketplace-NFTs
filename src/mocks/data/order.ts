import type { Order } from "@/types/order";

const orders: Order[] = [];

export const findOrderById = (id: string) =>
  orders.find((order) => order.id === id);

export const addOrder = (order: Order) => {
  orders.push(order);
  return order;
};
