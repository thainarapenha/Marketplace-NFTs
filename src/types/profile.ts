export interface Profile {
  id: string;
  displayName: string;
  email: string;
  username: string;
  walletNickname: string;
  ensName: string;
}

export type UpdateProfileInput = Omit<Profile, "id">;
