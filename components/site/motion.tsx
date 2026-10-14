"use client";

import { useEffect } from "react";
import { AI_FRAME_COUNT, MAP_ZONES, SEVERITY, aiFrame } from "./constants";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (x: string) => [1, 3, 5].map((j) => parseInt(x.slice(j, j + 2), 16));

/** Rotação do telefone dos passos, por passo: [rx, ry] */
const STORY_TILT: [number, number][] = [
  [6, -16],
  [4, 14],
  [10, -10],
  [2, 18],
  [8, -20],
];
const SEV_RGB = SEVERITY.map((s) => hex(s.color));

/** Progresso de uma secção sticky: 0 quando o topo chega ao topo do ecrã, 1 no fim. */
function progress(rect: DOMRect, vh: number) {
  const span = rect.height - vh;
  return clamp(span > 0 ? -rect.top / span : 0, 0, 1);
}

/**
 * Um único loop requestAnimationFrame que lê o scroll e o rato e escreve CSS custom
 * properties. Os componentes são HTML do servidor; este componente só os anima.
 * Com prefers-reduced-motion: sem tilt, sem lerp, sem reveals, estados finais visíveis.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduced ? 1 : 0.075;
    const tilt = !reduced;
    const mouse = { x: 0, y: 0 };
    const cur = { hrx: 6, hry: -16, srx: 6, sry: -14 };
    let sevS: number | null = null; // estado contínuo 0..3 (Grave → Resolvido), suavizado
    let sevV = 0; // velocidade da mola do estado
    let lastT = performance.now();
    let framesPreloaded = false;
    let raf = 0;
    let lastStep = -1;
    const frames = Array.from({ length: AI_FRAME_COUNT }, (_, i) => aiFrame(i));
    root.classList.add("motion-ready");

    // Referências aos elementos animados. Voltam a ser lidas se algum sair do DOM
    // (ex.: hot reload em desenvolvimento), para a animação nunca ficar presa.
    function collect() {
      const q = <T extends Element = HTMLElement>(s: string, from: ParentNode = document) =>
        from.querySelector<T>(s);
      const qa = (s: string, from?: ParentNode | null) =>
        from ? Array.from(from.querySelectorAll<HTMLElement>(s)) : [];
      const prob = q("[data-problem]");
      const story = q("[data-story]");
      const sev = q("[data-sev]");
      const maps = q("[data-maps]");
      return {
        hero: q('[data-phone="hero"]'),
        prob,
        words: qa("[data-word]", prob),
        story,
        screens: qa("[data-screen], [data-chip]", story),
        cards: [
          ...qa("[data-step]", story).map((li) => li.firstElementChild as HTMLElement),
          ...qa("[data-mcard]", story),
        ],
        mpanel: story ? q(".story-mpanel", story) : null,
        stepNum: story ? q("[data-stepnum]", story) : null,
        stepSegs: qa("[data-stepseg]", story),
        glare: story ? q("[data-storyglare]", story) : null,
        pop: story ? q("[data-storypop]", story) : null,
        aiImg: story ? q<HTMLImageElement>("[data-aiframe]", story) : null,
        sev,
        sevItems: qa("[data-sevitem]", sev),
        sevLabel: sev ? q("[data-sevlabel]", sev) : null,
        sevVis: sev ? q("[data-sevvis]", sev) : null,
        maps,
        mapLayers: qa("[data-maplayer]", maps),
        mapLabels: qa("[data-maplabel]", maps),
        mapTape: maps ? q("[data-maptape]", maps) : null,
      };
    }
    let el = collect();
    const isStale = () =>
      [el.hero, el.prob, el.story, el.sev, el.maps, el.stepNum, el.screens[0], el.cards[0]].some(
        (n) => n != null && !n.isConnected,
      );

    /** Reinicia uma animação CSS ligada a uma classe. */
    function replay(node: HTMLElement | null, cls: string) {
      if (!node || reduced) return;
      node.classList.remove(cls);
      void node.offsetWidth;
      node.classList.add(cls);
    }

    // Reveal: só os elementos abaixo da dobra começam escondidos, para o título
    // nunca ficar invisível no primeiro render (e sem JS, tudo fica visível).
    let pending: HTMLElement[] = [];
    if (!reduced) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (!innerHeight || el.getBoundingClientRect().top < innerHeight) return;
        const d = Number(el.dataset.delay || 0);
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition = `opacity .9s cubic-bezier(.2,.7,.2,1) ${d}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${d}ms`;
        pending.push(el);
      });
    }

    function layout() {
      const narrow = innerWidth < 860;
      if (narrow) {
        // Telemóvel: o texto fica fixo em baixo e o telefone é escalado e centrado na
        // vertical no espaço que sobra entre o cabeçalho e o texto.
        const stageH = (el.pop?.closest(".story-stage") as HTMLElement | null)?.clientHeight || innerHeight;
        const headerH = document.querySelector("header")?.offsetHeight ?? 72;
        // Altura do texto do painel (sem a faixa em degradê no topo, que pode passar por trás do telefone).
        const panelH = el.mpanel
          ? el.mpanel.offsetHeight - parseFloat(getComputedStyle(el.mpanel).paddingTop || "0")
          : 330;
        const avail = Math.max(0, stageH - headerH - panelH);
        const scale = clamp((avail - 44) / 620, 0.3, 0.8);
        root.style.setProperty("--phone-scale", scale.toFixed(4));
        if (el.pop) el.pop.style.marginTop = `${Math.round(headerH + (avail - 620 * scale) / 2)}px`;
      } else {
        root.style.setProperty("--phone-scale", String(Math.min(1, innerHeight / 760)));
        if (el.pop) el.pop.style.marginTop = "";
      }
      const visH = el.sevVis?.clientHeight ?? 600;
      root.style.setProperty("--sev-disc", clamp(visH / 640, 0.42, 1.05).toFixed(3));
    }

    function tick() {
      if (isStale()) {
        el = collect();
        lastStep = -1;
      }
      const { hero, prob, words, story, screens, cards, stepNum, stepSegs, glare, pop, aiImg } = el;
      const { sev, sevItems, sevLabel, maps, mapLayers, mapLabels, mapTape } = el;
      const now = performance.now();
      const dt = clamp((now - lastT) / 16.667, 0, 4);
      lastT = now;
      const vh = innerHeight || 0;
      const sy = vh ? scrollY / vh : 0;
      const visible = (r: DOMRect) => r.bottom > 0 && r.top < vh;

      if (pending.length) {
        pending = pending.filter((el) => {
          const b = el.getBoundingClientRect();
          if (!vh || (b.top < vh * 0.94 && b.bottom > 0)) {
            el.style.opacity = "1";
            el.style.transform = "none";
            return false;
          }
          return true;
        });
      }

      // Telefone do herói: rato + scroll, com limites para nunca mostrar a traseira.
      if (hero && visible(hero.getBoundingClientRect())) {
        const thx = tilt ? 6 - mouse.y * 10 + sy * 8 : 6;
        const thy = tilt ? -16 + mouse.x * 22 + sy * 14 : -16;
        cur.hrx += (clamp(thx, -4, 16) - cur.hrx) * k;
        cur.hry += (clamp(thy, -30, 22) - cur.hry) * k;
        root.style.setProperty("--hrx", cur.hrx.toFixed(2));
        root.style.setProperty("--hry", cur.hry.toFixed(2));
      }

      // O problema: palavra a palavra.
      if (prob) {
        const r = prob.getBoundingClientRect();
        if (visible(r) || reduced) {
          const p = reduced ? 1 : progress(r, vh);
          const n = words.length;
          words.forEach((w, i) => {
            const o = (0.16 + 0.84 * clamp(p * 1.35 * n - i, 0, 1)).toFixed(3);
            if (w.style.opacity !== o) w.style.opacity = o;
          });
        }
      }

      // Como se sinaliza: 5 passos.
      if (story) {
        const r = story.getBoundingClientRect();
        if (!framesPreloaded && r.top < vh * 2) {
          framesPreloaded = true;
          frames.forEach((src) => {
            const im = new Image();
            im.src = src;
          });
        }
        if (visible(r)) {
          const f = progress(r, vh) * 4;
          const step = clamp(Math.round(f), 0, 4);
          if (step !== lastStep) {
            screens.forEach((s) => {
              const i = Number(s.dataset.screen ?? s.dataset.chip);
              s.dataset.state = i === step ? "active" : i < step ? "before" : "after";
            });
            cards.forEach((c) => {
              const i = Number(c.dataset.mcard ?? (c.parentElement as HTMLElement).dataset.step);
              c.toggleAttribute("data-active", i === step);
            });
            stepSegs.forEach((s, i) => s.toggleAttribute("data-on", i <= step));
            if (stepNum) stepNum.style.transform = `translateY(${step * -18}px)`;
            // Reflexo e "assentar" do telefone só em mudanças feitas com scroll, não no arranque.
            if (lastStep !== -1) {
              replay(glare, "is-sweeping");
              replay(pop, "is-popping");
            }
            lastStep = step;
          }
          if (aiImg) {
            const local = clamp((f - 0.55) / 0.85, 0, 1);
            const src = frames[Math.round(local * (AI_FRAME_COUNT - 1))];
            if (aiImg.getAttribute("src") !== src) aiImg.setAttribute("src", src);
          }
          const lo = Math.floor(clamp(f, 0, 3.999));
          const a = STORY_TILT[lo];
          const b = STORY_TILT[Math.ceil(clamp(f, 0, 4))];
          const t = easeInOutCubic(f - lo);
          const tx = a[0] + (b[0] - a[0]) * t + (tilt ? -mouse.y * 4 : 0);
          const ty = a[1] + (b[1] - a[1]) * t + (tilt ? mouse.x * 6 : 0);
          cur.srx += (tx - cur.srx) * k;
          cur.sry += (ty - cur.sry) * k;
          root.style.setProperty("--srx", cur.srx.toFixed(2));
          root.style.setProperty("--sry", cur.sry.toFixed(2));
        }
      }

      // Gravidade: amarelo → laranja → vermelho → verde. O estado é contínuo e suavizado
      // no tempo (independente do fps); tudo o resto deriva dele, por isso nada salta.
      if (sev) {
        const r = sev.getBoundingClientRect();
        const f = clamp(progress(r, vh) * 3.5 - 0.15, 0, 3);
        const fi = Math.min(2, Math.floor(f));
        const target = f >= 3 ? 3 : fi + easeInOutSine(clamp((f - fi - 0.2) / 0.6, 0, 1));
        const on = visible(r);
        if (sevS == null || reduced || !on) {
          sevS = target;
          sevV = 0;
        } else {
          // Mola criticamente amortecida: acelera e trava sem solavancos, nunca ultrapassa.
          const w = 3.6; // rigidez (rad/s)
          const h = (dt * 16.667) / 1000;
          sevV += (w * w * (target - sevS) - 2 * w * sevV) * h;
          sevS = clamp(sevS + sevV * h, 0, 3);
        }
        if (on) {
          const s = sevS;
          const i = Math.min(2, Math.floor(s));
          const t = s - i;
          const A = MAP_ZONES[i];
          const B = MAP_ZONES[i + 1];
          const arc = Math.sin(Math.PI * t); // 0 nas paragens, 1 a meio da viagem
          const cA = SEV_RGB[i];
          const cB = SEV_RGB[i + 1];
          sev.style.setProperty("--sev", `rgb(${cA.map((v, j) => Math.round(lerp(v, cB[j], t))).join(",")})`);
          sev.style.setProperty("--sevX", lerp(A.x, B.x, t).toFixed(1));
          sev.style.setProperty("--sevY", lerp(A.y, B.y, t).toFixed(1));
          sev.style.setProperty("--sevRot", (lerp(A.rot, B.rot, t) + s * 2).toFixed(2));
          // A câmara afasta-se um pouco durante a viagem e volta a aproximar ao chegar.
          sev.style.setProperty("--sevZoom", (lerp(A.zoom, B.zoom, t) - arc * 0.16).toFixed(3));
          sev.style.setProperty("--sevLift", reduced ? "0" : arc.toFixed(3));
          sev.style.setProperty("--sevSquash", reduced ? "1" : (1 + arc * 0.05).toFixed(3));
          sev.style.setProperty("--sevBob", reduced ? "0" : (Math.sin(now / 650) * 4).toFixed(2));
          sev.style.setProperty("--sevPulse", reduced ? "1" : ((now / 2200) % 1).toFixed(3));
          const active = Math.round(s);
          if (sevLabel && sevLabel.textContent !== SEVERITY[active].label) {
            sevLabel.textContent = SEVERITY[active].label;
          }
          sevItems.forEach((item, j) => {
            const o = j === active ? "1" : "0.32";
            if (item.style.opacity !== o) item.style.opacity = o;
          });
        }
      }

      // Estilos de mapa: camadas reveladas de baixo para cima, fita na linha de corte.
      if (maps) {
        const r = maps.getBoundingClientRect();
        if (visible(r)) {
          const p = progress(r, vh);
          const t = p * 3.6 + 0.2;
          maps.style.setProperty("--mz", p.toFixed(3));
          // O corte é inclinado no mesmo ângulo da fita (-4°), para a fita o tapar de ponta a ponta.
          const frame = mapLayers[0]?.parentElement;
          const h = frame?.clientHeight ?? 0;
          const w = frame?.clientWidth ?? 0;
          const d = Math.tan((4 * Math.PI) / 180) * (w / 2); // desnível de cada ponta
          const zoom = 1.02 + p * 0.12; // as camadas estão escaladas a partir do centro
          let tapeY = -200;
          let active = 0;
          mapLayers.forEach((el, i) => {
            if (!i) return;
            const kk = easeInOutCubic(clamp(t - i + 0.4, 0, 1));
            if (kk > 0.5) active = i;
            if (kk >= 1) {
              el.style.clipPath = "none";
              return;
            }
            const ys = (1 - kk) * (h + 2 * d) - d; // linha de corte no ecrã (centro)
            const yl = h / 2 + (ys - h / 2) / zoom; // mesma linha nas coordenadas da camada
            el.style.clipPath = `polygon(0 ${(yl + d).toFixed(1)}px, 100% ${(yl - d).toFixed(1)}px, 100% 100%, 0 100%)`;
            if (kk > 0) tapeY = ys;
          });
          if (mapTape) {
            mapTape.style.transform = `translateY(${(tapeY - mapTape.offsetHeight / 2).toFixed(1)}px) rotate(-4deg)`;
          }
          mapLabels.forEach((el, i) => {
            el.toggleAttribute("data-active", i === active);
          });
        }
      }
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / innerWidth - 0.5;
      mouse.y = e.clientY / innerHeight - 0.5;
    };
    const onResize = () => {
      layout();
      tick();
    };

    layout();
    // As fontes mudam a altura do painel de texto no telemóvel: recalcula quando carregarem.
    document.fonts?.ready.then(() => layout());
    tick();
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("resize", onResize, { passive: true });
    addEventListener("scroll", tick, { passive: true });
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("motion-ready");
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      removeEventListener("scroll", tick);
    };
  }, []);

  return null;
}
