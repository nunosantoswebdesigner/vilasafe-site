# VilaSafe — site promocional · SPEC para Claude Code

Landing page de uma só página para o projeto cívico **VilaSafe** (a app vive em `https://fozdoarelho.vilasafe.pt`). Este repo (`vilasafe-site`) é **só o site promocional**, não a app.

## 0. Como usar este pacote

- Copiar `public/` para a raiz do repo (Next.js serve tudo a partir de `/`).
- `design-reference/VilaSafe Landing.dc.html` é a **referência de design em HTML** (abrir no browser, precisa do `support.js` ao lado). **Não é código para copiar** — recriar em Next.js/React com componentes limpos. Todos os valores (cores, tamanhos, cópia, timings, keyframes da animação) estão lá; em caso de dúvida, o HTML manda.
- Fidelidade: **hi-fi**. Reproduzir tipografia, cores, espaçamentos e comportamento de scroll com rigor.

## 1. Stack recomendada

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 (mesmo stack da app).
- Página estática (`export` possível). Sem backend.
- Sem bibliotecas 3D nem de animação: o telefone 3D é CSS puro (`transform-style: preserve-3d`), e as animações de scroll são um único loop `requestAnimationFrame` que escreve CSS custom properties. Manter assim (leve, sem GSAP/Framer obrigatórios).
- Fontes via `next/font/google`: **Barlow Condensed** (itálico 700/800), **Barlow** (400/500/600/700), **JetBrains Mono** (500).
- `lang="pt-PT"`. Toda a cópia em português europeu, exatamente como no HTML de referência.

## 2. Marca

| Token | Escuro (default) | Claro |
|---|---|---|
| `--bg` | `#0A0A0A` | `#FFFFFF` |
| `--ink` | `#F4F1EC` | `#0A0A0A` |
| `--muted` | `#A3A09A` | `#5C5852` |
| `--line` | `#262626` | `#E6E2DC` |
| `--panel` | `#141414` | `#F4F1EC` |
| `--acc` (texto laranja) | `#F7931E` | `#A85600` (contraste AA) |
| `--edge` (aresta do telefone) | `#1d1d1d` | `#c9c4bc` |

- Laranja de marca fixo: `#F7931E` (botões, fita, secção "Para que fique claro").
- Cores de gravidade (só para estados, nunca decorativas): Grave `#EAB308` · Muito Grave `#F97316` · Perigoso `#EF4444` · Resolvido `#22C55E`.
- **Fita de obra** (elemento gráfico): `linear-gradient(-45deg, #F7931E 25%, transparent 25% 50%, #F7931E 50% 75%, transparent 75%) 0 0 / 40px 40px`. Animação `background-position 0 → 40px`, linear, infinita (7s faixa sob o hero, 9s no CTA). **Nunca dentro do logo.**
- Títulos: Barlow Condensed itálico 800, MAIÚSCULAS, `line-height ≈ 0.86–0.9`. Rótulos/dados: JetBrains Mono 13–15px, `letter-spacing 0.08–0.1em`. Texto: Barlow.
- Sem cantos arredondados em botões/cartões (estética de sinalização). Exceção: telefone e pinos.

### Logos (`public/brand/`)
- Header/footer do site: **símbolo cone + "VILASAFE"** (sem fita "FOZ DO ARELHO"). O SVG inline do cone está no HTML (viewBox 0 0 100 100, 4 paths); também em `brand/simbolo-cone.svg`.
- `brand/logo/vilasafe-logo-*.svg` — logo v2 completo (cone + VILASAFE + fita "FOZ DO ARELHO"), texto em contornos. Variantes: escuro, claro, branco, preto, sobre-laranja, símbolo. Usar no OG image / partilhas.
- `brand/simbolo-cone-animado.svg` — opcional (loader ou easter egg).

### Favicons / PWA (`public/`)
Colar no `<head>` (ou via `metadata` do Next): ver `design-reference/head-snippet.html`. Ficheiros: `favicon.ico`, `favicon.svg`, `favicon-16/32/48.png`, `apple-touch-icon.png`, `safari-pinned-tab.svg`, `manifest.webmanifest`, `icons/*`. `theme-color #0A0A0A`.

## 3. Assets de imagem (`public/media/`)

| Ficheiro | Uso |
|---|---|
| `app/mapa-ruas.jpg` | ecrã do telefone no hero; passo 05; camada "Ruas" |
| `app/mapa-sat.jpg` / `mapa-claro.jpg` / `mapa-escuro.jpg` | secção de estilos de mapa |
| `app/mapa-escuro.jpg` | também o disco de mapa da secção de gravidade |
| `app/home.jpg` | passo 03 (fronteira da freguesia) |
| `app/detalhe.jpg` | passo 04 (detalhe do reporte) |
| `ia/f000.jpg … f079.jpg` | 80 frames da IA a preencher título/descrição (passo 02), scrubbed pelo scroll |

Prints da app ~1063×2183. Frames IA são 416px de largura (algo fracos — substituir quando houver captura melhor). **Falta**: print do estilo de mapa "Terreno" (hoje aparece só o rótulo "+ TERRENO").

Usar `next/image` com `sizes` adequados; frames da IA podem ser `<img>` normais pré-carregados (troca de `src` por frame).

## 4. Estrutura da página (ordem)

Container: `max-width 1360px`, padding lateral `clamp(20px, 4vw, 48px)`. Separadores entre secções: `border-top 1px var(--line)`.

1. **Header** sticky — logo (cone 34px + VILASAFE 30px) · botão "TEMA CLARO/ESCURO" (mono 13px, borda `--line`) · CTA "Abrir a app" (fundo `#F7931E`, texto `#0A0A0A`, 700 15px).
2. **Hero** — grid 2 colunas (`auto-fit minmax(min(100%,480px),1fr)`).
   - Eyebrow mono "PROJETO CÍVICO · A FUNCIONAR NA FOZ DO ARELHO".
   - H1 em 3 linhas: "Viste um / buraco? / **Fica no mapa.**" (última em `--acc`), `clamp(64px, 9.4vw, 152px)`.
   - Parágrafo + botão "Ver a app na Foz do Arelho →" (fundo `--ink`) + nota "Independente. Sem ligação a câmara ou junta de freguesia."
   - Direita: **telefone 3D** (300×620, raio 48, ecrã inset 10px raio 38) com `mapa-ruas.jpg`, reflexo especular que segue a rotação, sombra no chão, cartão flutuante "MUITO GRAVE · Buraco profundo na estrada" em `translateZ(90px)`, e **6 anéis pulsantes** centrados nos pinos do mapa (posições exatas no HTML; animação `vsRing` scale 0.6→2.4, opacity 0.9→0, 2.6s, desfasados 0.45s).
3. **Faixa de fita** animada (22px).
4. **O problema** — secção 220vh com conteúdo sticky; texto grande cuja opacidade revela **palavra a palavra** com o scroll (0.16 → 1).
5. **Como se sinaliza (5 passos)** — telefone 3D sticky à direita (centro em mobile, acima do texto), passos de 100vh à esquerda. Badge laranja "01 / 05" no telefone. Por passo: troca de ecrã com fade 0.5s, o passo ativo a opacidade 1 e os outros 0.22, rotação do telefone interpolada entre `[rx, ry]`: `[6,-16] [4,14] [10,-10] [2,18] [8,-20]` (easeInOutCubic). No passo 02 os 80 frames da IA são percorridos com o scroll.
6. **Gravidade** — secção 620vh, sticky. Lista de 4 níveis (Grave, Muito Grave, Perigoso, Resolvido) + visual: disco de mapa (`mapa-escuro.jpg`, `rotateX(62deg)`, máscara radial) com um **pino grande** com o cone. Com o scroll a cor do pino interpola entre níveis, o pino sobe e desce (`sin(π·t)`·26px) em cada transição, o mapa faz pan/rotação por estado e volta à posição inicial em "Resolvido". Etiqueta mono no canto com o nome do nível. Scroll suavizado (lerp 0.06). Valores: rotação `[-16, 6, -8, 14]`, pan X `[-398,-503,-220,-398]`, pan Y `[-1083,-971,-1140,-1083]` (background-size 1600px).
7. **Estilos de mapa** — secção 380vh, sticky. Moldura `min(62vh,640px)`. 4 camadas empilhadas reveladas por `clip-path: inset(x% 0 0 0)` de baixo para cima, com uma **fita** (28px, rotação −4°) a varrer na linha de corte. Chips SATÉLITE / RUAS / CLARO / ESCURO / + TERRENO; chip ativo fundo `#F7931E`. Zoom ligeiro contínuo (`scale 1.02 → 1.14`).
8. **Sem loja. Sem conta.** — texto PWA + `<dl>` com Instalável, Notificações, Lista, Privacidade. Reveal on scroll.
9. **Para que fique claro** — fundo `#F7931E`, texto `#0A0A0A`. 4 pontos numerados do disclaimer (ver §6).
10. **Por dentro** — stack técnica em mono, duas colunas.
11. **CTA final** — "Vê como está a tua rua." + link gigante `fozdoarelho.vilasafe.pt →` entre duas fitas animadas (sentidos opostos) + nota "Por agora, só existe na Foz do Arelho…".
12. **Footer** — logo pequeno + "Projeto cívico independente · carácter informativo · 2026".

## 5. Comportamento

- **Tema**: default segue `prefers-color-scheme`; botão alterna; guardar escolha em `localStorage`. Transição `background-color/color .5s`. Evitar flash (script inline no `<head>` ou `next-themes`).
- **Tilt dos telefones**: segue o rato (±10° X, ±22° Y) + scroll, lerp 0.075, limites para **nunca mostrar a traseira** (rx −4…16, ry −30…22).
- **Reveal**: elementos `[data-reveal]` abaixo da dobra entram com `opacity 0→1`, `translateY 28px→0`, 0.9s `cubic-bezier(.2,.7,.2,1)`, com `data-delay` opcional. Os que já estão visíveis no load **não animam** (evita título invisível no primeiro render).
- **Progresso de secção sticky**: `p = clamp(-rect.top / (rect.height - innerHeight), 0, 1)`.
- Um único rAF loop para tudo; listeners `passive`.
- **Responsivo**: < 1000px secção de gravidade compacta (títulos menores, disco e pino escalados à altura disponível); < 860px telefone dos passos centrado e escalado (`min(0.78, innerHeight/980)`), texto dos passos alinhado em baixo com fundo `--bg`. Ver `layout()` no HTML para todos os valores.
- **`prefers-reduced-motion`**: sem animações/transições; tilt desligado; estados finais visíveis (palavras todas opacas, etc.). O conteúdo tem de continuar legível.
- Acessibilidade: landmarks, `aria-labelledby` nas secções, `alt` descritivos nas imagens (copiar do HTML), `focus-visible` com outline 3px `#F7931E`, contraste AA.

## 6. Regras de conteúdo (importante)

- A VilaSafe é **comunitária, informativa, sem vínculo a entidades oficiais**. **Não sugerir ligação à câmara/junta.**
- **Não resolve problemas** — sinaliza e dá visibilidade. "Resolvido" só regista que foi corrigido no terreno (não é confirmação oficial).
- Nenhum reporte é acusação ou crítica a pessoas/empresas/entidades. Cada reporte é um retrato do momento.
- Não usar cópia antiga do tipo "A câmara já recebeu o teu reporte".
- A IA (Google Gemini) **só sugere título e descrição** a partir da foto; o utilizador decide; se falhar, escreve à mão.

## 7. SEO / meta

- `<title>`: "VilaSafe — o mapa dos perigos da via pública, feito por quem lá vive"
- description: "Projeto cívico independente: um mapa público onde residentes sinalizam buracos, calçada partida e outros perigos na via pública. A funcionar na Foz do Arelho."
- OG image 1200×630: fundo `#0A0A0A`, logo v2 (`brand/logo/vilasafe-logo-escuro.svg`) + fita. Gerar com `next/og` ou exportar estático.

## 8. Pendentes

- Print do mapa "Terreno" (5.º estilo).
- Frames da IA em resolução maior.
- Email de contacto (opcional, para o footer).
- Domínio do site promocional (ex. `vilasafe.pt`).
