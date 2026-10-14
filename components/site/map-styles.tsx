
/** Mapas vetoriais da app (public/media/maps), recortados à mesma zona dos reportes. */
const LAYERS = [
  { src: "/media/maps/mapa-ruas.svg", alt: "Mapa em vista de ruas, com os reportes coloridos por gravidade", label: "RUAS" },
  { src: "/media/maps/mapa-terreno.svg", alt: "Mapa em vista de terreno, com os reportes coloridos por gravidade", label: "TERRENO" },
  { src: "/media/maps/mapa-claro.svg", alt: "Mapa em tema claro, com os reportes coloridos por gravidade", label: "CLARO" },
  { src: "/media/maps/mapa-escuro.svg", alt: "Mapa em tema escuro, com os reportes coloridos por gravidade", label: "ESCURO" },
];

/**
 * Quatro estilos do mesmo mapa vetorial da app, empilhados e revelados de baixo para cima por clip-path com o scroll.
 * Uma fita de obra varre a linha de corte. Sem JS, vê-se a primeira camada.
 */
export function MapStyles() {
  return (
    <section data-maps aria-labelledby="h-maps" className="relative h-[380vh] border-t border-vs-line">
      <div className="container-vs sticky top-0 flex h-screen flex-col justify-center gap-6 pt-20 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2
            id="h-maps"
            className="m-0 max-w-[11em] font-poster text-[clamp(40px,5vw,80px)] leading-[0.9]"
          >
            O mesmo mapa, <span className="text-vs-acc">4 estilos diferentes.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {LAYERS.map((l, i) => (
              <span
                key={l.label}
                data-maplabel={i}
                data-active={i === 0 || undefined}
                className="border border-vs-line px-3 py-2 font-mono text-[13px] text-vs-ink transition-colors duration-300 data-active:border-brand data-active:bg-brand data-active:text-brand-ink"
              >
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-[min(62vh,640px)] overflow-clip bg-[#1a1a1a] max-[640px]:aspect-square max-[640px]:h-auto">
          {LAYERS.map((l, i) => (
            // SVG servidos como ficheiro (cache do browser); next/image não otimiza SVG.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={l.src}
              data-maplayer={i}
              src={l.src}
              alt={l.alt}
              width={740}
              height={520}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{
                transform: "scale(calc(1.02 + var(--mz, 0) * 0.12))",
                clipPath: i === 0 ? undefined : "inset(100% 0 0 0)",
              }}
            />
          ))}
          <div
            data-maptape
            aria-hidden="true"
            className="absolute top-0 -left-[10%] z-10 h-11 w-[120%] animate-vs-tape-slow shadow-[0_10px_28px_rgba(0,0,0,.45)]"
            style={{
              transform: "translateY(-200px) rotate(-4deg)",
              background:
                "linear-gradient(-45deg, #F7931E 25%, #0A0A0A 25% 50%, #F7931E 50% 75%, #0A0A0A 75%) 0 0 / 40px 40px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
