import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE, OG_IMAGE_ALT } from "../lib/site";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GA_MEASUREMENT_ID, GSC_VERIFICATION, isAdminPath, trackPageview } from "../lib/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#dc2626" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: SITE_NAME },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
      ...(GSC_VERIFICATION
        ? [{ name: "google-site-verification", content: GSC_VERIFICATION }]
        : []),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1835156303958788",
        crossorigin: "anonymous",
      },
      ...(GA_MEASUREMENT_ID
        ? [
            {
              // Consent Mode v2 tem que ser declarado ANTES do gtag.js carregar,
              // ou a primeira leitura já sai sem o default aplicado.
              children: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  analytics_storage: 'denied',
                  wait_for_update: 500,
                });
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  send_page_view: false,
                  anonymize_ip: true,
                });
              `,
            },
            {
              async: true,
              src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

/**
 * Dispara page_view a cada navegação client-side. A primeira visita já é
 * medida pelo próprio gtag.js na carga inicial da página; este efeito cobre
 * as trocas de rota subsequentes, que são SPA e não recarregam o script.
 * Ignora rotas de /admin — ver isAdminPath em lib/analytics.
 */
function Analytics() {
  const router = useRouter();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    return router.subscribe("onResolved", () => {
      const { pathname, searchStr } = router.state.location;
      if (pathname === lastPath.current) return;
      lastPath.current = pathname;
      trackPageview(pathname, searchStr);
    });
  }, [router]);

  return null;
}
