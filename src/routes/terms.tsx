import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Returns — Deluxe Culture" },
      { name: "description", content: "Terms of sale, shipping and return policy for Deluxe Culture." },
      { property: "og:title", content: "Terms & Returns — Deluxe Culture" },
      { property: "og:description", content: "Our terms of sale and 7-day return policy." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms & Returns" />
      <article className="mx-auto max-w-3xl space-y-5 px-4 py-16 leading-relaxed text-foreground/80 sm:px-6">
        <h2 className="text-2xl text-foreground">Orders</h2>
        <p>An order is confirmed only after our team verifies your payment. Prices are in INR and include all taxes.</p>
        <h2 className="text-2xl text-foreground">Shipping</h2>
        <p>We ship across India in 3–7 business days. Shipping is free above the threshold shown at checkout.</p>
        <h2 className="text-2xl text-foreground">Returns & Exchanges</h2>
        <p>Request a return or exchange within 7 days of delivery. Items must be unused, unwashed and with original tags. Refunds are processed within 5–7 business days after inspection.</p>
      </article>
    </>
  ),
});
