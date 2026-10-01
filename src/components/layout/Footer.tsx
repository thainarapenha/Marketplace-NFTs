import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const footerColumns = [
  {
    title: "Meu perfil",
    links: [
      "Meu perfil",
      "Minha coleção",
      "Atividade",
      "Estúdio do criador",
      "Lista de interesse",
    ],
  },
  {
    title: "Central de ajuda",
    links: [
      "Central de ajuda",
      "Como comprar NFTs",
      "Carteira e segurança",
      "Política do mercado",
      "Denunciar item",
    ],
  },
  {
    title: "Coleções",
    links: ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"],
  },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1200px] px-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary px-6 py-4 text-xs">
        <span className="font-bold">KURIO</span>

        <span className="text-muted-foreground">
          Feito para colecionadores, criadores e cultura
        </span>

        <span className="text-muted-foreground">contato@email.com</span>

        <span className="text-muted-foreground">+55 11 4002 8922</span>
      </div>

      <div className="grid gap-8 bg-card px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-2">
            <h4 className="text-sm font-bold">{column.title}</h4>

            <ul className="space-y-1.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="space-y-3">
          <h4 className="text-sm font-bold">Redes sociais</h4>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-6 border-primary text-primary"
              aria-label="Facebook"
            >
              F
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-6 border-primary text-primary"
              aria-label="Instagram"
            >
              I
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-6 border-primary text-primary"
              aria-label="LinkedIn"
            >
              L
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-6 border-primary text-primary"
              aria-label="YouTube"
            >
              Y
            </Button>
          </div>

          <h4 className="pt-2 text-sm font-bold">
            Carteiras compatíveis
          </h4>

          <Badge variant="secondary" className="text-[9px] text-primary">
            METAMASK · WALLETCONNECT · COINBASE
          </Badge>
        </div>
      </div>

      <p className="py-4 text-center text-[11px] text-muted-foreground">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}