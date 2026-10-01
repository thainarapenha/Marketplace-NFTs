import axios from "axios";

import type { Nft } from "@/types/nft";

const api = axios.create({
  baseURL: "/api",
});

export const getNfts = async (): Promise<Nft[]> => {
  const response = await api.get<Nft[]>("/nfts");

  return response.data;
};

export const getNftById = async (id: string): Promise<Nft> => {
  const response = await api.get<Nft>(`/nfts/${id}`);

  return response.data;
};