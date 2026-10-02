import { http, HttpResponse } from "msw";

import {
  addWallet,
  findWalletByAddressAndNetwork,
  findWalletById,
  findWalletsByUserId,
  updateWallet,
} from "@/mocks/data/wallet";
import {
  findSessionByToken,
  findUserById,
  isSessionExpired,
} from "@/mocks/data/auth";
import type {
  CreateWalletInput,
  UpdateWalletInput,
  Wallet,
  WalletKind,
  WalletNetwork,
  WalletType,
} from "@/types/wallet";

const NETWORKS: WalletNetwork[] = [
  "ethereum",
  "polygon",
  "arbitrum",
  "optimism",
  "base",
];
const TYPES: WalletType[] = ["hot", "cold", "custodial"];
const KINDS: WalletKind[] = ["primary", "secondary"];

const errorResponse = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status });

const getAuthenticatedUserId = (request: Request) => {
  const authorization = request.headers.get("Authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;
  const session = token ? findSessionByToken(token) : undefined;

  if (!session || isSessionExpired(session.token)) {
    return undefined;
  }

  return findUserById(session.userId)?.id;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isWalletNetwork = (value: unknown): value is WalletNetwork =>
  typeof value === "string" && NETWORKS.includes(value as WalletNetwork);

const isWalletType = (value: unknown): value is WalletType =>
  typeof value === "string" && TYPES.includes(value as WalletType);

const isWalletKind = (value: unknown): value is WalletKind =>
  typeof value === "string" && KINDS.includes(value as WalletKind);

const hasOnlyWalletFields = (body: Record<string, unknown>) =>
  Object.keys(body).every((key) =>
    ["address", "network", "type", "kind"].includes(key),
  );

const isCreateWalletInput = (
  body: unknown,
): body is CreateWalletInput => {
  if (!isRecord(body) || !hasOnlyWalletFields(body)) {
    return false;
  }

  return (
    typeof body.address === "string" &&
    body.address.trim().length > 0 &&
    isWalletNetwork(body.network) &&
    isWalletType(body.type) &&
    isWalletKind(body.kind)
  );
};

const isUpdateWalletInput = (
  body: unknown,
): body is UpdateWalletInput => {
  if (!isRecord(body) || !hasOnlyWalletFields(body)) {
    return false;
  }

  const fields = Object.keys(body);

  return (
    fields.length > 0 &&
    (body.address === undefined ||
      (typeof body.address === "string" && body.address.trim().length > 0)) &&
    (body.network === undefined || isWalletNetwork(body.network)) &&
    (body.type === undefined || isWalletType(body.type)) &&
    (body.kind === undefined || isWalletKind(body.kind))
  );
};

const getRequestBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
};

const unauthenticated = () =>
  errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);

export const walletHandlers = [
  http.get("/api/wallets", ({ request }) => {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return unauthenticated();
    }

    return HttpResponse.json(findWalletsByUserId(userId));
  }),

  http.post("/api/wallets", async ({ request }) => {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return unauthenticated();
    }

    const body = await getRequestBody(request);

    if (!isCreateWalletInput(body)) {
      return errorResponse(
        "INVALID_DATA",
        "Endereço, rede, tipo e finalidade da carteira são obrigatórios e válidos.",
        400,
      );
    }

    const address = body.address.trim();

    if (findWalletByAddressAndNetwork(userId, address, body.network)) {
      return errorResponse(
        "WALLET_ALREADY_EXISTS",
        "Esta carteira já está cadastrada para o usuário.",
        409,
      );
    }

    const wallet: Wallet = {
      id: crypto.randomUUID(),
      userId,
      address,
      network: body.network,
      type: body.type,
      kind: body.kind,
    };

    return HttpResponse.json(addWallet(wallet), { status: 201 });
  }),

  http.patch("/api/wallets/:id", async ({ params, request }) => {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return unauthenticated();
    }

    const wallet = findWalletById(String(params.id));

    if (!wallet || wallet.userId !== userId) {
      return errorResponse("WALLET_NOT_FOUND", "Carteira não encontrada.", 404);
    }

    const body = await getRequestBody(request);

    if (!isUpdateWalletInput(body)) {
      return errorResponse(
        "INVALID_DATA",
        "Informe pelo menos um campo válido para atualizar a carteira.",
        400,
      );
    }

    const address = body.address?.trim() ?? wallet.address;
    const network = body.network ?? wallet.network;

    if (findWalletByAddressAndNetwork(userId, address, network, wallet.id)) {
      return errorResponse(
        "WALLET_ALREADY_EXISTS",
        "Esta carteira já está cadastrada para o usuário.",
        409,
      );
    }

    return HttpResponse.json(
      updateWallet(wallet, {
        ...body,
        address,
        userId: wallet.userId,
      }),
    );
  }),
];
