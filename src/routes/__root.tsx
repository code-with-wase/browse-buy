import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useNavigate, useRouterState,
  HeadContent, Scripts, type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store";
import { Header, Footer } from "@/components/site";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow">Error 404</div>
        <h1 className="mt-3 text-7xl text-gold-gradient">Lost in Style</h1>
        <p className="mt-4 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-gold mt-8">Back to Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="btn-outline">Go home</a>
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
      { title: "Deluxe Culture — Men's Wear" },
      { name: "description", content: "Premium men's fashion. Dress Like a Better You." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:site_name", content: "Deluxe Culture" },
      { property: "og:locale", content: "en_IN" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "IN-MH" },
      { name: "geo.placename", content: "Nanded, Maharashtra" },
      { name: "theme-color", content: "#0b0b0b" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "ClothingStore", "@id": "/#store", name: "Deluxe Culture", alternateName: ["DeluxeCulture", "Deluxe Culture Nanded"],
            description: "Deluxe Culture is a premium men's clothing store in Nanded, Maharashtra — shirts, blazers, denim, jackets, kurtas and accessories, with delivery across India.",
            slogan: "Dress Like a Better You.", url: "/", telephone: "+91-9130726736", priceRange: "₹₹",
            address: { "@type": "PostalAddress", addressLocality: "Nanded", addressRegion: "Maharashtra", addressCountry: "IN" },
            areaServed: [{ "@type": "City", name: "Nanded" }, { "@type": "State", name: "Maharashtra" }, { "@type": "Country", name: "India" }],
            paymentAccepted: "UPI, PhonePe, Cash on Delivery", currenciesAccepted: "INR",
            sameAs: ["https://wa.me/919130726736"] },
          { "@type": "WebSite", "@id": "/#website", name: "Deluxe Culture", url: "/",
            potentialAction: { "@type": "SearchAction", target: "/products?q={search_term_string}", "query-input": "required name=search_term_string" } },
        ],
      }),
    }],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap" },
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
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function AdminShortcut() {
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate({ to: "/admin" });
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [navigate]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <AdminShortcut />
        {!isAdmin && <Header />}
        <main key={path} className="animate-rise">
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
        <Toaster position="bottom-right" />
      </StoreProvider>
    </QueryClientProvider>
  );
}
