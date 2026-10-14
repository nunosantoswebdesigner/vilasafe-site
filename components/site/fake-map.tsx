import type { CSSProperties, ReactNode } from "react";

/**
 * Mapa vetorial fictício (não é a freguesia real): quarteirões, ruas, mar, lagoa,
 * parques e uma fronteira tracejada. Gerado de forma determinística no servidor.
 * As cores vêm de custom properties (--map-*): por omissão seguem o tema, ou um
 * dos estilos de MAP_STYLES. "satelite" e "ruas" têm um nível de detalhe próprio
 * (edifícios, telhados, árvores, hierarquia de vias).
 */

export const MAP_SIZE = 1600;

type MapStyle = "ruas" | "claro" | "escuro" | "satelite";
type Detail = "flat" | "streets" | "satellite";

const v = (o: Record<string, string>) =>
  Object.fromEntries(Object.entries(o).map(([k, val]) => [`--map-${k}`, val])) as CSSProperties;

/** Paletas dos estilos de mapa da app (recriadas em vetor). */
export const MAP_STYLES: Record<MapStyle, CSSProperties> = {
  satelite: v({
    land: "#646847",
    street: "#5b5a54",
    block: "#b8613a",
    road: "#575651",
    "road-edge": "#3d3c38",
    water: "#1d4651",
    "water-line": "#5d8f99",
    park: "#40562f",
    label: "#ffffff",
    halo: "rgba(0,0,0,.7)",
  }),
  ruas: v({
    land: "#f2efe9",
    street: "#ffffff",
    "street-edge": "#d6cfc2",
    block: "#ece7de",
    building: "#ddd5c9",
    "building-edge": "#cbc1b2",
    road: "#fde7a3",
    "road-edge": "#e2be66",
    water: "#aad3df",
    "water-line": "#8cc0d0",
    park: "#c8e5b0",
    "park-edge": "#a9d18c",
    label: "#5b5348",
    halo: "#ffffff",
    poi: "#8c7d6b",
  }),
  claro: v({
    land: "#f3f3f1",
    street: "#ffffff",
    block: "#e4e4e1",
    road: "#ffffff",
    "road-edge": "#d9d9d5",
    water: "#d3e2ea",
    "water-line": "#c0d5df",
    park: "#e1ebdb",
    label: "#86837d",
    halo: "#ffffff",
  }),
  escuro: v({
    land: "#1b1c1f",
    street: "#2e2f34",
    block: "#232428",
    road: "#3c3d43",
    "road-edge": "#141518",
    water: "#0e1a24",
    "water-line": "#1b2f3c",
    park: "#1c2520",
    label: "#8c8e94",
    halo: "#1b1c1f",
  }),
};

/** Telhados (cor, lado em sombra) e pátios do satélite. */
const ROOFS: [string, string][] = [
  ["#b4603b", "#8f4a2c"],
  ["#c4704a", "#9f5637"],
  ["#a85636", "#84422a"],
  ["#cf8a5f", "#aa6c46"],
  ["#d9d1c4", "#b4ab9d"],
  ["#c9c3b8", "#a39d92"],
  ["#bf6a44", "#984f31"],
  ["#8f8b84", "#726f69"],
];
const YARDS = ["#6d6a51", "#78714f", "#5f6847", "#857c5f", "#6a7350"];
const CANOPY: [string, string][] = [
  ["#33472a", "#46603a"],
  ["#2d3f25", "#40573a"],
  ["#3c522f", "#557043"],
  ["#2a3a22", "#3b5131"],
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type District = { x: number; y: number; w: number; h: number; angle: number; cell: number; seed: number };

const DISTRICTS: District[] = [
  { x: 330, y: 470, w: 560, h: 560, angle: -12, cell: 74, seed: 3 },
  { x: 840, y: 300, w: 520, h: 470, angle: 18, cell: 66, seed: 11 },
  { x: 880, y: 820, w: 520, h: 480, angle: -4, cell: 80, seed: 23 },
  { x: 380, y: 1080, w: 380, h: 300, angle: 26, cell: 70, seed: 41 },
  { x: 1300, y: 560, w: 260, h: 520, angle: 6, cell: 62, seed: 57 },
];

/** Casas em banda ao longo de dois lados do lote, com pátio ao meio (vilas portuguesas). */
function houses(r: () => number, x: number, y: number, s: number) {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const rows = [
    { y, h: s * (0.34 + r() * 0.12) },
    { y: y + s * (0.6 + r() * 0.06), h: s * (0.28 + r() * 0.1) },
  ];
  for (const row of rows) {
    let cx = x;
    const end = x + s;
    while (cx < end - 6) {
      const w = Math.min(end - cx, s * (0.22 + r() * 0.26));
      if (r() > 0.1) out.push({ x: cx, y: row.y, w: w - 1.5, h: Math.min(row.h, y + s - row.y) });
      cx += w;
    }
  }
  return out;
}

function Blocks({ d, detail }: { d: District; detail: Detail }) {
  const r = rng(d.seed);
  const cols = Math.floor(d.w / d.cell);
  const rows = Math.floor(d.h / d.cell);
  const gap = detail === "flat" ? 7 : 9;
  const parts: ReactNode[] = [];
  for (let gx = 0; gx < cols; gx++) {
    for (let gy = 0; gy < rows; gy++) {
      const empty = r() < 0.08; // praças e lotes vazios
      const x = gx * d.cell + gap;
      const y = gy * d.cell + gap;
      const s = d.cell - gap * 2;
      const key = `${gx}-${gy}`;
      if (detail === "flat") {
        if (empty) continue;
        if (r() < 0.35) {
          const k = 0.35 + r() * 0.3;
          parts.push(<rect key={`${key}a`} x={x} y={y} width={s * k - 3} height={s} rx={3} />);
          parts.push(<rect key={`${key}b`} x={x + s * k + 3} y={y} width={s * (1 - k) - 3} height={s} rx={3} />);
        } else {
          parts.push(<rect key={key} x={x} y={y} width={s} height={s} rx={3} />);
        }
        continue;
      }

      if (detail === "streets") {
        parts.push(
          <rect
            key={`${key}-lot`}
            x={x}
            y={y}
            width={s}
            height={s}
            rx={2}
            fill={empty ? "var(--map-park)" : "var(--map-block)"}
            stroke="var(--map-street-edge)"
            strokeWidth={1.5}
          />,
        );
        if (empty) continue;
        for (const [i, h] of houses(r, x + 3, y + 3, s - 6).entries()) {
          parts.push(
            <rect
              key={`${key}-${i}`}
              x={h.x}
              y={h.y}
              width={h.w}
              height={h.h}
              fill="var(--map-building)"
              stroke="var(--map-building-edge)"
              strokeWidth={1}
            />,
          );
        }
        continue;
      }

      // Satélite: pátio, sombras projetadas e telhados de duas águas.
      parts.push(
        <rect key={`${key}-lot`} x={x} y={y} width={s} height={s} fill={YARDS[Math.floor(r() * YARDS.length)]} />,
      );
      if (empty) {
        for (let t = 0; t < 4; t++) {
          parts.push(
            <circle key={`${key}-t${t}`} cx={x + r() * s} cy={y + r() * s} r={6 + r() * 7} fill="#3a4f2c" />,
          );
        }
        continue;
      }
      const hs = houses(r, x + 2, y + 2, s - 4);
      for (const [i, h] of hs.entries()) {
        parts.push(
          <rect key={`${key}-s${i}`} x={h.x + 3.5} y={h.y + 3.5} width={h.w} height={h.h} fill="rgba(0,0,0,.38)" />,
        );
      }
      for (const [i, h] of hs.entries()) {
        const [c, dark] = ROOFS[Math.floor(r() * ROOFS.length)];
        const alongX = h.w >= h.h;
        parts.push(<rect key={`${key}-r${i}`} x={h.x} y={h.y} width={h.w} height={h.h} fill={c} />);
        parts.push(
          alongX ? (
            <rect key={`${key}-d${i}`} x={h.x} y={h.y + h.h / 2} width={h.w} height={h.h / 2} fill={dark} />
          ) : (
            <rect key={`${key}-d${i}`} x={h.x + h.w / 2} y={h.y} width={h.w / 2} height={h.h} fill={dark} />
          ),
        );
      }
      if (r() < 0.14) {
        parts.push(
          <rect
            key={`${key}-pool`}
            x={x + s * 0.35}
            y={y + s * 0.47}
            width={s * 0.22}
            height={s * 0.11}
            rx={2}
            fill="#5fc4d6"
            stroke="#e9e4da"
            strokeWidth={1.5}
          />,
        );
      }
      if (r() < 0.6) {
        const [c, hi] = CANOPY[Math.floor(r() * CANOPY.length)];
        const tx = x + s * (0.15 + r() * 0.7);
        const ty = y + s * 0.5;
        const tr = 5 + r() * 5;
        parts.push(<circle key={`${key}-ts`} cx={tx + 3} cy={ty + 3} r={tr} fill="rgba(0,0,0,.35)" />);
        parts.push(<circle key={`${key}-tc`} cx={tx} cy={ty} r={tr} fill={c} />);
        parts.push(<circle key={`${key}-th`} cx={tx - tr * 0.3} cy={ty - tr * 0.3} r={tr * 0.5} fill={hi} />);
      }
    }
  }
  const cx = d.x + d.w / 2;
  const cy = d.y + d.h / 2;
  return (
    <g transform={`rotate(${d.angle} ${cx} ${cy}) translate(${d.x} ${d.y})`}>
      <rect width={cols * d.cell} height={rows * d.cell} rx={10} fill="var(--map-street)" />
      <g fill="var(--map-block)">{parts}</g>
    </g>
  );
}

/** Grupos de árvores com sombra e volume (satélite). */
function Trees() {
  const r = rng(99);
  const shadows: ReactNode[] = [];
  const crowns: ReactNode[] = [];
  const clusters = [
    ...Array.from({ length: 46 }, () => ({ x: 220 + r() * 1400, y: r() * 1600, n: 6 + Math.floor(r() * 10), spread: 40 })),
    // parques mais densos
    { x: 1310, y: 1290, n: 70, spread: 130 },
    { x: 390, y: 320, n: 40, spread: 80 },
  ];
  let k = 0;
  for (const c of clusters) {
    for (let i = 0; i < c.n; i++) {
      const a = r() * Math.PI * 2;
      const dist = Math.sqrt(r()) * c.spread;
      const x = c.x + Math.cos(a) * dist;
      const y = c.y + Math.sin(a) * dist;
      const rad = 7 + r() * 11;
      const [base, hi] = CANOPY[Math.floor(r() * CANOPY.length)];
      shadows.push(<circle key={`s${k}`} cx={x + 5} cy={y + 5} r={rad} />);
      crowns.push(
        <g key={`c${k}`}>
          <circle cx={x} cy={y} r={rad} fill={base} />
          <circle cx={x - rad * 0.28} cy={y - rad * 0.3} r={rad * 0.55} fill={hi} />
        </g>,
      );
      k++;
    }
  }
  return (
    <g>
      <g fill="rgba(0,0,0,.35)">{shadows}</g>
      {crowns}
    </g>
  );
}

/** Manchas de solo e erva para o terreno não parecer liso (satélite). */
function Ground({ id }: { id: string }) {
  const r = rng(7);
  const cols = ["#6f7050", "#585f3f", "#7c7656", "#4f5a39", "#80795a"];
  return (
    <g>
      <g filter={`url(#${id}-blur)`} opacity={0.85}>
        {Array.from({ length: 40 }, (_, i) => (
          <ellipse
            key={i}
            cx={220 + r() * 1400}
            cy={r() * 1600}
            rx={60 + r() * 160}
            ry={40 + r() * 110}
            fill={cols[Math.floor(r() * cols.length)]}
          />
        ))}
      </g>
      <rect width={MAP_SIZE} height={MAP_SIZE} filter={`url(#${id}-grain)`} opacity={0.22} />
    </g>
  );
}

const MAIN_ROADS = [
  "M -40 900 C 300 860 520 780 760 700 S 1200 520 1660 470",
  "M 700 -40 C 690 300 640 520 620 760 S 700 1300 760 1660",
  "M 380 1660 C 600 1300 900 1150 1150 1060 S 1500 960 1660 1000",
  "M 1040 -40 C 1020 200 1010 400 1010 540 S 1080 900 1090 1060",
];

function Roads({ detail }: { detail: Detail }) {
  return (
    <g fill="none" strokeLinecap="round">
      {/* passeios */}
      {detail !== "flat" &&
        MAIN_ROADS.map((d) => (
          <path
            key={`${d}-sw`}
            d={d}
            stroke={detail === "satellite" ? "#9b968b" : "#ffffff"}
            strokeWidth={30}
          />
        ))}
      {MAIN_ROADS.map((d) => (
        <path key={d} d={d} stroke="var(--map-road-edge)" strokeWidth={22} />
      ))}
      {MAIN_ROADS.map((d) => (
        <path key={`${d}-in`} d={d} stroke="var(--map-road)" strokeWidth={detail === "flat" ? 14 : 17} />
      ))}
      {detail === "satellite" &&
        MAIN_ROADS.map((d) => (
          <path
            key={`${d}-mk`}
            d={d}
            stroke="rgba(255,255,255,.55)"
            strokeWidth={1.6}
            strokeDasharray="14 16"
          />
        ))}
    </g>
  );
}

const MARKERS = [
  { x: 820, y: 640, c: "#EAB308" },
  { x: 1220, y: 760, c: "#F97316" },
  { x: 470, y: 980, c: "#22C55E" },
  { x: 900, y: 1240, c: "#EAB308" },
  { x: 1300, y: 420, c: "#EF4444" },
  { x: 560, y: 560, c: "#F97316" },
];

/** Pinos grandes, como os marcadores da app (círculo com o cone). */
const PINS = [
  { x: 570, y: 770, c: "#EF4444" },
  { x: 650, y: 660, c: "#EAB308" },
  { x: 800, y: 610, c: "#EAB308" },
  { x: 905, y: 545, c: "#EF4444" },
  { x: 1140, y: 545, c: "#F97316" },
  { x: 1030, y: 760, c: "#EAB308" },
];

function Pin({ x, y, c }: { x: number; y: number; c: string }) {
  const R = 40;
  return (
    <g>
      <circle cx={x} cy={y + 6} r={R} fill="rgba(0,0,0,.28)" />
      <circle cx={x} cy={y} r={R} fill={c} stroke="#ffffff" strokeWidth={4} />
      <g transform={`translate(${x - R * 0.55} ${y - R * 0.6}) scale(${(R * 1.1) / 100})`} fill="#ffffff">
        <path d="M44 12Q50 3 56 12L62 32H38Z" />
        <path d="M35.2 42H64.8L69.5 58H30.5Z" />
        <path d="M27.6 68H72.4L76 82H24Z" />
        <rect x="10" y="80" width="80" height="10" rx="5" />
      </g>
    </g>
  );
}

/** Ícones de pontos de interesse (estilo ruas). */
function Pois() {
  return (
    <g>
      {/* Igreja */}
      <circle cx={610} cy={498} r={15} fill="var(--map-poi)" stroke="#ffffff" strokeWidth={3} />
      <path d="M610 489v18M603 495h14" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
      {/* Mercado */}
      <circle cx={1120} cy={692} r={15} fill="var(--map-poi)" stroke="#ffffff" strokeWidth={3} />
      <path
        d="M1112 687h16l-2 9h-12zM1114 687l2-5M1126 687l-2-5"
        stroke="#ffffff"
        strokeWidth={2.4}
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

export function FakeMap({
  variant,
  pins = false,
  viewBox = `0 0 ${MAP_SIZE} ${MAP_SIZE}`,
  fill = false,
}: {
  /** Estilo de mapa; sem valor, as cores seguem o tema do site. */
  variant?: MapStyle;
  /** Pinos grandes (secção de estilos) em vez dos marcadores pequenos. */
  pins?: boolean;
  viewBox?: string;
  /** Ocupa o contentor (recortando, como object-fit: cover) em vez de 1600×1600 px. */
  fill?: boolean;
}) {
  const detail: Detail = variant === "satelite" ? "satellite" : variant === "ruas" ? "streets" : "flat";
  const id = `map-${variant ?? "tema"}`;
  return (
    <svg
      width={fill ? "100%" : MAP_SIZE}
      height={fill ? "100%" : MAP_SIZE}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className="block"
      style={variant ? MAP_STYLES[variant] : undefined}
      aria-hidden="true"
    >
      {detail === "satellite" && (
        <defs>
          <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1" />
          </filter>
        </defs>
      )}

      <rect x={-200} y={-200} width={MAP_SIZE + 400} height={MAP_SIZE + 400} fill="var(--map-land)" />
      {detail === "satellite" && <Ground id={id} />}

      {/* Mar e lagoa */}
      <path
        d="M -20 -20 L 250 -20 C 210 200 260 360 190 520 S 120 820 210 1000 S 160 1300 90 1620 L -20 1620 Z"
        fill="var(--map-water)"
        stroke={detail === "satellite" ? "#d8d0b8" : "none"}
        strokeWidth={detail === "satellite" ? 10 : 0}
      />
      <path
        d="M 120 1250 C 260 1180 420 1260 470 1380 S 380 1600 220 1620 L 60 1620 Z"
        fill="var(--map-water)"
      />
      <g fill="none" stroke="var(--map-water-line)" strokeWidth={2} opacity={0.7}>
        <path d="M 60 160 q 30 -14 60 0 t 60 0" />
        <path d="M 40 420 q 30 -14 60 0 t 60 0" />
        <path d="M 50 760 q 30 -14 60 0 t 60 0" />
        <path d="M 30 1080 q 30 -14 60 0 t 60 0" />
      </g>

      {/* Parques */}
      <g
        fill="var(--map-park)"
        stroke={detail === "streets" ? "var(--map-park-edge)" : "none"}
        strokeWidth={detail === "streets" ? 3 : 0}
      >
        <path d="M 1180 1180 C 1300 1130 1440 1180 1470 1290 S 1360 1460 1240 1420 S 1080 1250 1180 1180 Z" />
        <path d="M 300 260 C 380 220 470 250 480 320 S 400 420 330 400 S 240 300 300 260 Z" />
      </g>

      {/* Árvores por baixo dos quarteirões: ficam no terreno aberto e nos parques */}
      {detail === "satellite" && <Trees />}

      {DISTRICTS.map((d) => (
        <Blocks key={d.seed} d={d} detail={detail} />
      ))}

      <Roads detail={detail} />

      {/* Fronteira da freguesia (fictícia) */}
      <path
        d="M 260 300 C 520 180 900 160 1240 240 S 1520 620 1480 900 S 1300 1380 980 1420 S 420 1360 300 1100 S 180 520 260 300 Z"
        fill="none"
        stroke="#EF4444"
        strokeWidth={4}
        strokeDasharray="18 12"
        opacity={0.55}
      />

      {pins && detail === "streets" && <Pois />}

      {/* Nomes fictícios, com contorno para se lerem sobre qualquer estilo */}
      <g
        fill="var(--map-label)"
        stroke="var(--map-halo, transparent)"
        strokeWidth={pins ? 5 : 0}
        paintOrder="stroke"
        fontFamily={pins ? "var(--font-barlow), sans-serif" : "var(--font-jetbrains-mono), monospace"}
        fontWeight={pins ? 600 : 400}
        fontSize={pins ? 26 : 18}
        letterSpacing={pins ? 0.5 : 3}
      >
        <text x={930} y={660} transform="rotate(-18 930 660)">
          {pins ? "Rua Direita" : "RUA DIREITA"}
        </text>
        <text x={300} y={860} transform="rotate(-8 300 860)">
          {pins ? "Av. do Mar" : "AV. DO MAR"}
        </text>
        <text x={1160} y={1000} transform="rotate(-14 1160 1000)">
          {pins ? "Estrada da Lagoa" : "ESTRADA DA LAGOA"}
        </text>
        <text x={1240} y={1300}>{pins ? "Parque" : "PARQUE"}</text>
        {pins && (
          <>
            <text x={640} y={505}>Largo da Igreja</text>
            <text x={1150} y={700}>Mercado</text>
          </>
        )}
      </g>

      {pins
        ? PINS.map((p) => <Pin key={`${p.x}-${p.y}`} {...p} />)
        : MARKERS.map((m) => (
            <g key={`${m.x}-${m.y}`}>
              <circle cx={m.x} cy={m.y} r={16} fill={m.c} opacity={0.25} />
              <circle cx={m.x} cy={m.y} r={9} fill={m.c} stroke="var(--map-land)" strokeWidth={3} />
            </g>
          ))}
    </svg>
  );
}
