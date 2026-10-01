import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const features = [
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

export const FeaturesSection = () => {
  return (
    <section className="mt-16 grid gap-6 rounded-lg bg-card p-6 md:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="space-y-2 md:border-r md:border-border md:pr-6"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {feature.letter}
          </div>

          <h3 className="text-sm font-bold">{feature.title}</h3>

          <p className="text-xs leading-5 text-muted-foreground">
            {feature.text}
          </p>
        </div>
      ))}

      <div className="space-y-3">
        <h3 className="text-sm font-bold">
          Antecipe-se ao próximo lançamento
        </h3>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="digite seu e-mail..."
            className="h-8 border-0 bg-secondary text-xs"
          />

          <Button size="sm" className="h-8 text-xs">
            Enviar
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Receba lançamentos selecionados, histórias de criadores e
          novidades do mercado.
        </p>
      </div>
    </section>
  );
}