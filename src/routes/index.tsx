import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gem, RotateCcw, ShieldCheck, Truck, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { discount, formatINR, type Product } from "@/lib/data";
import { useBuyNow } from "@/lib/useBuyNow";
import { toast } from "sonner";
import { z } from "zod";
import hero from "@/assets/hero.webp";
import promo from "@/assets/p4.webp";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal, SectionTitle } from "@/components/site";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deluxe Culture — Best Men's Clothing Store in Nanded | Premium Menswear" },
      { name: "description", content: "Deluxe Culture is the best men's clothing store in Nanded. Shop premium shirts, blazers, jeans, jackets, kurtas & accessories online with Cash on Delivery across India." },
      { name: "keywords", content: "Deluxe Culture, best clothing store in Nanded, men's clothing store Nanded, menswear Nanded, shirts in Nanded, blazers Nanded, kurta shop Nanded, branded clothes Nanded, online men's fashion India" },
      { property: "og:title", content: "Deluxe Culture — Best Men's Clothing Store in Nanded" },
      { property: "og:description", content: "Premium menswear from Nanded, delivered across India. Dress Like a Better You." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { products, categories, settings } = useStore();
  const by = (t: "trending" | "new" | "best") => products.filter((p) => p.tags.includes(t)).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <img src={hero} fetchPriority="high" decoding="async" alt="Man in black tailored suit" width={1600} height={1008} className="animate-slowzoom absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
          <div className="max-w-xl animate-rise">
            <div className="eyebrow">New Season · Collection 2026</div>
            <h1 className="mt-5 text-5xl leading-[1.05] sm:text-7xl">
              <span className="text-gold-gradient">{settings.heroTitle}</span>
            </h1>
            <p className="mt-6 text-base text-foreground/75 sm:text-lg">{settings.heroSubtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/products" className="btn-gold">Shop Collection <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/about" className="btn-outline">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="Curated" title="Shop by Category" />
        <div className="flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 60} className="w-36 shrink-0 snap-start sm:w-auto">
              <Link to="/products" search={{ cat: c.id }} className="group block text-center">
                <div className="aspect-square overflow-hidden rounded-full border-2 border-primary/30 transition group-hover:border-primary">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="mt-3 text-xs tracking-[0.2em] uppercase group-hover:text-primary">{c.name}</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <TrendingCarousel items={products.filter((p) => p.tags.includes("trending"))} />

      {/* PROMO */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="relative grid overflow-hidden rounded-lg border bg-card md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-14">
              <div className="eyebrow">Limited Offer</div>
              <h2 className="mt-4 text-4xl sm:text-5xl">Up to <span className="text-gold-gradient">45% Off</span> on Outerwear</h2>
              <p className="mt-4 text-muted-foreground">Leather jackets and blazers built for the season. While stocks last.</p>
              <Link to="/products" search={{ cat: "jackets" }} className="btn-gold mt-8 self-start">Shop the Sale</Link>
            </div>
            <img src={promo} alt="Leather jacket promotion" loading="lazy" className="h-72 w-full object-cover md:h-full" />
          </div>
        </Reveal>
      </section>

      <ProductRow eyebrow="Just Landed" title="New Arrivals" items={by("new")} />
      <ProductRow eyebrow="Customer Favourites" title="Best Sellers" items={by("best")} />

      {/* BENEFITS */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 md:grid-cols-4">
          {[
            [Truck, "Free Shipping", `On orders above ₹${settings.freeShippingAbove}`],
            [RotateCcw, "Easy Returns", "7-day hassle-free returns"],
            [ShieldCheck, "Secure Payments", "UPI, PhonePe & QR"],
            [Gem, "Premium Quality", "Crafted from finest fabrics"],
          ].map(([Icon, t, d], i) => {
            const I = Icon as typeof Truck;
            return (
              <Reveal key={t as string} delay={i * 80} className="text-center">
                <I className="mx-auto h-8 w-8 text-primary" strokeWidth={1.2} />
                <div className="mt-3 font-serif text-xl">{t as string}</div>
                <div className="mt-1 text-xs text-muted-foreground">{d as string}</div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="Testimonials" title="Worn by Gentlemen" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Arjun M.", "Mumbai", "The leather jacket feels twice the price. Fit was perfect and delivery came in 3 days."],
            ["Rahul S.", "Pune", "Ordered the Sahara blazer for a wedding — got compliments all night. Packaging was pure luxury."],
            ["Imran K.", "Hyderabad", "Finally an Indian brand that gets premium menswear right. Ordering through WhatsApp was super easy."],
          ].map(([n, c, t], i) => (
            <Reveal key={n} delay={i * 100}>
              <figure className="h-full rounded-lg border bg-card p-7">
                <Quote className="h-6 w-6 text-primary" />
                <blockquote className="mt-4 font-serif text-xl italic leading-snug">"{t}"</blockquote>
                <figcaption className="mt-5 text-xs tracking-[0.2em] uppercase text-muted-foreground">{n} · {c}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function ProductRow({ eyebrow, title, items }: { eyebrow: string; title: string; items: ReturnType<typeof useStore>["products"] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <Reveal><ProductGrid products={items} /></Reveal>
      <div className="mt-10 text-center"><Link to="/products" className="btn-outline">View All</Link></div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-3xl px-4 text-center">
      <Reveal>
        <div className="eyebrow">The Inner Circle</div>
        <h2 className="mt-3 text-4xl">Join for Early Access</h2>
        <p className="mt-3 text-sm text-muted-foreground">New drops, private sales and style notes. No spam.</p>
        <form
          className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!z.string().email().safeParse(email.trim()).success) return void toast.error("Please enter a valid email");
            toast.success("Welcome to the Inner Circle!");
            setEmail("");
          }}
        >
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" aria-label="Email" className="field" maxLength={255} />
          <button className="btn-gold shrink-0">Subscribe</button>
        </form>
      </Reveal>
    </section>
  );
}

function TrendingCarousel({ items }: { items: Product[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const buyNow = useBuyNow();
  const n = items.length;
  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [paused, n]);
  if (!n) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <SectionTitle eyebrow="Most Wanted" title="Trending Now" />
      <div className="relative h-[520px] overflow-hidden rounded-lg border bg-card sm:h-[460px]">
        {items.map((p, k) => {
          const active = k === i;
          return (
            <div key={p.id} aria-hidden={!active} className={`absolute inset-0 grid transition-all duration-[1200ms] ease-out md:grid-cols-2 ${active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}>
              <div className="relative h-64 overflow-hidden md:h-full">
                <img src={p.images[0]} alt={p.name} loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${active ? "scale-100" : "scale-125"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:bg-gradient-to-l" />
              </div>
              <div className={`flex flex-col justify-center p-6 transition-all delay-300 duration-1000 sm:p-12 ${active ? "translate-x-0 opacity-100 blur-0" : "translate-x-10 opacity-0 blur-sm"}`}>
                <div className="eyebrow">Trending #{k + 1}</div>
                <h3 className="mt-3 text-4xl sm:text-5xl"><span className="text-gold-gradient">{p.name}</span></h3>
                <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-2xl text-champagne">{formatINR(p.price)}</span>
                  <span className="text-sm text-muted-foreground line-through">{formatINR(p.originalPrice)}</span>
                  {discount(p) > 0 && <span className="rounded bg-gold-gradient px-2 py-0.5 text-xs text-primary-foreground">{discount(p)}% OFF</span>}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => buyNow({ productId: p.id, size: p.sizes[Math.min(1, p.sizes.length - 1)] ?? "", color: p.colors[0] ?? "", qty: 1 })} className="btn-gold">Buy Now</button>
                  <Link to="/products/$id" params={{ id: p.id }} className="btn-outline">View Details</Link>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 top-32 z-20 grid h-10 w-10 place-items-center rounded-full border bg-background/70 backdrop-blur transition hover:scale-110 hover:border-primary md:top-1/2 md:-translate-y-1/2"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 top-32 z-20 grid h-10 w-10 place-items-center rounded-full border bg-background/70 backdrop-blur transition hover:scale-110 hover:border-primary md:top-1/2 md:-translate-y-1/2"><ChevronRight className="h-5 w-5" /></button>
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {items.map((p, k) => <button key={p.id} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-8 bg-primary" : "w-3 bg-muted-foreground/40"}`} />)}
        </div>
      </div>
    </section>
  );
}
