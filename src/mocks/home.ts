export const img = (n: number) => `/images/nft-${n}.jpg`;

export const collections: readonly [string, number][] = [
  ["Arte digital", 33],
  ["Fotografia", 12],
  ["Música", 65],
  ["Arte 3D", 39],
  ["Colecionáveis", 23],
  ["Generativa", 17],
  ["Jogos", 19],
  ["Assinaturas", 13],
  ["Utilidade", 18],
];

export const networks: readonly [string, number][] = [
  ["Ethereum", 119],
  ["Polygon", 78],
  ["Solana", 86],
];

export interface Nft {
  name: string;
  price: string;
  old?: string;
  img: string;
}

export const nfts: Nft[] = [
  {
    name: "Emerald Ape #042",
    price: "1.19 ETH",
    img: img(1),
  },
  {
    name: "Sage Nomad #009",
    price: "1.69 ETH",
    img: img(2),
  },
  {
    name: "Neon Vessel #552",
    price: "1.99 ETH",
    old: "2.29 ETH",
    img: img(3),
  },
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
    name: "Golden Beat #287",
    price: "0.99 ETH",
    img: img(4),
  },
  {
    name: "Golden Signal #160",
    price: "0.39 ETH",
    img: img(4),
  },
  {
    name: "Golden Pulse #201",
    price: "0.59 ETH",
    img: img(4),
  },
];

export interface Banner {
  title: string;
  text: string;
  img: string;
}

export const banners: Banner[] = [
  {
    title: "Lançamentos gênesis de edição limitada",
    text: "Colecione edições escassas diretamente dos criadores antes da revelação pública.",
    img: img(1),
  },
  {
    title: "Arte digital selecionada e muito mais",
    text: "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.",
    img: img(3),
  },
];

export interface Post {
  date: string;
  read: string;
  title: string;
  text: string;
  img: string;
}

export const posts: Post[] = [
  {
    date: "12 de setembro",
    read: "6 min",
    title: "Como funciona a propriedade de NFTs",
    text: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    img: img(3),
  },
  {
    date: "13 de setembro",
    read: "2 min",
    title: "10 artistas digitais para acompanhar",
    text: "Conheça criadores que moldam a cultura digital na rede.",
    img: img(1),
  },
  {
    date: "15 de setembro",
    read: "3 min",
    title: "Raridade, atributos e procedência",
    text: "Entenda raridade, procedência, direitos autorais e utilidade.",
    img: img(2),
  },
  {
    date: "15 de setembro",
    read: "2 min",
    title: "Como proteger sua carteira",
    text: "Proteja sua carteira, seus ativos e sua identidade.",
    img: img(4),
  },
];

export interface Feature {
  letter: string;
  title: string;
  text: string;
}

export const features: Feature[] = [
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
];