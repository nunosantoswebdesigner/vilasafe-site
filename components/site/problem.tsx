const TEXT =
  "Hoje, quem vê um buraco liga, manda um email ou vai lá pessoalmente ás juntas. E nunca mais sabe o que aconteceu. Não fica registo.";

/** Texto revelado palavra a palavra com o scroll. Sem JS, as palavras ficam todas opacas. */
export function Problem() {
  const words = TEXT.split(" ");
  return (
    <section data-problem aria-labelledby="h-prob" className="relative h-[220vh]">
      <div className="sticky top-0 flex min-h-screen items-center">
        <div className="container-vs flex w-full flex-col gap-10 py-20">
          <h2
            id="h-prob"
            className="m-0 font-mono text-[13px] font-medium tracking-[0.1em] text-vs-muted"
          >
            O PROBLEMA
          </h2>
          <p className="m-0 max-w-[20em] font-display text-[clamp(40px,5.6vw,92px)] leading-none max-[859px]:text-[max(40px,min(14vw,7.4svh))] max-[859px]:leading-[0.98] font-bold uppercase italic text-pretty">
            {words.map((w, i) => (
              <span key={i} data-word>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
