import type { Nft } from "@/types/nft";

const img = (id: number) => `/images/nft-${id}.jpg`;

export const nfts: Nft[] = [
  {
    id: "1",
    name: "Emerald Ape #001",
    collection: "Kurio Apes",
    price: "0.99 ETH",
    gallery: [img(1), img(1), img(1), img(1)],
    description:
      "Um colecionável digital finalizado à mão da coleção Kurio Apes, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",
    editions: ["1/50", "1/100", "1/250"],
    defaultEdition: "1/50",
    reviews: 19,
    attributes: ["Óculos", "Esmeralda", "Raro"],
    details: [
      {
        label: "ID do token",
        text: "#0001",
      },
      {
        label: "Coleção",
        text: "Kurio Apes",
      },
      {
        label: "Atributos",
        text: "Óculos, Esmeralda, Raro",
      },
    ],
    fullDescription: [
      "Emerald Ape #001 é uma obra digital 1/50 finalizada à mão da coleção Kurio Apes. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum.",
      "A propriedade inclui arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede.",
    ],
    features: [
      {
        letter: "A",
        title: "Arte exclusiva",
        text: "Obras digitais produzidas para colecionadores.",
      },
      {
        letter: "B",
        title: "Autenticidade",
        text: "Registro e procedência vinculados ao token.",
      },
      {
        letter: "C",
        title: "Colecionável",
        text: "Itens digitais exclusivos para sua coleção.",
      },
    ],
    relatedIds: ["2", "3", "4", "5"],
  },

  {
    id: "2",
    name: "Cosmic Bloom #002",
    collection: "Kurio Editions",
    price: "1.29 ETH",
    gallery: [img(2), img(2), img(2), img(2)],
    description:
      "Uma composição digital inspirada em formas orgânicas e ambientes cósmicos, criada para a coleção Kurio Editions.",
    editions: ["1/25", "1/50", "1/100"],
    defaultEdition: "1/50",
    reviews: 14,
    attributes: ["Cosmic", "Floral", "Premium"],
    details: [
      {
        label: "ID do token",
        text: "#0002",
      },
      {
        label: "Coleção",
        text: "Kurio Editions",
      },
      {
        label: "Atributos",
        text: "Cosmic, Floral, Premium",
      },
    ],
    fullDescription: [
      "Cosmic Bloom #002 combina formas orgânicas e elementos cósmicos em uma composição digital criada para a coleção Kurio Editions.",
      "A obra possui registro digital de procedência e acesso à versão em alta resolução para colecionadores.",
    ],
    features: [
      {
        letter: "A",
        title: "Arte exclusiva",
        text: "Obras digitais produzidas para colecionadores.",
      },
      {
        letter: "B",
        title: "Autenticidade",
        text: "Registro e procedência vinculados ao token.",
      },
      {
        letter: "C",
        title: "Colecionável",
        text: "Itens digitais exclusivos para sua coleção.",
      },
    ],
    relatedIds: ["1", "3", "4", "5"],
  },

  {
    id: "3",
    name: "Violet Nomad #003",
    collection: "Nomad Series",
    price: "1.39 ETH",
    gallery: [img(3), img(3), img(3), img(3)],
    description:
      "Uma peça digital da Nomad Series que explora identidade, movimento e descoberta em ambientes digitais.",
    editions: ["1/25", "1/75", "1/150"],
    defaultEdition: "1/75",
    reviews: 22,
    attributes: ["Violeta", "Nomad", "Explorer"],
    details: [
      {
        label: "ID do token",
        text: "#0003",
      },
      {
        label: "Coleção",
        text: "Nomad Series",
      },
      {
        label: "Atributos",
        text: "Violeta, Nomad, Explorer",
      },
    ],
    fullDescription: [
      "Violet Nomad #003 é uma obra digital da Nomad Series dedicada à exploração de identidade e movimento em ambientes digitais.",
      "A peça foi criada para integrar uma coleção de obras independentes com registro permanente de procedência.",
    ],
    features: [
      {
        letter: "A",
        title: "Arte exclusiva",
        text: "Obras digitais produzidas para colecionadores.",
      },
      {
        letter: "B",
        title: "Autenticidade",
        text: "Registro e procedência vinculados ao token.",
      },
      {
        letter: "C",
        title: "Colecionável",
        text: "Itens digitais exclusivos para sua coleção.",
      },
    ],
    relatedIds: ["1", "2", "4", "5"],
  },

  {
    id: "4",
    name: "Ivory Baron #004",
    collection: "Ivory Collection",
    price: "1.79 ETH",
    gallery: [img(4), img(4), img(4), img(4)],
    description:
      "Um colecionável digital de edição limitada inspirado em estética clássica e elementos contemporâneos.",
    editions: ["1/10", "1/25", "1/50"],
    defaultEdition: "1/25",
    reviews: 31,
    attributes: ["Ivory", "Classic", "Limited"],
    details: [
      {
        label: "ID do token",
        text: "#0004",
      },
      {
        label: "Coleção",
        text: "Ivory Collection",
      },
      {
        label: "Atributos",
        text: "Ivory, Classic, Limited",
      },
    ],
    fullDescription: [
      "Ivory Baron #004 apresenta uma composição digital de edição limitada que combina referências clássicas com elementos contemporâneos.",
      "A edição foi desenvolvida para colecionadores que buscam peças com tiragem reduzida e identidade visual marcante.",
    ],
    features: [
      {
        letter: "A",
        title: "Arte exclusiva",
        text: "Obras digitais produzidas para colecionadores.",
      },
      {
        letter: "B",
        title: "Autenticidade",
        text: "Registro e procedência vinculados ao token.",
      },
      {
        letter: "C",
        title: "Colecionável",
        text: "Itens digitais exclusivos para sua coleção.",
      },
    ],
    relatedIds: ["1", "2", "3", "5"],
  },

  {
    id: "5",
    name: "Golden Beat #005",
    collection: "Golden Series",
    price: "0.99 ETH",
    gallery: [img(5), img(5), img(5), img(5)],
    description:
      "Uma obra digital vibrante da Golden Series que combina ritmo, cor e elementos gráficos contemporâneos.",
    editions: ["1/50", "1/100", "1/200"],
    defaultEdition: "1/100",
    reviews: 17,
    attributes: ["Golden", "Beat", "Dynamic"],
    details: [
      {
        label: "ID do token",
        text: "#0005",
      },
      {
        label: "Coleção",
        text: "Golden Series",
      },
      {
        label: "Atributos",
        text: "Golden, Beat, Dynamic",
      },
    ],
    fullDescription: [
      "Golden Beat #005 é uma obra digital vibrante que combina ritmo, cor e elementos gráficos contemporâneos.",
      "A peça integra a Golden Series e possui diferentes edições disponíveis para colecionadores.",
    ],
    features: [
      {
        letter: "A",
        title: "Arte exclusiva",
        text: "Obras digitais produzidas para colecionadores.",
      },
      {
        letter: "B",
        title: "Autenticidade",
        text: "Registro e procedência vinculados ao token.",
      },
      {
        letter: "C",
        title: "Colecionável",
        text: "Itens digitais exclusivos para sua coleção.",
      },
    ],
    relatedIds: ["1", "2", "3", "4"],
  },
];