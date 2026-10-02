import { http, HttpResponse } from "msw";

import {
  addSession,
  addUser,
  findSessionByToken,
  findUserById,
  findUserByLogin,
  findUserByEmail,
  findUserByUsername,
  updateUser,
  isSessionExpired,
  removeSession,
  toPublicUser,
} from "@/mocks/data/auth";
import type {
  LoginCredentials,
  RegisterCredentials,
  Session,
} from "@/types/auth";

const encoder = new TextEncoder();

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const hashPassword = async (password: string, salt: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`${salt}:${password}`),
  );

  return `${salt}:${toHex(new Uint8Array(digest))}`;
};

const createSession = (userId: string): Session => ({
  id: crypto.randomUUID(),
  token: crypto.randomUUID(),
  userId,
  createdAt: new Date().toISOString(),
});

const errorResponse = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status });

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("Authorization");

  return authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;
};

const getAuthenticatedUser = (request: Request) => {
  const token = getBearerToken(request);
  const session = token ? findSessionByToken(token) : undefined;
  return session && !isSessionExpired(session.token)
    ? findUserById(session.userId)
    : undefined;
};

const profileFromUser = (user: NonNullable<ReturnType<typeof findUserById>>) => ({
  id: user.id,
  displayName: user.displayName ?? user.username,
  email: user.email,
  username: user.username,
  walletNickname: user.walletNickname ?? "",
  ensName: user.ensName ?? "",
  avatarUrl: user.avatarUrl ?? null,
});

export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as Partial<RegisterCredentials>;

    if (
      !body.username?.trim() ||
      !body.email?.trim() ||
      !body.password
    ) {
      return errorResponse(
        "INVALID_DATA",
        "Nome de usuário, e-mail e senha são obrigatórios.",
        400,
      );
    }

    if (findUserByEmail(body.email) || findUserByUsername(body.username)) {
      return errorResponse(
        "USER_ALREADY_EXISTS",
        "E-mail ou nome de usuário já cadastrado.",
        409,
      );
    }

    const salt = crypto.randomUUID();
    const user = addUser({
      id: crypto.randomUUID(),
      username: body.username.trim(),
      email: body.email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(body.password, salt),
    });
    const session = addSession(createSession(user.id));

    return HttpResponse.json(
      { user: toPublicUser(user), session },
      { status: 201 },
    );
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as Partial<LoginCredentials>;

    if (!body.email || !body.password) {
      return errorResponse(
        "INVALID_DATA",
        "E-mail e senha são obrigatórios.",
        400,
      );
    }

    const user = findUserByLogin(body.email);

    if (!user) {
      return errorResponse(
        "INVALID_CREDENTIALS",
        "E-mail ou senha inválidos.",
        401,
      );
    }

    const salt = user.passwordHash.split(":")[0];
    const passwordHash = await hashPassword(body.password, salt);

    if (passwordHash !== user.passwordHash) {
      return errorResponse(
        "INVALID_CREDENTIALS",
        "E-mail ou senha inválidos.",
        401,
      );
    }

    const session = addSession(createSession(user.id));

    return HttpResponse.json({ user: toPublicUser(user), session });
  }),

  http.get("/api/auth/session", ({ request }) => {
    const token = getBearerToken(request);
    const session = token ? findSessionByToken(token) : undefined;

    if (!session || isSessionExpired(session.token)) {
      return errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);
    }

    const user = findUserById(session.userId);

    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);
    }

    return HttpResponse.json({ user: toPublicUser(user), session });
  }),

  http.post("/api/auth/logout", ({ request }) => {
    const token = getBearerToken(request);
    const session = token ? findSessionByToken(token) : undefined;

    if (session) {
      removeSession(session);
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/profile", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);
    }

    return HttpResponse.json(profileFromUser(user));
  }),

  http.patch("/api/profile", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);
    }

    const body = (await request.json()) as Partial<{
      displayName: string;
      email: string;
      username: string;
      walletNickname: string;
      ensName: string;
    }>;
    const displayName = body.displayName?.trim();
    const email = body.email?.trim().toLowerCase();
    const username = body.username?.trim();

    if (!displayName || !email || !username) {
      return errorResponse(
        "INVALID_DATA",
        "Nome de exibição, e-mail e nome de usuário são obrigatórios.",
        400,
      );
    }

    const emailOwner = findUserByEmail(email);
    const usernameOwner = findUserByUsername(username);

    if ((emailOwner && emailOwner.id !== user.id) || (usernameOwner && usernameOwner.id !== user.id)) {
      return errorResponse("PROFILE_ALREADY_EXISTS", "E-mail ou nome de usuário já cadastrado.", 409);
    }

    updateUser(user, {
      displayName,
      email,
      username,
      walletNickname: body.walletNickname?.trim() ?? "",
      ensName: body.ensName?.trim() ?? "",
    });

    return HttpResponse.json(profileFromUser(user));
  }),

  http.patch("/api/profile/avatar", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);
    }

    const body = (await request.json()) as { avatarUrl?: string };

    if (!body.avatarUrl?.startsWith("data:image/")) {
      return errorResponse("INVALID_DATA", "Selecione uma imagem válida.", 400);
    }

    updateUser(user, { avatarUrl: body.avatarUrl });

    return HttpResponse.json(profileFromUser(user));
  }),

  http.delete("/api/profile/avatar", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return errorResponse("UNAUTHENTICATED", "Sessão não encontrada.", 401);
    }

    updateUser(user, { avatarUrl: null });

    return HttpResponse.json(profileFromUser(user));
  }),
];
