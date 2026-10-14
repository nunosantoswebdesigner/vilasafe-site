import { SITE } from "@/lib/site";

/**
 * Dados estruturados (schema.org) da página: o site, a página, a aplicação web
 * (fozdoarelho.vilasafe.pt) e o autor. Só factos verificados: sem avaliações nem números.
 */
export function JsonLd() {
  const author = { "@id": `${SITE.url}/#autor` };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: SITE.language,
        publisher: author,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE.url}/#webpage`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        inLanguage: SITE.language,
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: { "@id": `${SITE.appUrl}/#app` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE.url}${SITE.ogImage.url}`,
          width: SITE.ogImage.width,
          height: SITE.ogImage.height,
        },
        dateModified: SITE.updated,
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE.appUrl}/#app`,
        name: "Vila Safe — Foz do Arelho",
        url: SITE.appUrl,
        description:
          "Aplicação web para reportar e consultar problemas na via pública: mapa público, reportes com foto e localização, níveis de gravidade e moderação humana.",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web (instalável a partir do browser)",
        browserRequirements: "Requer JavaScript",
        inLanguage: SITE.language,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        areaServed: {
          "@type": "Place",
          name: "Foz do Arelho",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Foz do Arelho",
            addressRegion: "Leiria",
            addressCountry: "PT",
          },
        },
        featureList: [
          "Mapa público dos problemas aprovados",
          "Reporte com foto tirada na hora ou da galeria",
          "Localização por GPS ou escolha no mapa, limitada à freguesia",
          "Sugestão de título e descrição por IA, sempre editável",
          "Três níveis de gravidade e estado Resolvido",
          "Moderação humana antes da publicação",
          "Lista com filtro por gravidade",
          "Notificações no telemóvel",
          "Sem conta nem registo",
        ],
        creator: author,
      },
      {
        "@type": "Person",
        "@id": `${SITE.url}/#autor`,
        name: SITE.author.name,
        url: SITE.author.url,
        sameAs: [SITE.author.url],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
