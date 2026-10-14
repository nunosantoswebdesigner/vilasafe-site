import { Info, List, Map as MapIcon, Plus } from "lucide-react";
import { Logo } from "./brand";
import { APP_URL } from "./constants";

/** As quatro secções da barra de navegação da app. */
const APP_SECTIONS = [
  {
    term: "Info",
    icon: Info,
    lead: "Informação sobre a aplicação.",
    desc: "O que é o Vila Safe, como funciona a moderação e o que significa cada nível de gravidade — para saberes exatamente o que estás a ver no mapa.",
  },
  {
    term: "Lista",
    icon: List,
    lead: "Todos os locais em formato de lista.",
    desc: "Uma alternativa ao mapa, mais fácil de percorrer: filtras por gravidade e encontras numa secção à parte tudo o que já foi resolvido.",
  },
  {
    term: "Reportar",
    icon: Plus,
    lead: "Reporta um novo problema.",
    desc: "Foto, sugestão de título e descrição pela IA, local por GPS ou no mapa e nível de gravidade. Sem conta: deixas só o nome e o email, que ficam com a moderação.",
  },
  {
    term: "Mapa",
    icon: MapIcon,
    lead: "Alterna entre visualizações do mapa.",
    desc: "Satélite, ruas, terreno, claro ou escuro — o mesmo mapa, com cada problema aprovado marcado na cor da sua gravidade.",
  },
];

export function NoStore() {
  return (
    <section aria-labelledby="h-mais" className="border-t border-vs-line">
      <div className="container-vs grid gap-[60px] py-[clamp(80px,10vw,150px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))]">
        <div className="flex flex-col gap-7">
          <h2 id="h-mais" data-reveal className="m-0 font-poster text-[clamp(40px,5vw,80px)] leading-[0.9]">
            Sobre a <span className="text-vs-acc">aplicação.</span>
          </h2>
          <p data-reveal className="m-0 max-w-[26em] text-[clamp(19px,1.5vw,22px)] leading-[1.55] text-pretty">
            O Vila Safe permite reportar e consultar problemas na via pública — buracos, tampas de
            esgoto abertas, calçada partida e outros perigos que precisam de atenção.
          </p>
          <p data-reveal className="m-0 max-w-[28em] text-[18px] leading-[1.6] text-pretty">
            Cada reporte junta uma foto, o local exato e um nível de gravidade, e só aparece no mapa
            depois de revisto por um moderador. Assim, quem vive na vila sabe o que já foi
            sinalizado e acompanha o que ainda está por resolver.
          </p>
          <p
            data-reveal
            className="m-0 max-w-[30em] border-l-2 border-brand pl-4 text-[17px] leading-[1.55] text-vs-muted text-pretty"
          >
            Abre no browser e instala-se no ecrã do telemóvel a partir daí. Não está nas lojas de
            aplicações e não precisa de conta.
          </p>
        </div>
        <dl className="m-0 flex flex-col self-start border-t-2 border-vs-ink">
          {APP_SECTIONS.map(({ term, icon: Icon, lead, desc }) => (
            <div
              key={term}
              data-reveal
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 border-b border-vs-line py-6 max-[520px]:grid-cols-1 max-[520px]:gap-2"
            >
              <dt className="flex items-center gap-3 self-start text-[19px] font-bold">
                <span className="flex size-9 flex-none items-center justify-center border border-vs-line text-vs-acc">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                {term}
              </dt>
              <dd className="m-0 flex flex-col gap-1.5">
                <span className="text-[18px] leading-snug font-semibold">{lead}</span>
                <span className="text-[16px] leading-normal text-vs-muted">{desc}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const DISCLAIMER = [
  {
    lead: "Não é uma app oficial.",
    text: "É um projeto independente, sem ligação a nenhuma câmara ou junta de freguesia.",
  },
  {
    lead: "Não resolve os problemas.",
    text: "Sinaliza e dá visibilidade. A reparação cabe às entidades competentes.",
  },
  {
    lead: "Não acusa ninguém.",
    text: "Nenhum reporte é uma crítica ao trabalho de pessoas, empresas ou entidades.",
  },
  {
    lead: "É um retrato de um momento.",
    text: "Cada reporte mostra o local quando foi submetido. Pode já ter mudado.",
  },
  {
    lead: "Quem reporta fica protegido.",
    text: "Os nomes e emails de quem reporta nunca serão divulgados. Servem apenas para a moderação.",
  },
  {
    lead: "Sem matrículas nem pessoas.",
    text: "Fotos onde se vejam matrículas ou pessoas não são aceites, para proteger a privacidade de todos.",
  },
];

export function Disclaimer() {
  return (
    <section aria-labelledby="h-nao" className="bg-brand text-brand-ink">
      <div className="container-vs flex flex-col gap-14 py-[clamp(80px,10vw,150px)]">
        <h2
          id="h-nao"
          data-reveal
          className="m-0 max-w-[10em] font-poster text-[clamp(48px,7vw,116px)] leading-[0.88]"
        >
          Para que fique claro.
        </h2>
        <ol className="m-0 grid list-none gap-x-14 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
          {DISCLAIMER.map((d, i) => (
            <li key={d.lead} data-reveal className="flex gap-[22px] border-t-2 border-brand-ink py-[26px]">
              <span className="pt-1 font-mono text-[15px]">{String(i + 1).padStart(2, "0")}</span>
              <p className="m-0 text-[clamp(19px,1.5vw,22px)] leading-[1.45] font-medium">
                <strong>{d.lead}</strong> {d.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="h-cta" className="relative">
      <div className="container-vs flex flex-col gap-9 py-[clamp(90px,12vw,180px)]">
        <h2 id="h-cta" data-reveal className="m-0 font-poster text-[clamp(48px,7vw,116px)] leading-[0.88]">
          Vê como está
          <br />a tua rua.
        </h2>
        <a
          data-reveal
          href={APP_URL}
          className="group flex max-w-full flex-col self-start text-vs-ink no-underline"
        >
          <span aria-hidden="true" className="tape h-3.5 animate-vs-tape-slow" />
          <span className="py-[22px] font-mono text-[clamp(20px,4.2vw,60px)] [overflow-wrap:anywhere] transition-colors group-hover:text-vs-acc">
            fozdoarelho.vilasafe.pt{" "}
            <span aria-hidden="true" className="text-vs-acc">
              →
            </span>
          </span>
          <span aria-hidden="true" className="tape h-3.5 animate-vs-tape-slow [animation-direction:reverse]" />
        </a>
        <p data-reveal className="m-0 max-w-[30em] text-lg leading-normal text-vs-muted">
          Por agora, só existe na Foz do Arelho. Outras vilas estão nos planos.
        </p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-vs-line">
      <div className="container-vs flex flex-wrap items-center justify-between gap-4 py-8">
        <Logo size="sm" />
        <a
          href="https://www.instagram.com/nunosantosdev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Feito por Nuno Santos (Instagram, abre num novo separador)"
          className="group flex items-center gap-2.5 text-sm text-vs-muted no-underline transition-colors hover:text-vs-ink"
        >
          Feito por
          <AuthorMark className="h-3.5 w-7 text-vs-ink transition-colors group-hover:text-brand" />
          <span className="font-semibold text-vs-ink">Nuno Santos</span>
        </a>
      </div>
    </footer>
  );
}

/** Marca do autor (cor herdada de currentColor, para funcionar nos dois temas). */
function AuthorMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 128" fill="none" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M0 0H32V128H0ZM96 0H128V128H96ZM32 32H64V64H32ZM64 64H96V96H64ZM160 0H256V32H160ZM160 32H192V64H160ZM224 64H256V96H224ZM160 96H256V128H160Z"
      />
    </svg>
  );
}
