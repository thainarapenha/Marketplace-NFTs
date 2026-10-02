import nft1 from "@/assets/nfts/nft-1.svg";
import nft2 from "@/assets/nfts/nft-2.svg";
import nft3 from "@/assets/nfts/nft-3.svg";
import nft4 from "@/assets/nfts/nft-4.svg";
import type { Nft } from "@/types/nft";

const nftImages = [nft1, nft2, nft3, nft4];

const createNft = ({
  id,
  name,
  collection,
  price,
  attributes,
  description,
}: {
  id: number;
  name: string;
  collection: string;
  price: string;
  attributes: string[];
  description: string;
}): Nft => ({
  id: String(id),
  name,
  collection,
  price,
  gallery: (() => {
    const image = nftImages[(id - 1) % nftImages.length];
    return [image, image, image, image];
  })(),
  description,
  editions: ["1/25", "1/50", "1/100"],
  defaultEdition: "1/50",
  reviews: 10 + id,
  attributes,
  details: [
    {
      label: "ID do token",
      text: `#${String(id).padStart(4, "0")}`,
    },
    {
      label: "Coleção",
      text: collection,
    },
    {
      label: "Atributos",
      text: attributes.join(", "),
    },
  ],
  fullDescription: [
    `${name} é uma obra digital da coleção ${collection}, criada para colecionadores e registrada como um ativo digital exclusivo.`,
    "A peça possui diferentes edições disponíveis e registro de procedência associado ao token.",
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
  relatedIds: [],
});

export const nfts: Nft[] = [
  createNft({
    id: 1,
    name: "Emerald Ape #001",
    collection: "Kurio Apes",
    price: "0.99 ETH",
    attributes: ["Óculos", "Esmeralda", "Raro"],
    description:
      "Um colecionável digital da coleção Kurio Apes, com arte exclusiva e edição limitada.",
  }),

  createNft({
    id: 2,
    name: "Cosmic Bloom #002",
    collection: "Kurio Editions",
    price: "1.29 ETH",
    attributes: ["Cosmic", "Floral", "Premium"],
    description:
      "Uma composição digital inspirada em formas orgânicas e ambientes cósmicos.",
  }),

  createNft({
    id: 3,
    name: "Violet Nomad #003",
    collection: "Nomad Series",
    price: "1.39 ETH",
    attributes: ["Violeta", "Nomad", "Explorer"],
    description:
      "Uma peça digital que explora identidade, movimento e descoberta.",
  }),

  createNft({
    id: 4,
    name: "Ivory Baron #004",
    collection: "Ivory Collection",
    price: "1.79 ETH",
    attributes: ["Ivory", "Classic", "Limited"],
    description:
      "Um colecionável digital de edição limitada inspirado em estética clássica.",
  }),

  createNft({
    id: 5,
    name: "Golden Beat #005",
    collection: "Golden Series",
    price: "0.99 ETH",
    attributes: ["Golden", "Beat", "Dynamic"],
    description:
      "Uma obra digital vibrante que combina ritmo, cor e elementos gráficos.",
  }),

  createNft({
    id: 6,
    name: "Neon Oracle #006",
    collection: "Future Icons",
    price: "2.10 ETH",
    attributes: ["Neon", "Oracle", "Rare"],
    description:
      "Uma peça futurista inspirada em interfaces digitais e estética neon.",
  }),

  createNft({
    id: 7,
    name: "Azure Dream #007",
    collection: "Dreamscape",
    price: "0.75 ETH",
    attributes: ["Azure", "Dream", "Blue"],
    description:
      "Uma composição digital baseada em formas abstratas e atmosferas oníricas.",
  }),

  createNft({
    id: 8,
    name: "Crimson Fox #008",
    collection: "Wild Digital",
    price: "1.55 ETH",
    attributes: ["Crimson", "Fox", "Wild"],
    description:
      "Um colecionável inspirado em animais e estética digital contemporânea.",
  }),

  createNft({
    id: 9,
    name: "Solar Child #009",
    collection: "Solar Series",
    price: "2.49 ETH",
    attributes: ["Solar", "Gold", "Rare"],
    description:
      "Uma obra digital inspirada em luz, energia e formas solares.",
  }),

  createNft({
    id: 10,
    name: "Digital Monk #010",
    collection: "Digital Souls",
    price: "1.15 ETH",
    attributes: ["Monk", "Minimal", "Soul"],
    description:
      "Uma representação digital minimalista focada em identidade e contemplação.",
  }),

  createNft({
    id: 11,
    name: "Pink Mirage #011",
    collection: "Dreamscape",
    price: "0.89 ETH",
    attributes: ["Pink", "Mirage", "Soft"],
    description:
      "Uma composição abstrata baseada em cores suaves e formas fluidas.",
  }),

  createNft({
    id: 12,
    name: "Obsidian King #012",
    collection: "Royal Digital",
    price: "3.20 ETH",
    attributes: ["Obsidian", "King", "Rare"],
    description:
      "Uma peça de edição limitada com estética sombria e elementos premium.",
  }),

  createNft({
    id: 13,
    name: "Electric Mind #013",
    collection: "Future Icons",
    price: "1.65 ETH",
    attributes: ["Electric", "Mind", "Cyber"],
    description:
      "Uma obra digital inspirada em tecnologia, inteligência e cultura cyber.",
  }),

  createNft({
    id: 14,
    name: "Forest Spirit #014",
    collection: "Nature Digital",
    price: "0.69 ETH",
    attributes: ["Forest", "Spirit", "Nature"],
    description:
      "Uma representação digital inspirada em elementos naturais e ambientes florestais.",
  }),

  createNft({
    id: 15,
    name: "Platinum Rider #015",
    collection: "Velocity",
    price: "2.75 ETH",
    attributes: ["Platinum", "Rider", "Velocity"],
    description:
      "Uma peça digital inspirada em velocidade, movimento e estética futurista.",
  }),

  createNft({
    id: 16,
    name: "Purple Genesis #016",
    collection: "Genesis Collection",
    price: "1.95 ETH",
    attributes: ["Purple", "Genesis", "Premium"],
    description:
      "Uma obra digital premium criada para representar novos começos no universo digital.",
  }),
];

nfts.forEach((nft) => {
  nft.relatedIds = nfts
    .filter((related) => related.id !== nft.id)
    .slice(0, 4)
    .map((related) => related.id);
});
