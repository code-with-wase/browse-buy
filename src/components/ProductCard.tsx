import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { discount, formatINR, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useBuyNow } from "@/lib/useBuyNow";

export function ProductCard({ p }: { p: Product }) {
  const { wishlist, toggleWish, addToCart } = useStore();
  const buyNow = useBuyNow();
  const wished = wishlist.includes(p.id);
  const out = p.stock <= 0;
  const item = { productId: p.id, size: p.sizes[Math.min(1, p.sizes.length - 1)], color: p.colors[0], qty: 1 };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-gold">
      <Link to="/products/$id" params={{ id: p.id }} className="relative block aspect-[4/5] overflow-hidden">
        <img src={p.images[0]} alt={p.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount(p) > 0 && <span className="rounded bg-gold-gradient px-2 py-0.5 text-[0.65rem] font-semibold text-primary-foreground">{discount(p)}% OFF</span>}
          {p.tags.includes("new") && <span className="rounded bg-background/80 px-2 py-0.5 text-[0.65rem] tracking-widest text-champagne">NEW</span>}
        </div>
        {out && <div className="absolute inset-0 grid place-items-center bg-background/70 text-xs tracking-[0.3em] text-champagne">SOLD OUT</div>}
      </Link>
      <button
        onClick={() => { toggleWish(p.id); toast(wished ? "Removed from wishlist" : "Added to wishlist"); }}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/70 backdrop-blur transition hover:scale-110"
      >
        <Heart className={`h-4 w-4 ${wished ? "animate-pop fill-primary text-primary" : ""}`} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3 fill-primary text-primary" />{p.rating}</div>
        <Link to="/products/$id" params={{ id: p.id }} className="mt-1 font-serif text-lg leading-tight hover:text-primary">{p.name}</Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-lg text-champagne">{formatINR(p.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(p.originalPrice)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-[0.65rem] text-muted-foreground">{p.sizes.slice(0, 5).map((s) => <span key={s} className="rounded border px-1.5 py-0.5">{s}</span>)}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button disabled={out} onClick={() => { addToCart(item); toast.success(`${p.name} added to cart`); }} className="flex items-center justify-center gap-1.5 rounded border border-primary/60 py-2 text-[0.65rem] tracking-widest uppercase text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-40">
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
          <button disabled={out} onClick={() => buyNow(item)} className="btn-gold gap-1.5 px-2 py-2 text-[0.65rem]">
            <Zap className="h-3.5 w-3.5" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
