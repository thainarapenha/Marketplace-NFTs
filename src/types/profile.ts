export interface Profile {
  id: string;
  displayName: string;
  email: string;
  username: string;
  walletNickname: string;
  ensName: string;
  avatarUrl: string | null;
}

export type UpdateProfileInput = Omit<Profile, "id" | "avatarUrl">;

export type UpdateAvatarInput = {
  avatarUrl: string;
};
