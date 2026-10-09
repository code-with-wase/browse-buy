import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Headphones, RotateCcw, Truck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero, Reveal, SectionTitle } from "@/components/site";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services, Shipping & FAQ — Deluxe Culture" },
      { name: "description", content: "Shopping assistance, delivery, returns, payment help and frequently asked questions." },
      { property: "og:title", content: "Services & FAQ — Deluxe Culture" },
      { property: "og:description", content: "Delivery, returns and payment help from Deluxe Culture." },
    ],
  }),
  component: Services,
});

function Services() {
  const { settings } = useStore();
  const faqs = [
    ["Do I need an account to shop?", "No. You can browse every product and add to cart freely. Only when you buy, we ask you to sign in with your email."],
    ["How long does delivery take?", "Metro cities: 3–5 days. Rest of India: 5–7 business days."],
    ["What is the shipping charge?", `₹${settings.shippingFee} per order, free above ₹${settings.freeShippingAbove}.`],
    ["How do I return an item?", "Message us on WhatsApp within 7 days of delivery. Items must be unworn with tags."],
    ["Which payment methods do you accept?", "UPI, PhonePe and Scan & Pay QR. Payments are verified by our team before dispatch."],
    ["How do I choose my size?", "Each product lists available sizes. For help, chat with our stylist on WhatsApp."],
  ];
  return (
    <>
      <PageHero eyebrow="At Your Service" title="Services & Support" />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[[Headphones, "Shopping Assistance", "Personal styling help over WhatsApp."], [Truck, "Pan-India Delivery", "Tracked, insured shipping in 3–7 days."], [RotateCcw, "7-Day Returns", "Simple exchanges and returns."], [CreditCard, "Payment Help", "Guidance for UPI, PhonePe & QR."]].map(([I, t, d], i) => {
            const Icon = I as typeof Truck;
            return (
              <Reveal key={t as string} delay={i * 80} className="rounded-lg border bg-card p-6">
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.2} />
                <h3 className="mt-4 text-2xl">{t as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionTitle eyebrow="Questions" title="Frequently Asked" />
        <Accordion type="single" collapsible>
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={String(i)}>
              <AccordionTrigger className="font-serif text-lg hover:text-primary hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
