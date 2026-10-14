import Image from "next/image";
import { Phone } from "./phone";
import { aiFrame } from "./constants";

const STEPS = [
  {
    tag: "01 · FOTOGRAFAR",
    title: "Tira a foto.",
    body: "Abre a app, carrega em Reportar e aponta a câmara ao problema — um buraco na estrada, calçada partida, um perigo no passeio. Se já tiveres uma foto, escolhe-a da galeria.",
    note: "Antes de ser enviada, a imagem é comprimida no próprio telemóvel. Fica mais leve e chega mesmo quando a rede é fraca.",
  },
  {
    tag: "02 · ASSISTIDO POR IA",
    title: "A IA sugere. Tu decides.",
    body: "Assim que a foto carrega, a app analisa a imagem e propõe um título e uma descrição em português, em cerca de um segundo. Lês a sugestão e decides: aceitas, corriges ou apagas e escreves à tua maneira.",
    note: "A IA às vezes erra — por isso é só uma sugestão. Se falhar ou demorar, o formulário convida-te a escrever à mão e o reporte nunca fica bloqueado.",
  },
  {
    tag: "03 · LOCALIZAR",
    title: "Marca o sítio.",
    body: "Usa o GPS para apanhar a tua posição ou toca no mapa para escolher o ponto exato. A fronteira da freguesia está desenhada a tracejado, para saberes sempre onde termina a área coberta.",
    note: "A app conhece esses limites e recusa pontos que fiquem fora deles. Cada reporte fica onde deve estar.",
  },
  {
    tag: "04 · MODERAR",
    title: "Uma pessoa revê.",
    body: "Nada vai diretamente para o mapa. Cada reporte entra como pendente e é visto por um moderador, que o aprova ou rejeita. Não precisas de criar conta: deixas apenas o nome e o email.",
    note: "Esses dados servem só para a moderação e nunca aparecem no mapa público.",
  },
  {
    tag: "05 · PUBLICAR",
    title: "Fica à vista de todos.",
    body: "Depois de aprovado, o ponto aparece no mapa público com a foto, o local e a gravidade. Qualquer pessoa o pode consultar — no mapa ou na lista, filtrada por gravidade.",
    note: "Quem instalou a app recebe um aviso no telemóvel quando surge um ponto novo, e outro quando um ponto é marcado como resolvido.",
  },
];

/** Cartão flutuante ao lado do telefone, um por passo (como o do herói). */
const CHIPS = [
  { label: "FOTO ANEXADA", color: "#F7931E", text: "Comprimida antes de enviar" },
  { label: "SUGESTÃO DA IA", color: "#F7931E", text: "Buraco profundo na estrada" },
  { label: "LOCALIZAÇÃO", color: "#F7931E", text: "Dentro da freguesia" },
  { label: "PENDENTE", color: "#A3A09A", text: "À espera de um moderador" },
  { label: "APROVADO", color: "#F7931E", text: "Já está no mapa público" },
];

const SCREENS = [
  { src: aiFrame(0), alt: "Formulário de reporte com a foto de um buraco carregada" },
  { src: "/media/app/home.jpg", alt: "Mapa com a fronteira da freguesia desenhada a tracejado vermelho" },
  { src: "/media/app/detalhe.jpg", alt: "Detalhe de um reporte aprovado, com foto, morada e gravidade" },
  { src: "/media/app/mapa-ruas.jpg", alt: "Mapa público com os reportes aprovados" },
];

const screenClass = "story-screen absolute inset-0 h-full w-full object-cover object-top";
const labelClass = "font-mono text-[13px] font-medium tracking-[0.1em] text-vs-muted";

export function Story() {
  return (
    <section data-story aria-labelledby="h-story" className="relative border-t border-vs-line">
      <h2 id="h-story" className="sr-only">
        A solução: como se sinaliza um problema
      </h2>

      {/* Palco fixo com o telefone */}
      <div className="story-stage pointer-events-none sticky top-0 h-screen [perspective:1600px] max-[859px]:h-svh min-[860px]:z-10">
        {/* Rótulo fixo durante os cinco passos (no telemóvel aparece dentro de cada cartão) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 pt-[clamp(108px,15vh,150px)] pb-12 max-[859px]:hidden"
          style={{ background: "linear-gradient(to bottom, var(--vs-bg) 72%, transparent)" }}
        >
          <div className={`container-vs ${labelClass}`}>A SOLUÇÃO</div>
        </div>
        <div className="story-stage-inner container-vs">
        <div data-storypop className="story-phone-wrap story-phone-slot origin-right justify-self-end max-[859px]:origin-top max-[859px]:self-start max-[859px]:justify-self-center">
          <Phone
            id="story"
            rx="--srx"
            ry="--sry"
            rest={[6, -14]}
            screen={
              <>
                <Image
                  data-screen="0"
                  data-state="active"
                  src={SCREENS[0].src}
                  alt={SCREENS[0].alt}
                  fill
                  sizes="280px"
                  className={screenClass}
                />
                {/* Passo 02: os 80 frames da IA são percorridos com o scroll (troca de src). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-screen="1"
                  data-state="after"
                  data-aiframe
                  src={aiFrame(0)}
                  alt="A IA a sugerir título e descrição a partir da foto"
                  width={416}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className={screenClass}
                />
                {SCREENS.slice(1).map((s, i) => (
                  <Image
                    key={s.src}
                    data-screen={i + 2}
                    data-state="after"
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="280px"
                    className={screenClass}
                  />
                ))}
                {/* Reflexo que atravessa o ecrã a cada mudança de passo */}
                <div data-storyglare aria-hidden="true" className="story-glare" />
              </>
            }
            overlay={
              <>
              <div
                aria-hidden="true"
                className="absolute top-[46px] -left-[26px] flex flex-col gap-2 bg-brand px-3.5 pt-[9px] pb-2.5 font-mono text-[15px] leading-[18px] text-brand-ink shadow-[0_16px_34px_rgba(0,0,0,.4)]"
                style={{ transform: "translateZ(70px)" }}
              >
                <div className="flex">
                  {/* Número que rola entre passos */}
                  <span className="inline-block h-[18px] overflow-hidden">
                    <span data-stepnum className="story-roll flex flex-col">
                      {STEPS.map((_, i) => (
                        <span key={i}>{String(i + 1).padStart(2, "0")}</span>
                      ))}
                    </span>
                  </span>
                  <span>&nbsp;/ 05</span>
                </div>
                <div className="flex gap-[3px]">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      data-stepseg={i}
                      data-on={i === 0 || undefined}
                      className="story-seg h-[3px] flex-1"
                    />
                  ))}
                </div>
              </div>
              {/* Cartão flutuante que muda com o passo */}
              <div
                aria-hidden="true"
                className="absolute top-[392px] -left-[104px] h-[118px] w-[252px] max-[859px]:top-[240px] max-[859px]:left-auto max-[859px]:-right-12"
                style={{ transform: "translateZ(90px)" }}
              >
                {CHIPS.map((c, i) => (
                  <div
                    key={c.label}
                    data-chip={i}
                    data-state={i === 0 ? "active" : "after"}
                    className="story-chip absolute inset-x-0 top-0 flex flex-col gap-2.5 border border-[#2a2a2a] bg-[#0A0A0A] px-[18px] py-4 text-[#F4F1EC] shadow-[0_24px_50px_rgba(0,0,0,.45)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="font-mono text-[11px] tracking-[0.08em]" style={{ color: c.color }}>
                        {c.label}
                      </span>
                    </div>
                    <div className="text-[17px] leading-[1.2] font-bold">{c.text}</div>
                    <div className="tape h-1.5 [--tape-size:12px]" />
                  </div>
                ))}
              </div>
              </>
            }
          />
        </div>
        </div>

        {/* Telemóvel: o texto do passo ativo fica fixo por baixo do telefone e troca com
            uma transição, em vez de passar por cima dele. Só aparece com JS (.motion-ready);
            sem JS, os textos ficam visíveis na lista abaixo. */}
        <div aria-hidden="true" className="story-mpanel">
          <div className={`${labelClass} mb-2.5`}>A SOLUÇÃO</div>
          <div className="story-mpanel-cards">
            {STEPS.map((s, i) => (
              <div key={s.tag} data-mcard={i} data-active={i === 0 || undefined} className="story-mcard flex flex-col gap-2.5">
                <div className="font-mono text-[13px] tracking-[0.06em] text-vs-acc">{s.tag}</div>
                <div className="font-poster text-[clamp(30px,8.6vw,40px)] leading-[0.9]">{s.title}</div>
                <p className="m-0 text-[15.5px] leading-[1.45] text-pretty">{s.body}</p>
                {s.note && (
                  <p className="m-0 border-l-2 border-brand pl-3 text-[14px] leading-[1.45] text-vs-muted text-pretty">
                    {s.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Passos: cada um ocupa um ecrã */}
      <ol className="container-vs relative -mt-[100vh] list-none">
        {STEPS.map((s, i) => (
          <li key={s.tag} data-step={i} className="story-step flex min-h-screen py-[12vh]">
            <div
              data-active={i === 0 || undefined}
              className="story-card flex w-full flex-col gap-6 max-[859px]:gap-3.5"
            >
              <div aria-hidden="true" className={`${labelClass} min-[860px]:hidden`}>
                A SOLUÇÃO
              </div>
              <div className="font-mono text-[15px] tracking-[0.06em] text-vs-acc">{s.tag}</div>
              <h3 className="m-0 font-poster text-[clamp(52px,7vw,112px)] max-[859px]:text-[clamp(36px,10vw,48px)] leading-[0.88] tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="m-0 max-w-[30em] text-[clamp(20px,1.8vw,26px)] leading-[1.5] max-[859px]:text-[17px] text-pretty">
                {s.body}
              </p>
              {s.note && (
                <p className="m-0 max-w-[34em] border-l-2 border-brand pl-4 text-[clamp(17px,1.35vw,20px)] max-[859px]:text-[15px] leading-normal text-vs-muted">
                  {s.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
