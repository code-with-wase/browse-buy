import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Deluxe Culture" },
      { name: "description", content: "How Deluxe Culture handles your personal information." },
      { property: "og:title", content: "Privacy Policy — Deluxe Culture" },
      { property: "og:description", content: "How we collect and use your information." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="mx-auto max-w-3xl space-y-5 px-4 py-16 leading-relaxed text-foreground/80 sm:px-6">
        <p>We collect only the details needed to fulfil your order: name, email, mobile number and delivery address. These are shared with our team via WhatsApp to confirm and ship your order.</p>
        <p>We never sell your data. Browsing and adding to cart require no personal information; your cart and wishlist are stored only on your device.</p>
        <p>To request deletion of your information, contact us on WhatsApp or email care@deluxeculture.in.</p>
      </article>
    </>
  ),
});
