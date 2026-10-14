# vilasafe-site

Landing page do Vila Safe (`vilasafe.pt`). Uma só página estática; a app vive em
`https://fozdoarelho.vilasafe.pt`.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui.

## Estrutura

- `app/layout.tsx`: fontes, metadados, script de tema sem flash
- `app/page.tsx`: a página, composta por secções
- `app/opengraph-image.tsx`: imagem OG 1200×630 (logo + fita)
- `components/site/*`: secções (servidor) e `motion.tsx` (único componente que anima)
- `components/ui/button.tsx`: Button do shadcn, com as variantes `brand`, `ink` e `tag`
- `assets/design-reference/`: HTML de referência (não é código da app)

## Decisões de design

- **Os ficheiros de design mandam no estilo.** Onde o brief e a SPEC divergem, segui a
  SPEC e o HTML de referência:
  - **Tipografia:** Barlow, Barlow Condensed itálico 800 e JetBrains Mono, em vez de
    Geist. O itálico extrabold apertado da marca mantém-se.
  - **Telefone 3D:** é CSS 3D (`preserve-3d`), sem React Three Fiber, como pede a SPEC.
    Também não usei `next/dynamic` com `ssr: false`. O telefone é HTML e CSS e é o
    elemento LCP do herói, por isso vem renderizado do servidor. Sem JS, ou com
    movimento reduzido, fica parado no ângulo de repouso, e é esse o substituto
    estático. O JS do movimento é um componente cliente pequeno, sem dependências.
- **Movimento:** há um único loop `requestAnimationFrame` (`components/site/motion.tsx`)
  que escreve custom properties. As secções fora do ecrã são ignoradas. Os 80 frames
  da IA só são pré-carregados quando a secção dos passos se aproxima, para poupar quem
  está em rede móvel.
- **Fita de obra:** ciclos de 7 s (faixa sob o herói) e de 9 s (CTA), lentos como pede
  o brief.
- **`prefers-reduced-motion`:** desliga animações, transições, tilt e reveals. O texto
  fica todo visível. Sem JS, o conteúdo também fica todo legível.
- **Tema:** segue o sistema por omissão, o botão alterna e a escolha fica guardada.
  No tema claro, o laranja de texto é `#A85600`, para cumprir AA.
- **Nome:** o título e o texto corrido dizem "Vila Safe". O logótipo mantém a palavra
  `VILASAFE` dos ficheiros de marca.
- **Manifest PWA:** o `manifest.webmanifest` de `public/` é o da app da Foz do Arelho.
  Não está ligado nesta página, para ela não se fazer passar pela app. Ficam só os
  favicons.

## Pendentes (material em falta)

- Captura do estilo de mapa "Terreno". Por agora aparece só o rótulo "+ TERRENO".
- Frames da IA em resolução maior (os atuais têm 416 px de largura).
- A imagem OG usa o logo v2 completo, com a tarja "FOZ DO ARELHO", como indica a SPEC.
  Se a página deve ser só do produto, falta uma versão do logo sem a tarja.
- Email de contacto para o rodapé (opcional, só `mailto:`).
