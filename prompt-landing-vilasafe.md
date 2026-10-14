# Brief: landing page de apresentação do VilaSafe

## Antes de escreveres uma linha de código

1. **Lê primeiro os ficheiros de design que já criaste para o projeto VilaSafe.** Eles são a
   referência mandatória para tipografia, espaçamento, componentes e linguagem visual.
   Este documento complementa-os com factos verificados no código-fonte da app; onde
   houver conflito, os teus ficheiros de design mandam no estilo, e este documento manda
   nos factos do produto.
2. Se não encontrares esses ficheiros, diz-me antes de avançar. Não inventes a identidade.

---

## 1. Objetivo

Uma **landing page única**, de apresentação do produto, para publicar em `vilasafe.pt`.

Contexto do domínio, que é importante entender:

- `vilasafe.pt` → **esta página**. Apresenta o produto. Não é a aplicação.
- `fozdoarelho.vilasafe.pt` → a aplicação real, já em produção, para a freguesia de Foz do Arelho.
- Outras vilas ficarão em subdomínios próprios, no futuro.

A página serve para alguém — um residente curioso, ou alguém de uma junta de freguesia —
entender em trinta segundos o que o VilaSafe é, ver a app a funcionar, e seguir para a
instância da Foz do Arelho.

## 2. Restrições absolutas

- **Uma só página.** Sem rotas adicionais, sem blog, sem páginas legais.
- **Sem formulários.** Nenhum. Sem campos de email, sem newsletter, sem contacto.
  Se for preciso contacto, é uma ligação `mailto:` em texto, nada mais.
- **Sem backend, sem base de dados, sem autenticação.** Página estática.
- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS 4** + **shadcn/ui**.
- **pnpm** como gestor de pacotes (o projeto principal usa pnpm; mantém a coerência).
- Português de Portugal em todo o conteúdo visível.
- Tema claro e escuro, ambos tratados a sério — não é o claro com os mesmos valores invertidos.

## 3. Identidade — factos verificados no código da app

Usa estes valores como verdade. Foram lidos do código em produção, não são sugestões.

### Cores

| Papel | Valor |
|---|---|
| Laranja da marca | `#F7931E` |
| Preto / fundo escuro | `#0A0A0A` |
| Fundo claro | branco puro |
| Gravidade "Grave" | `#EAB308` amarelo |
| Gravidade "Muito Grave" | `#F97316` laranja |
| Gravidade "Perigoso" | vermelho |
| Estado "Resolvido" | `#22C55E` verde |

### Tipografia

**Geist** e **Geist Mono** (via `next/font/google`). A marca escreve-se `VILASAFE` em
maiúsculas, peso extrabold, **itálico**, com `tracking` apertado. Esse itálico é
característico — não o troques por um peso normal.

### Marca

- Logótipo horizontal: cone de sinalização laranja + palavra `VILASAFE` + tarja
  `FOZ DO ARELHO`. Para esta página, a tarja da vila deve sair ou ser substituída,
  porque a página é do produto e não de uma vila.
- Ícone isolado: o cone, construído com formas geométricas simples (três trapézios e
  uma base arredondada), em `#F7931E`.

### Motivo gráfico assinatura

A app usa uma **faixa de fita de sinalização** — barras diagonais laranja a 45°, com
intervalos transparentes que mostram o fundo do tema — como elemento de carregamento.
É o elemento visual mais distintivo da marca e **deve aparecer nesta página**. Em CSS
puro faz-se com `repeating-linear-gradient` ou um `linear-gradient` com
`background-size` fixo, animável por `background-position` para dar movimento contínuo.

Usa-o com parcimónia: como divisor entre secções, como moldura de um elemento, ou como
transição. Não o espalhes por toda a página — perde a força.

## 4. Personalidade visual

O território do VilaSafe é **sinalização de obra pública e utilidade cívica**: cones,
fita de obra, placas de trânsito, estêncil, alto contraste, informação clara. Não é
tecnologia brilhante nem startup de produtividade.

Procura um registo **editorial e tipográfico**: títulos grandes e confiantes, muito
contraste, composições assimétricas, espaço negativo usado de propósito. Pensa mais em
sinalética e em imprensa do que em dashboard de SaaS.

### Proibido — e isto é um requisito, não uma preferência

O cliente foi explícito: **não quer uma página com cara de página gerada por IA.**
Evita, concretamente:

- **Emojis.** Zero. Nem nos títulos, nem nas listas, nem nos cartões de funcionalidades.
- Ícones de brilhos, varinhas mágicas, foguetões, raios.
- Manchas de gradiente coloridas e desfocadas no fundo (os "blobs" roxos e azuis).
- Vidro desfocado aplicado sem razão em tudo.
- A estrutura genérica: herói centrado → três cartões iguais → "como funciona" em três
  passos → testemunhos inventados → logótipos de empresas → chamada final.
- Texto de marketing vazio e intercambiável: "revoluciona", "sem esforço", "poder da IA",
  "o futuro de...". Escreve como se estivesses a explicar a um vizinho.
- Números inventados. **Não há métricas públicas** — nada de "10.000 problemas resolvidos".
- Testemunhos fictícios. Se não há citações reais, não há secção de citações.

Prefere personalidade a polimento genérico. Uma página com uma ideia forte e bem
executada vale mais do que oito secções corretas e anónimas.

## 5. Animação

A página deve ter movimento, mas com intenção.

- Animações **ligadas ao scroll** para revelar conteúdo, com deslocamentos curtos e
  curvas de aceleração naturais. Nada de elementos a saltar ou a rodar sem razão.
- A faixa de sinalização pode correr em contínuo, devagar. **Devagar** — numa primeira
  versão da app isto ficou demasiado rápido e pareceu nervoso; um ciclo de vários
  segundos lê-se muito melhor.
- Transições entre estados dos marcadores de gravidade (amarelo → laranja → vermelho →
  verde) são uma boa oportunidade de animação com significado: contam a história de um
  problema a ser resolvido.
- **Respeita `prefers-reduced-motion`.** Com a preferência ativa, o conteúdo aparece
  estático e legível, sem animação nenhuma. Não é opcional.
- Nada de animação a bloquear a leitura: o texto tem de estar legível mesmo que o
  JavaScript falhe.

## 6. A animação 3D do telemóvel

O pedido é um telemóvel em 3D com a app aberta, idealmente com movimento.

**Abordagem recomendada, por ordem de preferência:**

1. **React Three Fiber** (`@react-three/fiber` + `@react-three/drei`) com um telemóvel
   geométrico simples — um paralelepípedo arredondado com um plano de ecrã — e uma
   textura ou um `Html` com capturas reais da app. Rotação suave ligada ao scroll ou ao
   movimento do rato, com limites: o telemóvel nunca deve ficar de costas nem em ângulos
   em que o ecrã não se leia.
2. **Se o 3D ficar pesado ou instável**, faz uma versão em **CSS 3D** (`perspective` +
   `rotateY`/`rotateX` + camadas com parallax). Fica convincente, pesa uma fração, e não
   adiciona dependências. Prefere isto a um 3D mal resolvido.

**Obrigatório em qualquer dos casos:**

- Carregamento **lazy**, fora do bundle inicial (`next/dynamic` com `ssr: false`).
- Um **substituto estático** — uma imagem do telemóvel — para quando o 3D não carrega,
  para `prefers-reduced-motion` e para o primeiro render.
- O ecrã dentro do telemóvel deve mostrar o **mapa real da app**, com os marcadores
  coloridos por gravidade. É o que vende o produto. Se não tiveres capturas, deixa um
  marcador claro no código a dizer onde entram e pede-as.

## 7. Conteúdo — factos reais do produto

Usa isto como matéria-prima. Está tudo verificado; não acrescentes funcionalidades.

### O problema

Quem vê um buraco na estrada hoje liga à junta, manda um email ou vai lá
pessoalmente — e nunca mais sabe o que aconteceu. Não há registo público, não há
acompanhamento, e o problema seguinte repete o processo todo.

### O que a app faz

- **Mapa público** com todos os problemas aprovados da freguesia, em cinco estilos
  alternáveis: ruas, satélite, terreno, claro e escuro.
- **Reportar com foto**, tirada na hora pela câmara ou escolhida da galeria. A imagem é
  comprimida no browser antes de ser enviada.
- **Localização por GPS** ou escolha manual do ponto no mapa.
- **Validação geográfica real:** a app conhece as fronteiras da freguesia e **recusa**
  reportes de fora da área. A fronteira é desenhada no mapa.
- **Preenchimento assistido por IA:** analisa a foto e sugere título e descrição em
  português, em cerca de um segundo. A pessoa vê a sugestão e decide se a usa. Se a IA
  falhar ou demorar, o formulário convida a escrever à mão e nunca bloqueia o reporte.
- **Três níveis de gravidade:** Grave (atenção recomendada), Muito Grave (requer atenção
  urgente), Perigoso (perigo iminente). Mais o estado Resolvido.
- **Moderação humana:** nada vai direto para o mapa. Cada reporte entra como pendente e
  um moderador aprova ou rejeita.
- **Notificações no telemóvel** quando um problema novo é aprovado e quando um problema
  é marcado como resolvido.
- **Lista alternativa ao mapa**, com filtro por gravidade e secção própria para os
  problemas já resolvidos.
- **Instalável como app** no telemóvel, direta do browser, sem passar por loja.

### Stack, se quiseres uma secção técnica

Next.js 16, React 19, TypeScript, Tailwind 4, shadcn/ui, Supabase (Postgres + Storage),
Mapbox GL JS, Turf.js para o cálculo geoespacial, Google Gemini para a visão por
computador, Resend para email, Web Push com VAPID. Alojamento na Vercel.

Uma secção técnica discreta é um bom diferenciador face a páginas de produto vazias —
mas mantém-na sóbria, sem transformar a página num currículo.

### Chamada à ação

Sem formulários, a ação possível é **ver a app a funcionar**:
`https://fozdoarelho.vilasafe.pt`. Deixa isso claro e acessível, sem repetir o botão
cinco vezes ao longo da página.

## 8. Rigor — o que não pode ser dito

Isto protege o cliente, não é burocracia:

- **Não é uma app oficial de nenhuma câmara nem junta de freguesia.** É um projeto
  independente. Não prometas que a autarquia vai reparar nada, nem dês prazos.
- "Resolvido" significa que um moderador o marcou como tal, **não** que exista
  confirmação oficial de reparação.
- A IA **sugere**, não decide, e às vezes erra. Não escrevas "a IA identifica o problema
  automaticamente".
- **Não existe nas lojas de aplicações.** Instala-se a partir do browser.
- **Não há contas nem registo.** Quem reporta deixa nome e email só para a moderação.
- Cobertura atual: **apenas Foz do Arelho.** Outras vilas são um plano, não um facto.
- Zero números de utilizadores, reportes ou resoluções. Não há dados públicos.

## 9. Qualidade técnica

- **Acessibilidade:** contraste conforme WCAG AA nos dois temas, foco visível,
  navegação por teclado, uma hierarquia de títulos coerente, texto alternativo em todas
  as imagens com conteúdo.
- **Performance:** a página tem de abrir depressa num telemóvel com rede fraca — é esse
  o público. O 3D não entra no caminho crítico. Imagens otimizadas via `next/image`.
- **Responsivo a partir do telemóvel**, não um desktop encolhido. A maioria das visitas
  será em telemóvel.
- **Metadados:** título, descrição e Open Graph próprios, apontados a `vilasafe.pt`.
  Atenção: a app vive no subdomínio e tem os seus próprios metadados — esta página não
  deve reclamar o conteúdo da app nem competir com ele nos motores de busca.

## 10. O que entregar

1. O projeto Next.js completo, a correr com `pnpm dev`.
2. A landing page numa só rota.
3. O componente do telemóvel 3D isolado e com carregamento lazy, com o seu substituto
   estático.
4. Uma nota curta a explicar as decisões de design que tomaste e porquê — sobretudo onde
   te desviaste deste brief, e por que razão.
5. Uma lista do que ficou a precisar de material meu (capturas de ecrã da app, fotos,
   etc.), se for o caso.

Se alguma coisa aqui colidir com os ficheiros de design que já tens para o VilaSafe,
segue os ficheiros de design e diz-me onde está o conflito.
