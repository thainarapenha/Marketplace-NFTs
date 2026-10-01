const img = (n: number) => `/images/nft-${n}.jpg`;

export const nftMock = {
  id: "0042",
  name: "Emerald Ape #042",
  price: "1.19 ETH",
  rating: 5,
  reviews: 19,

  gallery: [img(1), img(1), img(1), img(1)],

  description:
    "Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",

  editions: ["1/1", "1/10", "1/50", "ABERTA"],

  defaultEdition: "1/50",

  collection: "Kurio Apes",

  attributes: ["Óculos", "Esmeralda", "Raro"],

  network: {
    label: "Rede",
    text: "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.",
  },

  contract: {
    label: "Contrato",
    text: "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
  },

  royalties: {
    label: "Direitos autorais",
    text: "0x7A42...19E8 • Contrato inteligente ERC-721 verificado.",
  },

  details: [
    {
      label: "Rede",
      text: "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.",
    },
    {
      label: "Contrato",
      text: "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
    },
    {
      label: "Direitos autorais",
      text: "0x7A42...19E8 • Contrato inteligente ERC-721 verificado.",
    },
  ],

  fullDescription: [
    "Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.",
    "A propriedade inclui arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.",
  ],

  related: [
    {
      name: "Cosmic Bloom #118",
      price: "1.29 ETH",
      img: img(2),
    },
    {
      name: "Violet Nomad #314",
      price: "1.39 ETH",
      img: img(2),
    },
    {
      name: "Ivory Baron #088",
      price: "1.79 ETH",
      img: img(3),
    },
    {
      name: "Golden Beat #207",
      price: "0.99 ETH",
      img: img(4),
    },
    {
      name: "Golden Signal #160",
      price: "0.39 ETH",
      img: img(4),
    },
  ],

  features: [
    {
      letter: "W",
      title: "Segurança da carteira",
      text: "Proteja sua carteira e colecione arte digital verificada com confiança.",
    },
    {
      letter: "C",
      title: "Criadores em destaque",
      text: "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
    },
    {
      letter: "D",
      title: "Alertas de lançamentos",
      text: "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
    },
  ],
};