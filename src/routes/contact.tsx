import { createFileRoute } from "@tanstack/react-router";
import { WHATSAPP_NUMBER } from "@/lib/data";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Deluxe Culture" },
      { name: "description", content: "Reach Deluxe Culture via WhatsApp, phone or our contact form." },
      { property: "og:title", content: "Contact Us — Deluxe Culture" },
      { property: "og:description", content: "Talk to our team on WhatsApp or send us a message." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

function Contact() {
  const { settings } = useStore();
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<Partial<Record<string, string>>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) return setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
    setErr({});
    const text = `Hello ${settings.brand},\nName: ${r.data.name}\nEmail: ${r.data.email}\n\n${r.data.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    toast.success("Opening WhatsApp — press Send to deliver your message");
    setF({ name: "", email: "", message: "" });
  };
  const phone = "+" + settings.whatsapp.replace(/^(\d{2})(\d{5})(\d{5})$/, "$1 $2 $3");
  return (
    <>
      <PageHero eyebrow="Get in Touch" title="Contact Us" sub="Our team replies within a few hours, 10 AM – 8 PM, Monday to Saturday." />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg border bg-card p-5 transition hover:border-primary">
            <MessageCircle className="h-7 w-7 text-primary" /><div><div className="font-serif text-xl">WhatsApp Support</div><div className="text-sm text-muted-foreground">{phone}</div></div>
          </a>
          <a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-4 rounded-lg border bg-card p-5 hover:border-primary"><Phone className="h-7 w-7 text-primary" /><div><div className="font-serif text-xl">Call Us</div><div className="text-sm text-muted-foreground">{phone}</div></div></a>
          <div className="flex items-center gap-4 rounded-lg border bg-card p-5"><Mail className="h-7 w-7 text-primary" /><div><div className="font-serif text-xl">Email</div><div className="text-sm text-muted-foreground">care@deluxeculture.in</div></div></div>
          <div className="flex items-center gap-4 rounded-lg border bg-card p-5"><MapPin className="h-7 w-7 text-primary" /><div><div className="font-serif text-xl">Studio</div><div className="text-sm text-muted-foreground">India</div></div></div>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4 rounded-lg border bg-card p-7">
          <h2 className="text-3xl">Send a Message</h2>
          {(["name", "email"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={k} className="eyebrow">{k === "name" ? "Your name" : "Email"}</label>
              <input id={k} type={k === "email" ? "email" : "text"} className="field mt-2" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} maxLength={k === "name" ? 100 : 255} />
              {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="message" className="eyebrow">Message</label>
            <textarea id="message" rows={5} className="field mt-2" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} maxLength={1000} />
            {err["message"] && <p className="mt-1 text-xs text-destructive">{err["message"]}</p>}
          </div>
          <button className="btn-gold w-full"><MessageCircle className="h-4 w-4" />Send via WhatsApp</button>
        </form>
      </div>
    </>
  );
}
