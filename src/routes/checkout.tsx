import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, QrCode, Smartphone, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { formatINR, type Order } from "@/lib/data";
import { shippingFor, useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Deluxe Culture" },
      { name: "description", content: "Complete your order securely." },
      { property: "og:title", content: "Checkout — Deluxe Culture" },
      { property: "og:description", content: "Complete your Deluxe Culture order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  address: z.string().trim().min(8, "Enter your full address").max(300),
  city: z.string().trim().min(2, "Enter city").max(60),
  state: z.string().trim().min(2, "Enter state").max(60),
  pin: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});
type Form = z.infer<typeof schema>;
const PAY = [
  { id: "UPI", label: "UPI", icon: Wallet, desc: "GPay, Paytm, any UPI app" },
  { id: "PhonePe", label: "PhonePe", icon: Smartphone, desc: "Pay via PhonePe" },
  { id: "QR", label: "Scan & Pay", icon: QrCode, desc: "Scan our QR code" },
];

function Checkout() {
  const { ready, user, checkout, cart, products, settings, addOrder, clearCart } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ name: "", mobile: "", email: "", address: "", city: "", state: "", pin: "" });
  const [err, setErr] = useState<Partial<Record<keyof Form, string>>>({});
  const [pay, setPay] = useState("UPI");
  const [placed, setPlaced] = useState<Order | null>(null);

  // Login required to buy
  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", search: { redirect: "/checkout" }, replace: true });
  }, [ready, user]);

  // Restore draft (non-sensitive address info kept in session only)
  useEffect(() => {
    try {
      const d = sessionStorage.getItem("dc_checkout_form");
      if (d) setForm(JSON.parse(d));
      else if (user) setForm((f) => ({ ...f, name: user.name, email: user.email }));
    } catch { /* ignore */ }
  }, [user]);
  useEffect(() => { try { sessionStorage.setItem("dc_checkout_form", JSON.stringify(form)); } catch { /* ignore */ } }, [form]);

  const source = checkout.mode === "buynow" ? [checkout.item] : cart;
  const lines = source.map((c) => ({ ...c, p: products.find((p) => p.id === c.productId) })).filter((l) => l.p);
  const subtotal = lines.reduce((a, l) => a + l.p!.price * l.qty, 0);
  const shipping = shippingFor(subtotal, settings);
  const total = subtotal + shipping;

  if (!ready || !user) return <div className="py-32 text-center text-muted-foreground">Loading…</div>;

  if (placed) {
    const msg = [
      `*New Order — ${settings.brand}*`, `Order Ref: ${placed.id}`, "",
      `*Customer*`, placed.customer.name, `📞 ${placed.customer.mobile}`, `✉️ ${placed.customer.email}`,
      `📍 ${placed.customer.address}, ${placed.customer.city}, ${placed.customer.state} - ${placed.customer.pin}`, "",
      `*Items*`, ...placed.items.map((i) => `• ${i.name} (${i.size}, ${i.color}) × ${i.qty} = ${formatINR(i.price * i.qty)}`), "",
      `Subtotal: ${formatINR(placed.subtotal)}`, `Shipping: ${placed.shipping ? formatINR(placed.shipping) : "FREE"}`, `*Total: ${formatINR(placed.total)}*`, "",
      `Payment: ${placed.payment} — Status: Pending verification`,
    ].join("\n");
    const wa = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" strokeWidth={1.2} />
        <h1 className="mt-5 text-4xl">Order Received</h1>
        <p className="mt-2 text-muted-foreground">Reference <span className="text-champagne">{placed.id}</span> · {formatINR(placed.total)}</p>
        <div className="mt-6 rounded-lg border bg-card p-5 text-left text-sm text-muted-foreground">
          Your payment is <b className="text-foreground">not yet verified</b>. Please complete the payment to <b className="text-champagne">{settings.upiId}</b> and send your order on WhatsApp so our team can confirm it. WhatsApp may ask you to press <b>Send</b>.
        </div>
        <a href={wa} target="_blank" rel="noreferrer" className="btn-gold mt-7"><MessageCircle className="h-4 w-4" />Send Order on WhatsApp</a>
        <Link to="/products" className="mt-5 block text-xs tracking-widest text-primary uppercase">Continue Shopping</Link>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="py-28 text-center">
        <h1 className="text-4xl">Nothing to checkout</h1>
        <Link to="/products" className="btn-gold mt-6">Browse products</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErr({});
    const order: Order = {
      id: "DC" + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      customer: r.data,
      items: lines.map((l) => ({ name: l.p!.name, size: l.size, color: l.color, qty: l.qty, price: l.p!.price })),
      subtotal, shipping, total, payment: pay, status: "Pending payment",
    };
    addOrder(order);
    if (checkout.mode === "cart") clearCart();
    sessionStorage.removeItem("dc_checkout_form");
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  const F = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={k === "address" ? "sm:col-span-2" : ""}>
      <label htmlFor={k} className="eyebrow">{label}</label>
      <input id={k} {...props} className="field mt-2" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!err[k]} />
      {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-2xl">Delivery Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {F("name", "Full name", { maxLength: 80 })}
              {F("mobile", "Mobile number", { inputMode: "numeric", maxLength: 10 })}
              {F("email", "Email", { type: "email", maxLength: 255 })}
              {F("pin", "PIN code", { inputMode: "numeric", maxLength: 6 })}
              {F("address", "Full address", { maxLength: 300 })}
              {F("city", "City", { maxLength: 60 })}
              {F("state", "State", { maxLength: 60 })}
            </div>
          </section>
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-2xl">Payment Method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {PAY.map((m) => (
                <button type="button" key={m.id} onClick={() => setPay(m.id)} className={`rounded-lg border p-4 text-left transition ${pay === m.id ? "border-primary bg-accent" : "hover:border-primary/60"}`}>
                  <m.icon className="h-6 w-6 text-primary" />
                  <div className="mt-2 font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-col items-center gap-4 rounded border p-5 sm:flex-row">
              {settings.qrImage ? <img src={settings.qrImage} alt="Payment QR" className="h-36 w-36 rounded bg-ivory object-contain p-1" /> : (
                <div className="grid h-36 w-36 shrink-0 place-items-center rounded border border-dashed text-center text-xs text-muted-foreground"><div><QrCode className="mx-auto mb-1 h-8 w-8" />QR coming soon</div></div>
              )}
              <div className="text-sm text-muted-foreground">
                Pay <b className="text-champagne">{formatINR(total)}</b> to UPI ID <b className="text-foreground">{settings.upiId}</b>. After placing the order, send it on WhatsApp — our team verifies payment manually before dispatch.
              </div>
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-lg border bg-card p-6 lg:sticky lg:top-32">
          <h3 className="text-2xl">Your Order</h3>
          <ul className="mt-4 space-y-3">
            {lines.map((l, i) => (
              <li key={i} className="flex gap-3">
                <img src={l.p!.images[0]} alt="" className="h-16 w-14 rounded object-cover" />
                <div className="flex-1 text-sm"><div>{l.p!.name}</div><div className="text-xs text-muted-foreground">{l.size} · {l.color} · ×{l.qty}</div></div>
                <div className="text-sm">{formatINR(l.p!.price * l.qty)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping ? formatINR(shipping) : "FREE"}</dd></div>
            <div className="flex justify-between border-t pt-3 text-lg"><dt>Total</dt><dd className="text-champagne">{formatINR(total)}</dd></div>
          </dl>
          <button className="btn-gold mt-6 w-full">Place Order</button>
        </aside>
      </form>
    </div>
  );
}
