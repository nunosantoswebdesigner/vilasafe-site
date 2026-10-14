import { buttonVariants } from "@/components/ui/button";
import { Logo } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { APP_URL } from "./constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-vs-line bg-vs-bg transition-colors duration-500">
      <nav
        aria-label="Principal"
        className="container-vs flex items-center justify-between gap-4 py-3.5 max-[400px]:gap-2"
      >
        <a href="#topo" aria-label="Vila Safe, início" className="text-vs-ink no-underline">
          <Logo />
        </a>
        <div className="flex items-center gap-[clamp(8px,2vw,22px)]">
          <ThemeToggle />
          <a href={APP_URL} className={buttonVariants({ variant: "brand", size: "header" })}>
            Abrir a app <span aria-hidden="true" className="ml-2 max-[400px]:hidden">
              →
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}
