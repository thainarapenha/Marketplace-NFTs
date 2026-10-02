import type { Order } from "@/types/order";

const orders: Order[] = [];

export const findOrderById = (id: string) =>
  orders.find((order) => order.id === id);

export const addOrder = (order: Order) => {
  orders.push(order);
  return order;
};

export const updateOrder = (id: string, changes: Partial<Order>) => {
  const order = findOrderById(id);

  if (!order) {
    return undefined;
  }

  Object.assign(order, changes, { updatedAt: new Date().toISOString() });
  return order;
};
