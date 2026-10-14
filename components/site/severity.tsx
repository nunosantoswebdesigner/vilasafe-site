import { ConeIcon } from "./brand";
import { MAP_ZONES, SEVERITY } from "./constants";
import { FakeMap } from "./fake-map";

const Z0 = MAP_ZONES[0];

/**
 * Grave → Muito Grave → Perigoso → Resolvido: a cor do pino interpola entre níveis
 * com o scroll, o pino levanta em cada transição e a câmara viaja sobre um mapa
 * vetorial até à zona seguinte, voltando ao início em "Resolvido".
 */
export function Severity() {
  return (
    <section
      data-sev
      aria-labelledby="h-sev"
      className="relative h-[620vh] border-t border-vs-line"
      style={{ ["--sev" as string]: SEVERITY[0].color }}
    >
      <div className="sev-stage container-vs sticky top-0 grid h-screen gap-x-[60px] overflow-clip pb-[30px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))]">
        <div className="relative z-[2] flex flex-col gap-[clamp(16px,2.4vh,28px)]">
          <h2 id="h-sev" className="sev-title m-0 font-poster leading-[0.9]">
            Três níveis de perigo. <span className="text-vs-acc">E um de resolvido.</span>
          </h2>
          <ol className="m-0 flex list-none flex-col border-t border-vs-line p-0">
            {SEVERITY.map((s, i) => (
              <li
                key={s.name}
                data-sevitem={i}
                className="sev-item flex items-baseline gap-[18px] border-b border-vs-line transition-opacity duration-500"
              >
                <span
                  className="size-3.5 flex-none rounded-full"
                  style={{ background: s.color }}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[clamp(20px,1.7vw,24px)] font-bold">{s.name}</span>
                  <span className="sev-desc leading-[1.3] text-vs-muted">{s.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div data-sevvis aria-hidden="true" className="relative h-(--sev-vis-h) [perspective:1400px]">
          {/* Disco de mapa vetorial, inclinado. A câmara (pan, zoom, rotação) é animada por JS. */}
          <div
            className="absolute top-(--sev-anchor) left-1/2 size-[1000px] rounded-full"
            style={{
              transform: `translate(-50%, -50%) scale(var(--sev-disc, 1)) rotateX(58deg) rotateZ(calc(var(--sevRot, ${Z0.rot}) * 1deg))`,
              WebkitMaskImage: "radial-gradient(closest-side, #000 50%, transparent 96%)",
              maskImage: "radial-gradient(closest-side, #000 50%, transparent 96%)",
            }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-full bg-(--map-land)">
              <div
                className="absolute top-1/2 left-1/2 size-0 origin-top-left will-change-transform"
                style={{
                  transform: `scale(var(--sevZoom, ${Z0.zoom})) translate(calc(var(--sevX, ${Z0.x}) * -1px), calc(var(--sevY, ${Z0.y}) * -1px))`,
                }}
              >
                <FakeMap />
              </div>
            </div>
            {/* Sombra e onda no plano do mapa: a perspetiva achata-as sozinha */}
            <div
              className="absolute top-1/2 left-1/2 size-[220px] rounded-full"
              style={{
                background: "radial-gradient(closest-side, rgba(0,0,0,.6), transparent)",
                transform: "translate(-50%, -50%) scale(calc(1 - var(--sevLift, 0) * 0.35))",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 size-[120px] rounded-full border-4 border-(--sev)"
              style={{
                transform: "translate(-50%, -50%) scale(calc(0.8 + var(--sevPulse, 0) * 2.4))",
                opacity: "calc((1 - var(--sevPulse, 0)) * 0.9)",
              }}
            />
          </div>

          {/* Pino: a ponta assenta no centro do disco */}
          <div
            className="absolute top-(--sev-anchor) left-1/2 flex flex-col items-center will-change-transform"
            style={{
              transform:
                "translate(-50%, -100%) translateY(calc(var(--sevLift, 0) * -30px + var(--sevBob, 0) * 1px)) scale(var(--sevSquash, 1))",
              transformOrigin: "50% 100%",
            }}
          >
            <div className="flex size-(--sev-pin) items-center justify-center rounded-full bg-(--sev) shadow-[0_30px_60px_rgba(0,0,0,.4),inset_0_-10px_0_rgba(0,0,0,.12)]">
              <ConeIcon size="56%" fill="#FFFFFF" />
            </div>
            <div className="-mt-1.5 size-0 border-x-[22px] border-t-[30px] border-x-transparent border-t-(--sev)" />
          </div>

          <div
            data-sevlabel
            className="absolute top-0 right-0 bg-(--sev) px-3 py-2 font-mono text-sm tracking-[0.08em] text-brand-ink"
          >
            GRAVE
          </div>
        </div>
      </div>
    </section>
  );
}
