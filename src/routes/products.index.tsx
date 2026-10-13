import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ProductGrid } from "@/components/ProductCard";
import { PageHero } from "@/components/site";
import { formatINR } from "@/lib/data";
import { useStore } from "@/lib/store";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  wish: z.boolean().optional(),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop Men's Clothing Online — Shirts, Blazers, Jeans | Deluxe Culture Nanded" },
      { name: "description", content: "Shop men's shirts, blazers, jeans, jackets, kurtas and accessories from Deluxe Culture, Nanded. Cash on Delivery and UPI across India." },
      { property: "og:title", content: "Shop Men's Collection — Deluxe Culture" },
      { property: "og:description", content: "Premium menswear with genuine discounts and free shipping above ₹1,999." },
    ],
  }),
  component: Products,
});

const PRICE = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u1500", label: "Under ₹1,500", min: 0, max: 1499 },
  { id: "1500-3500", label: "₹1,500 – ₹3,500", min: 1500, max: 3500 },
  { id: "3500+", label: "Above ₹3,500", min: 3501, max: Infinity },
];

function Products() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/products/" });
  const { products, categories, wishlist } = useStore();
  const [q, setQ] = useState(search.q ?? "");
  const [price, setPrice] = useState("all");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const [drawer, setDrawer] = useState(false);
  const cat = search.cat ?? "all";

  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes))], [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))], [products]);

  const list = useMemo(() => {
    const pr = PRICE.find((x) => x.id === price)!;
    const term = (search.q ?? q).toLowerCase().trim();
    let r = products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (!search.wish || wishlist.includes(p.id)) &&
      (!term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)) &&
      p.price >= pr.min && p.price <= pr.max &&
      (!sizes.length || p.sizes.some((s) => sizes.includes(s))) &&
      (!colors.length || p.colors.some((c) => colors.includes(c))));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "discount") r = [...r].sort((a, b) => b.originalPrice - b.price - (a.originalPrice - a.price));
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [products, cat, q, search.q, search.wish, wishlist, price, sizes, colors, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setPrice("all"); setSizes([]); setColors([]); setQ(""); navigate({ search: {} }); };

  const Filters = (
    <div className="space-y-8">
      <div>
        <div className="eyebrow mb-3">Category</div>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
          {[{ id: "all", name: "All" }, ...categories].map((c) => (
            <button key={c.id} onClick={() => navigate({ search: (s) => ({ ...s, cat: c.id === "all" ? undefined : c.id }) })} className={`text-sm transition hover:text-primary ${cat === c.id ? "text-primary" : "text-muted-foreground"}`}>{c.name}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow mb-3">Price</div>
        {PRICE.map((p) => (
          <label key={p.id} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-muted-foreground">
            <input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} className="accent-primary" />{p.label}
          </label>
        ))}
      </div>
      <div>
        <div className="eyebrow mb-3">Size</div>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => <button key={s} onClick={() => toggle(sizes, setSizes, s)} className={`min-w-10 rounded border px-2 py-1 text-xs ${sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : ""}`}>{s}</button>)}
        </div>
      </div>
      <div>
        <div className="eyebrow mb-3">Colour</div>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => <button key={c} onClick={() => toggle(colors, setColors, c)} className={`rounded-full border px-3 py-1 text-xs ${colors.includes(c) ? "border-primary bg-primary text-primary-foreground" : ""}`}>{c}</button>)}
        </div>
      </div>
      <button onClick={reset} className="text-xs tracking-widest text-primary uppercase underline">Clear all filters</button>
    </div>
  );

  return (
    <>
      <PageHero eyebrow="The Collection" title={search.wish ? "Your Wishlist" : "Shop Men's Wear"} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input value={q} onChange={(e) => { setQ(e.target.value); if (search.q) navigate({ search: (s) => ({ ...s, q: undefined }) }); }} placeholder="Search products…" className="field sm:max-w-xs" aria-label="Search" />
          <div className="flex items-center gap-2">
            <button onClick={() => setDrawer(true)} className="btn-outline px-4 py-2 lg:hidden"><SlidersHorizontal className="h-4 w-4" />Filters</button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field w-auto py-2 text-sm" aria-label="Sort">
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">{Filters}</aside>
          <div>
            <p className="mb-4 text-xs text-muted-foreground">{list.length} products · prices from {formatINR(Math.min(...products.map((p) => p.price)))}</p>
            {list.length ? <ProductGrid products={list} /> : (
              <div className="rounded-lg border bg-card py-20 text-center">
                <h3 className="text-2xl">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
                <button onClick={reset} className="btn-gold mt-6">Reset filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? "" : "pointer-events-none"}`}>
        <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-background/70 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto border-r bg-card p-6 transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-6 flex items-center justify-between"><h3 className="text-2xl">Filters</h3><button onClick={() => setDrawer(false)} aria-label="Close filters"><X /></button></div>
          {Filters}
          <button onClick={() => setDrawer(false)} className="btn-gold mt-8 w-full">Show {list.length} results</button>
        </aside>
      </div>
    </>
  );
}
