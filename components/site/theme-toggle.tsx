"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Alterna entre tema claro e escuro e guarda a escolha. O ícone mostra a ação
 *  (via CSS em globals.css), por isso o HTML do servidor e o do cliente coincidem. */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("light") ? "dark" : "light";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem("vs-theme", next);
    } catch {}
  }

  return (
    <Button
      type="button"
      variant="tag"
      size="header-icon"
      onClick={toggle}
      aria-label="Alternar tema claro ou escuro"
    >
      <Sun className="theme-label-to-light size-[18px]" aria-hidden="true" />
      <Moon className="theme-label-to-dark size-[18px]" aria-hidden="true" />
    </Button>
  );
}
