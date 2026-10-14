/** Dados do site, partilhados por metadados, schema.org, sitemap e robots. */
export const SITE = {
  url: "https://vilasafe.pt",
  name: "Vila Safe",
  title: "Vila Safe",
  description:
    "Projeto cívico independente: um mapa público onde residentes sinalizam buracos, tampas de esgoto abertas, calçada partida e outros perigos na via pública. A funcionar na Foz do Arelho.",
  /** Imagem de partilha (Open Graph / Twitter). Ficheiro em public/, 1200×630. */
  ogImage: { url: "/og-image.jpg", width: 1200, height: 630, alt: "Vila Safe — o mapa dos perigos na via pública" },
  appUrl: "https://fozdoarelho.vilasafe.pt",
  locale: "pt_PT",
  language: "pt-PT",
  gaId: "G-X6T510H1CN",
  author: { name: "Nuno Santos", url: "https://www.instagram.com/nunosantosdev" },
  /** Data da última alteração de conteúdo relevante (sitemap). */
  updated: "2026-10-14",
} as const;
