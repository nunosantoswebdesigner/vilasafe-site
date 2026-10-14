import { cn } from "@/lib/utils";

/** O cone isolado: três trapézios e uma base arredondada (viewBox 100×100). */
export function ConeIcon({
  size,
  className,
  fill = "#F7931E",
}: {
  size?: number | string;
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill={fill}
      aria-hidden="true"
      className={className}
    >
      <path d="M44 12Q50 3 56 12L62 32H38Z" />
      <path d="M35.2 42H64.8L69.5 58H30.5Z" />
      <path d="M27.6 68H72.4L76 82H24Z" />
      <rect x="10" y="80" width="80" height="10" rx="5" />
    </svg>
  );
}

/** Logótipo horizontal do produto: cone + VILASAFE, sem a tarja da vila. */
export function Logo({ size = "lg" }: { size?: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <span className={cn("flex items-center gap-2.5", lg && "max-[400px]:gap-2")}>
      <ConeIcon size={lg ? 34 : 24} className={lg ? "max-[400px]:size-7" : undefined} />
      <span
        className={cn(
          "font-display font-extrabold italic leading-none tracking-[-0.01em]",
          lg ? "text-[30px] max-[400px]:text-[23px]" : "text-[22px]",
        )}
      >
        VILASAFE
      </span>
    </span>
  );
}
