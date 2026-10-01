import type { Session, User } from "@/types/auth";

interface StoredUser extends User {
  passwordHash: string;
}

const users: StoredUser[] = [];
const sessions: Session[] = [];

const STORAGE_KEY = "marketplace-auth-mock-state";

try {
  const storedState = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "null",
  ) as { users?: StoredUser[]; sessions?: Session[] } | null;

  if (storedState) {
    users.push(...(storedState.users ?? []));
    sessions.push(...(storedState.sessions ?? []));
  }
} catch {
  // The mock starts empty when browser storage is unavailable or invalid.
}

const persistState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, sessions }));
  } catch {
    // Persistence is best effort for the browser mock.
  }
};

export const findUserByEmail = (email: string) =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const findUserByUsername = (username: string) =>
  users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );

export const findUserById = (id: string) =>
  users.find((user) => user.id === id);

export const findUserByLogin = (login: string) =>
  findUserByEmail(login) ?? findUserByUsername(login);

export const addUser = (user: StoredUser) => {
  users.push(user);
  persistState();
  return user;
};

export const findSessionByToken = (token: string) =>
  sessions.find((session) => session.token === token);

export const addSession = (session: Session) => {
  sessions.push(session);
  persistState();
  return session;
};

export const removeSession = (session: Session) => {
  const index = sessions.indexOf(session);

  if (index >= 0) {
    sessions.splice(index, 1);
    persistState();
  }
};

export const toPublicUser = ({ passwordHash: _, ...user }: StoredUser): User =>
  user;
