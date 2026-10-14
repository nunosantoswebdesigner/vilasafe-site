import type { CSSProperties, ReactNode } from "react";

/** Camadas que dão espessura ao telefone (de trás para a frente). */
const EDGE_DEPTHS = [-14, -12, -10, -8, -6, -4, -2];

/**
 * Telefone em CSS 3D (preserve-3d). A rotação vem de duas custom properties
 * escritas pelo loop de movimento; sem JavaScript fica no ângulo de repouso,
 * por isso este markup é também o substituto estático.
 */
export function Phone({
  rx,
  ry,
  rest,
  screenBg = "#0A0A0A",
  screen,
  overlay,
  id,
}: {
  /** Nome da custom property da rotação X, ex.: "--hrx" */
  rx: string;
  /** Nome da custom property da rotação Y, ex.: "--hry" */
  ry: string;
  /** Ângulo de repouso [x, y] em graus */
  rest: [number, number];
  screenBg?: string;
  screen: ReactNode;
  overlay?: ReactNode;
  /** Identificador do telefone (data-phone) */
  id: string;
}) {
  const style = {
    transform: `rotateX(calc(var(${rx}, ${rest[0]}) * 1deg)) rotateY(calc(var(${ry}, ${rest[1]}) * 1deg))`,
  } as CSSProperties;

  return (
    <div
      data-phone={id}
      className="relative h-[620px] w-[300px] [transform-style:preserve-3d]"
      style={style}
    >
      <div
        className="absolute inset-0 rounded-[48px] bg-[#0d0d0d]"
        style={{ transform: "translateZ(-16px)" }}
      />
      {EDGE_DEPTHS.map((z) => (
        <div
          key={z}
          className="absolute inset-0 rounded-[48px] bg-vs-edge"
          style={{ transform: `translateZ(${z}px)` }}
        />
      ))}
      <div className="absolute inset-0 rounded-[48px] bg-[#0A0A0A] shadow-[inset_0_0_0_1.5px_#3a3a3a]" />
      <div
        className="absolute inset-[10px] overflow-hidden rounded-[38px]"
        style={{ background: screenBg, transform: "translateZ(1px)" }}
      >
        {screen}
      </div>
      {overlay}
    </div>
  );
}
