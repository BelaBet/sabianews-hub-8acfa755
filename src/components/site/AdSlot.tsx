import { useEffect, useRef } from "react";

type AdFormat = "leaderboard" | "rectangle" | "halfpage" | "mobile-banner" | "in-article";

// Reserved heights per breakpoint to eliminate Cumulative Layout Shift.
// Mobile-first: every slot has a fixed min-height on small screens.
const FORMAT_STYLES: Record<AdFormat, string> = {
  // 728x90 desktop, 320x100 mobile
  leaderboard: "min-h-[100px] sm:min-h-[90px] md:min-h-[90px] max-w-[728px] mx-auto w-full",
  // 300x250 fixed
  rectangle: "min-h-[250px] max-w-[300px] mx-auto w-full",
  // 300x600 desktop, 300x250 mobile
  halfpage: "min-h-[250px] md:min-h-[600px] max-w-[300px] mx-auto w-full",
  // 320x100
  "mobile-banner": "min-h-[100px] max-w-[320px] mx-auto w-full",
  // fluid in-article: reserve ~280px on mobile, 250px desktop
  "in-article": "min-h-[280px] sm:min-h-[250px] w-full",
};

interface AdSlotProps {
  format?: AdFormat;
  slot?: string;
  label?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT_ID = "ca-pub-1835156303958788";

export function AdSlot({
  format = "in-article",
  slot,
  label = "Publicidade",
  className = "",
}: AdSlotProps) {
  const ref = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn("[AdSlot] push failed:", err);
    }
  }, [slot]);

  // Sem `slot` configurado não há anúncio para servir: não renderizamos nada.
  // O placeholder tracejado antigo aparecia em todas as páginas e deixava o
  // site com cara de rascunho — e reserva de espaço vazio não evita CLS, só cria.
  if (!slot) return null;

  return (
    <div
      role="complementary"
      aria-label={label}
      className={`my-8 flex flex-col items-center justify-center gap-1 ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-ink-soft/70">
        {label}
      </span>
      <div
        className={`relative w-full overflow-hidden rounded-md bg-surface-alt ${FORMAT_STYLES[format]}`}
      >
        <ins
          ref={ref}
          className="adsbygoogle block w-full h-full"
          style={{ display: "block" }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
