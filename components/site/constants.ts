export const APP_URL = "https://fozdoarelho.vilasafe.pt";

/** Cores de gravidade: só para estados, nunca decorativas. */
export const SEVERITY = [
  { name: "Grave", label: "GRAVE", color: "#EAB308", desc: "Atenção recomendada." },
  { name: "Muito Grave", label: "MUITO GRAVE", color: "#F97316", desc: "Requer atenção urgente." },
  { name: "Perigoso", label: "PERIGOSO", color: "#EF4444", desc: "Perigo iminente." },
  {
    name: "Resolvido",
    label: "RESOLVIDO",
    color: "#22C55E",
    desc: "Um moderador marcou-o como corrigido no terreno. Não é uma confirmação oficial.",
  },
] as const;

export const AI_FRAME_COUNT = 80;
export const aiFrame = (i: number) => `/media/ia/f${String(i).padStart(3, "0")}.jpg`;

/** Pontos para onde a câmara viaja, um por nível de gravidade (coordenadas do mapa). */
export const MAP_ZONES = [
  { x: 610, y: 760, rot: -14, zoom: 1 },
  { x: 1010, y: 540, rot: 8, zoom: 1.08 },
  { x: 1090, y: 1060, rot: -6, zoom: 0.96 },
  { x: 610, y: 760, rot: 16, zoom: 1.04 },
];
