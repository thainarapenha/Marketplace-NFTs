import { http, HttpResponse } from "msw";

import { nfts } from "@/mocks/data/nft";

export const nftHandlers = [
  http.get("/api/nfts", () => {
    return HttpResponse.json(nfts);
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nfts.find((item) => item.id === params.id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrada" },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),
];