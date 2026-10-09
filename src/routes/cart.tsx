import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageHero } from "@/components/site";
import { formatINR } from "@/lib/data";
import { shippingFor, useStore } from "@/lib/store";
import { useProceedCheckout } from "@/lib/useBuyNow";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Deluxe Culture" },
      { name: "description", content: "Review the items in your shopping bag." },
      { property: "og:title", content: "Your Cart — Deluxe Culture" },
      { property: "og:description", content: "Review your Deluxe Culture shopping bag." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, products, updateQty, removeItem, settings, user } = useStore();
  const proceed = useProceedCheckout();
  const lines = cart.map((c, i) => ({ ...c, i, p: products.find((p) => p.id === c.productId) })).filter((l) => l.p);
  const subtotal = lines.reduce((a, l) => a + l.p!.price * l.qty, 0);
  const shipping = shippingFor(subtotal, settings);

  return (
    <>
      <PageHero eyebrow="Shopping Bag" title="Your Cart" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {!lines.length ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto h-14 w-14 text-primary" strokeWidth={1} />
            <h2 className="mt-5 text-3xl">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">Discover pieces made to elevate your wardrobe.</p>
            <Link to="/products" className="btn-gold mt-7">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.i} className="flex gap-4 rounded-lg border bg-card p-4">
                  <Link to="/products/$id" params={{ id: l.p!.id }} className="h-28 w-24 shrink-0 overflow-hidden rounded"><img src={l.p!.images[0]} alt={l.p!.name} className="h-full w-full object-cover" /></Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link to="/products/$id" params={{ id: l.p!.id }} className="font-serif text-xl hover:text-primary">{l.p!.name}</Link>
                      <button onClick={() => removeItem(l.i)} aria-label="Remove item" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="text-xs text-muted-foreground">Size {l.size} · {l.color}</div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <div className="flex items-center rounded border">
                        <button onClick={() => updateQty(l.i, l.qty - 1)} className="p-2" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-8 text-center text-sm">{l.qty}</span>
                        <button onClick={() => updateQty(l.i, l.qty + 1)} className="p-2" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <span className="text-champagne">{formatINR(l.p!.price * l.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-lg border bg-card p-6 lg:sticky lg:top-32">
              <h3 className="text-2xl">Order Summary</h3>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping ? formatINR(shipping) : "FREE"}</dd></div>
                {shipping > 0 && <p className="text-xs text-primary">Add {formatINR(settings.freeShippingAbove - subtotal)} more for free shipping</p>}
                <div className="flex justify-between border-t pt-3 text-lg"><dt>Total</dt><dd className="text-champagne">{formatINR(subtotal + shipping)}</dd></div>
              </dl>
              <button onClick={proceed} className="btn-gold mt-6 w-full">Proceed to Checkout</button>
              {!user && <p className="mt-3 text-center text-xs text-muted-foreground">You'll be asked to sign in with your email before buying.</p>}
              <Link to="/products" className="mt-4 block text-center text-xs tracking-widest text-primary uppercase">Continue Shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
