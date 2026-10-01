import type { Session, User } from "@/types/auth";

interface StoredUser extends User {
  passwordHash: string;
}

const users: StoredUser[] = [];
const sessions: Session[] = [];

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
  return user;
};

export const findSessionByToken = (token: string) =>
  sessions.find((session) => session.token === token);

export const addSession = (session: Session) => {
  sessions.push(session);
  return session;
};

export const removeSession = (session: Session) => {
  const index = sessions.indexOf(session);

  if (index >= 0) {
    sessions.splice(index, 1);
  }
};

export const toPublicUser = ({ passwordHash: _, ...user }: StoredUser): User =>
  user;
