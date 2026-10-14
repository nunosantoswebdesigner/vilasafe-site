import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { Problem } from "@/components/site/problem";
import { Story } from "@/components/site/story";
import { Severity } from "@/components/site/severity";
import { MapStyles } from "@/components/site/map-styles";
import {
  Disclaimer,
  FinalCta,
  NoStore,
  SiteFooter,
} from "@/components/site/closing-sections";
import { Motion } from "@/components/site/motion";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="topo" className="overflow-x-clip">
        <Hero />
        {/* Fita de obra animada, devagar (ciclo de 7s) */}
        <div aria-hidden="true" className="tape h-[22px] animate-vs-tape" />
        <Problem />
        <Story />
        <Severity />
        <MapStyles />
        <NoStore />
        <Disclaimer />
        <FinalCta />
      </main>
      <SiteFooter />
      <Motion />
    </>
  );
}
