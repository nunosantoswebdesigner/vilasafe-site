import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Phone } from "./phone";
import { APP_URL } from "./constants";

/** Anéis pulsantes centrados nos seis pinos visíveis em mapa-ruas.jpg (coordenadas no telefone 300×620). */
const RINGS = [
  { left: 246.5, top: 188, color: "#EAB308" },
  { left: 233.4, top: 232.4, color: "#F97316" },
  { left: 151.4, top: 242.7, color: "#EF4444" },
  { left: 132.1, top: 262.9, color: "#EAB308" },
  { left: 56.4, top: 283.6, color: "#EAB308" },
  { left: 23.7, top: 310.8, color: "#EF4444" },
];

export function Hero() {
  return (
    <section
      aria-labelledby="h-hero"
      className="container-vs relative grid items-center gap-[clamp(40px,5vw,80px)] pt-[clamp(40px,7vw,110px)] pb-[clamp(60px,8vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr))] max-[859px]:min-h-[calc(100svh-96px)] max-[859px]:items-stretch max-[859px]:pb-10"
    >
      <div className="relative z-10 flex flex-col gap-8">
        <div data-reveal className="font-mono text-[13px] tracking-[0.1em] text-vs-muted">
          PROJETO CÍVICO · VILA SAFE<span className="max-[859px]:hidden"> ·</span>{" "}
          <br className="min-[860px]:hidden" />
          Foz do Arelho, Portugal
        </div>
        <h1
          id="h-hero"
          className="m-0 font-poster text-[clamp(64px,9.4vw,152px)] leading-[0.86] tracking-[-0.012em] max-[859px]:max-w-[72%]"
        >
          <span data-reveal data-delay="80" className="block">
            Viste um
          </span>{" "}
          <span data-reveal data-delay="160" className="block">
            buraco?
          </span>{" "}
          <span data-reveal data-delay="240" className="block text-vs-acc">
            Reporta!
          </span>
        </h1>
        <p
          data-reveal
          data-delay="340"
          className="m-0 max-w-[34em] text-[clamp(19px,1.5vw,22px)] leading-normal text-pretty max-[859px]:max-w-[64%] max-[859px]:text-[17px]"
        >
          Vila Safe é uma app pública onde se pode reportar situações perigosas na via
          pública, com foto, local exato e gravidade. Toda a gente consulta e ninguém precisa de
          conta.
        </p>
        <div className="text-[15px] leading-[1.4] text-vs-muted pb-3 max-[859px]:max-w-[64%]">
          Independente. Sem ligação a câmara ou junta de freguesia.
        </div>
        <div data-reveal data-delay="420" className="gap-x-7 gap-y-[18px] max-[859px]:mt-auto">
          <a href={APP_URL} className={buttonVariants({ variant: "ink", size: "hero" })}>
            Abrir a app <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Telemóvel: véu da cor do fundo entre o telefone e o texto, para o texto se ler sempre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] hidden max-[859px]:block"
        style={{
          background:
            "linear-gradient(to right, var(--vs-bg) 18%, color-mix(in srgb, var(--vs-bg) 55%, transparent) 55%, transparent 90%)",
        }}
      />
      {/* No telemóvel o telefone fica por trás do texto (z-0), encostado à direita. */}
      <div className="relative flex h-[clamp(600px,62vw,760px)] items-center justify-center [perspective:1600px] max-[859px]:pointer-events-none max-[859px]:absolute max-[859px]:top-0 max-[859px]:right-0 max-[859px]:z-0 max-[859px]:h-full max-[859px]:w-[300px] max-[859px]:translate-x-[8%] max-[859px]:scale-[0.82] max-[859px]:opacity-70">
        {/* Sombra no chão: acompanha a rotação Y */}
        <div
          className="absolute bottom-[3%] left-1/2 -ml-[150px] h-10 w-[300px] rounded-[50%] blur-[6px] max-[859px]:hidden"
          style={{
            background: "radial-gradient(closest-side, rgba(0,0,0,.55), transparent)",
            transform: "translateX(calc(var(--hry, -16) * 1.4px))",
          }}
        />
        <Phone
          id="hero"
          rx="--hrx"
          ry="--hry"
          rest={[6, -16]}
          screenBg="#e8e2d6"
          screen={
            <>
              <Image
                src="/media/app/mapa-ruas.jpg"
                alt="Mapa da app Vila Safe na Foz do Arelho, com seis marcadores coloridos por gravidade"
                width={1080}
                height={2203}
                sizes="280px"
                preload
                className="block h-full w-full object-cover object-top"
              />
              {/* Reflexo especular que segue a rotação */}
              <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background:
                    "linear-gradient(calc(100deg + var(--hry, -16) * 2deg), rgba(255,255,255,0) 30%, rgba(255,255,255,.22) 48%, rgba(255,255,255,0) 62%)",
                }}
              />
            </>
          }
          overlay={
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 h-[620px] w-[300px]"
                style={{ transform: "translateZ(2px)" }}
              >
                {RINGS.map((r, i) => (
                  <div
                    key={i}
                    className="absolute size-8 animate-vs-ring rounded-full border-[3px] opacity-0"
                    style={{
                      left: r.left,
                      top: r.top,
                      borderColor: r.color,
                      animationDelay: `${i * 0.45}s`,
                    }}
                  />
                ))}
              </div>
              <div
                aria-hidden="true"
                className="absolute top-[380px] -left-24 flex w-[250px] max-[859px]:hidden flex-col gap-2.5 border border-[#2a2a2a] bg-[#0A0A0A] px-[18px] py-4 text-[#F4F1EC] shadow-[0_24px_50px_rgba(0,0,0,.45)]"
                style={{ transform: "translateZ(90px)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-sev-muito-grave" />
                  <span className="font-mono text-[11px] tracking-[0.08em] text-sev-muito-grave">
                    MUITO GRAVE
                  </span>
                </div>
                <div className="text-[17px] leading-[1.2] font-bold">Buraco profundo na estrada</div>
                <div className="tape h-1.5 [--tape-size:12px]" />
              </div>
            </>
          }
        />
      </div>
    </section>
  );
}
