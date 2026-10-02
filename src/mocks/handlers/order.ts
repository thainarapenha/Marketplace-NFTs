import { http, HttpResponse } from "msw";

import { addOrder, findOrderById } from "@/mocks/data/order";
import type { Order, OrderItem } from "@/types/order";
import type { WalletNetwork } from "@/types/wallet";

const NETWORKS: WalletNetwork[] = [
  "ethereum",
  "polygon",
  "arbitrum",
  "optimism",
  "base",
];

type CreateOrderInput = Omit<
  Order,
  "id" | "status" | "transactionReference" | "createdAt" | "updatedAt"
> & {
  transactionReference?: string | null;
};

const idempotentOrders = new Map<
  string,
  { content: string; order: Order }
>();

const errorResponse = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const isOrderItem = (value: unknown): value is OrderItem => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.nftId === "string" &&
    value.nftId.trim().length > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    (value.tokenId === undefined || typeof value.tokenId === "string") &&
    (value.image === undefined || typeof value.image === "string") &&
    Number.isInteger(value.quantity) &&
    Number(value.quantity) > 0 &&
    isFiniteNonNegativeNumber(value.unitPrice)
  );
};

const isCreateOrderInput = (value: unknown): value is CreateOrderInput => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(isOrderItem) &&
    isFiniteNonNegativeNumber(value.subtotal) &&
    isFiniteNonNegativeNumber(value.discount) &&
    isFiniteNonNegativeNumber(value.networkFee) &&
    isFiniteNonNegativeNumber(value.total) &&
    typeof value.wallet === "string" &&
    value.wallet.trim().length > 0 &&
    typeof value.network === "string" &&
    NETWORKS.includes(value.network as WalletNetwork) &&
    (value.transactionReference === undefined ||
      value.transactionReference === null ||
      typeof value.transactionReference === "string")
  );
};

const getRequestBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
};

const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (isRecord(value)) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortKeys(value[key]);
        return result;
      }, {});
  }

  return value;
};

const serializeContent = (value: CreateOrderInput) =>
  JSON.stringify(sortKeys(value));

export const orderHandlers = [
  http.post("/api/orders", async ({ request }) => {
    const idempotencyKey = request.headers.get("Idempotency-Key");
    const body = await getRequestBody(request);

    if (!isCreateOrderInput(body)) {
      return errorResponse(
        "INVALID_DATA",
        "Os dados do pedido são inválidos.",
        400,
      );
    }

    const content = serializeContent(body);

    if (idempotencyKey) {
      const previous = idempotentOrders.get(idempotencyKey);

      if (previous) {
        if (previous.content !== content) {
          return errorResponse(
            "IDEMPOTENCY_CONFLICT",
            "A chave de idempotência já foi usada com outro conteúdo.",
            409,
          );
        }

        return HttpResponse.json(previous.order);
      }
    }

    const now = new Date().toISOString();
    const order: Order = {
      id: crypto.randomUUID(),
      status: "pending",
      items: body.items.map((item) => ({ ...item })),
      subtotal: body.subtotal,
      discount: body.discount,
      networkFee: body.networkFee,
      total: body.total,
      wallet: body.wallet.trim(),
      network: body.network,
      transactionReference: body.transactionReference ?? null,
      createdAt: now,
      updatedAt: now,
    };

    addOrder(order);

    if (idempotencyKey) {
      idempotentOrders.set(idempotencyKey, { content, order });
    }

    return HttpResponse.json(order, { status: 201 });
  }),

  http.get("/api/orders/:id", ({ params }) => {
    const order = findOrderById(String(params.id));

    if (!order) {
      return errorResponse("ORDER_NOT_FOUND", "Pedido não encontrado.", 404);
    }

    return HttpResponse.json(order);
  }),
];
