import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductGrid } from "@/components/ProductCard";
import { SectionTitle } from "@/components/site";
import { discount, formatINR, SPEC_FIELDS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useBuyNow } from "@/lib/useBuyNow";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    try { const { getProductBySlug } = await import("@/axios/axiosInstance"); return { p: await getProductBySlug(params.id) }; }
    catch { return { p: null }; }
  },
  head: ({ loaderData }) => {
    const p = loaderData?.p;
    const t = p ? `${p.name} — Deluxe Culture` : "Product — Deluxe Culture";
    const d = p ? p.description : "Premium men's wear by Deluxe Culture.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, productsLoaded, addToCart, wishlist, toggleWish } = useStore();
  const buyNow = useBuyNow();
  const p = products.find((x) => x.id === id) ?? Route.useLoaderData().p ?? undefined;
  const ready = productsLoaded || !!p;
  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  useEffect(() => { if (p) { setSize(p.sizes[0] ?? ""); setColor(p.colors[0] ?? ""); setImg(0); setQty(1); } }, [p?.id]);

  if (!p) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-4xl">{ready ? "Product not found" : "Loading…"}</h1>
        {ready && <Link to="/products" className="btn-gold mt-6">Back to shop</Link>}
      </div>
    );
  }
  const item = { productId: p.id, size, color, qty };
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).concat(products.filter((x) => x.category !== p.category)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-muted-foreground"><Link to="/" className="hover:text-primary">Home</Link> / <Link to="/products" className="hover:text-primary">Shop</Link> / <span className="text-foreground">{p.name}</span></nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-2 sm:flex-col">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} className={`h-20 w-16 overflow-hidden rounded border-2 ${img === i ? "border-primary" : "border-transparent opacity-60"}`} aria-label={`Image ${i + 1}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div
            className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-lg border"
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <img src={p.images[img]} alt={p.name} width={800} height={1000} className="h-full w-full object-cover transition-transform duration-300" style={{ transform: zoom.on ? "scale(1.8)" : "scale(1)", transformOrigin: `${zoom.x}% ${zoom.y}%` }} />
          </div>
        </div>

        <div>
          <div className="eyebrow">{p.category}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-primary text-primary" />{p.rating} · Verified reviews</div>
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl text-champagne">{formatINR(p.price)}</span>
            <span className="text-muted-foreground line-through">{formatINR(p.originalPrice)}</span>
            <span className="rounded bg-gold-gradient px-2 py-0.5 text-xs font-semibold text-primary-foreground">{discount(p)}% OFF</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
          <p className="mt-6 leading-relaxed text-foreground/80">{p.description}</p>
          {!!p.highlights?.length && <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-foreground/80">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
          {SPEC_FIELDS.some(([k]) => p[k]) && (
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 rounded border p-4 text-sm">
              {SPEC_FIELDS.filter(([k]) => p[k]).map(([k, l]) => <div key={k} className="contents"><dt className="text-muted-foreground">{l}</dt><dd>{String(p[k])}</dd></div>)}
            </dl>
          )}

          <div className="mt-7">
            <div className="eyebrow mb-3">Size: <span className="text-foreground">{size}</span></div>
            <div className="flex flex-wrap gap-2">{p.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`min-w-12 rounded border px-3 py-2 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{s}</button>)}</div>
          </div>
          <div className="mt-6">
            <div className="eyebrow mb-3">Colour: <span className="text-foreground">{color}</span></div>
            <div className="flex flex-wrap gap-2">{p.colors.map((c) => <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-1.5 text-sm transition ${color === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{c}</button>)}</div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="eyebrow">Qty</div>
            <div className="flex items-center rounded border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} className="p-2.5" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <span className="text-xs text-success">Ready to order</span>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <button onClick={() => { addToCart(item); toast.success("Added to cart"); }} className="btn-outline disabled:opacity-40"><ShoppingBag className="h-4 w-4" />Add to Cart</button>
            <button onClick={() => buyNow(item)} className="btn-gold"><Zap className="h-4 w-4" />Buy Now</button>
            <button onClick={() => toggleWish(p.id)} className="btn-outline px-4" aria-label="Wishlist"><Heart className={`h-4 w-4 ${wishlist.includes(p.id) ? "fill-primary" : ""}`} /></button>
          </div>
          <div className="mt-6 flex items-center gap-2 rounded border bg-card p-4 text-sm text-muted-foreground"><Truck className="h-5 w-5 text-primary" />Delivery in 3–7 days · Easy 7-day returns · Sign-in with email needed only at purchase</div>
        </div>
      </div>

      <section className="mt-24">
        <SectionTitle eyebrow="Complete the Look" title="You May Also Like" />
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
