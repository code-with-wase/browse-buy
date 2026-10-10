import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, QrCode, Smartphone, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { formatINR, WHATSAPP_NUMBER, type Order } from "@/lib/data";
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
  { id: "PhonePe", label: "PhonePe / UPI", icon: Smartphone, desc: "Opens PhonePe on your phone to pay" },
  { id: "COD", label: "Cash on Delivery", icon: Wallet, desc: "Pay in cash when it arrives" },
];

function orderMessage(o: Order, brand: string) {
  return [
    `*New Order — ${brand}*`, `Order Ref: ${o.id}`, "",
    `*Customer*`, o.customer.name, `Mobile: ${o.customer.mobile}`, `Email: ${o.customer.email}`,
    `Address: ${o.customer.address}, ${o.customer.city}, ${o.customer.state} - ${o.customer.pin}`, "",
    `*Items*`, ...o.items.map((i) => `• ${i.name} (${i.size}, ${i.color}) x ${i.qty} = ${formatINR(i.price * i.qty)}`), "",
    `Subtotal: ${formatINR(o.subtotal)}`, `Shipping: ${o.shipping ? formatINR(o.shipping) : "FREE"}`, `*Total: ${formatINR(o.total)}*`, "",
    `Payment: ${o.payment === "COD" ? "Cash on Delivery" : "PhonePe / UPI (customer redirected to pay)"}`,
  ].join("\n");
}

function Checkout() {
  const { ready, user, checkout, cart, products, settings, addOrder, clearCart } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ name: "", mobile: "", email: "", address: "", city: "", state: "", pin: "" });
  const [err, setErr] = useState<Partial<Record<keyof Form, string>>>({});
  const [pay, setPay] = useState("PhonePe");
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

  const waNumber = (settings.whatsapp || "").replace(/\D/g, "") || WHATSAPP_NUMBER;
  const waLink = (o: Order) => `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(orderMessage(o, settings.brand))}`;
  const upiLink = (o: Order, scheme: "phonepe" | "upi") =>
    `${scheme}://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.brand)}&am=${o.total}&cu=INR&tn=${encodeURIComponent("Order " + o.id)}`;

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 animate-pop text-primary" strokeWidth={1.2} />
        <h1 className="mt-5 text-4xl">Order Placed</h1>
        <p className="mt-2 text-muted-foreground">Reference <span className="text-champagne">{placed.id}</span> · {formatINR(placed.total)}</p>
        <div className="mt-6 rounded-lg border bg-card p-5 text-left text-sm text-muted-foreground">
          {placed.payment === "COD"
            ? <>Your order details were sent to us on WhatsApp. If WhatsApp didn't open, tap the button below and press <b className="text-foreground">Send</b>. Pay in cash on delivery.</>
            : <>Your order was sent on WhatsApp. Complete the payment of <b className="text-champagne">{formatINR(placed.total)}</b> in PhonePe. Our team verifies payment before dispatch.</>}
        </div>
        <div className="mt-7 flex flex-col items-center gap-3">
          <a href={waLink(placed)} target="_blank" rel="noreferrer" className="btn-gold"><MessageCircle className="h-4 w-4" />Send Order on WhatsApp</a>
          {placed.payment !== "COD" && <>
            <a href={upiLink(placed, "phonepe")} className="btn-outline"><Smartphone className="h-4 w-4" />Pay with PhonePe</a>
            <a href={upiLink(placed, "upi")} className="text-xs uppercase tracking-widest text-primary">Pay with any UPI app</a>
          </>}
        </div>
        <Link to="/products" className="mt-6 block text-xs tracking-widest text-primary uppercase">Continue Shopping</Link>
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
    // Send order to WhatsApp, then (for PhonePe) open the payment app.
    // Always open WhatsApp in a new tab (it refuses to load inside frames).
    const w = window.open(waLink(order), "_blank", "noopener");
    if (!w) toast("Tap 'Send Order on WhatsApp' to send your order");
    if (pay !== "COD") setTimeout(() => { try { window.top!.location.href = upiLink(order, "phonepe"); } catch { window.location.href = upiLink(order, "phonepe"); } }, 900);
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PAY.map((m) => (
                <button type="button" key={m.id} onClick={() => setPay(m.id)} className={`rounded-lg border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${pay === m.id ? "border-primary bg-accent" : "hover:border-primary/60"}`}>
                  <m.icon className="h-6 w-6 text-primary" />
                  <div className="mt-2 font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </button>
              ))}
            </div>
            {pay !== "COD" && <div className="mt-5 flex flex-col items-center gap-4 rounded border p-5 sm:flex-row">
              {settings.qrImage ? <img src={settings.qrImage} alt="Payment QR" className="h-36 w-36 rounded bg-ivory object-contain p-1" /> : (
                <div className="grid h-36 w-36 shrink-0 place-items-center rounded border border-dashed text-center text-xs text-muted-foreground"><div><QrCode className="mx-auto mb-1 h-8 w-8" />QR coming soon</div></div>
              )}
              <div className="text-sm text-muted-foreground">
                Pay <b className="text-champagne">{formatINR(total)}</b> to UPI ID <b className="text-foreground">{settings.upiId}</b>. After placing the order, PhonePe opens automatically — our team verifies payment manually before dispatch.
              </div>
            </div>}
            {pay === "COD" && <p className="mt-5 rounded border p-4 text-sm text-muted-foreground">Place the order and your details go straight to our WhatsApp. Pay <b className="text-champagne">{formatINR(total)}</b> in cash on delivery.</p>}
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
