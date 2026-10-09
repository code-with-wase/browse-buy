import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Gem, Leaf, Scissors } from "lucide-react";
import img from "@/assets/p2.jpg";
import img2 from "@/assets/p5.jpg";
import { PageHero, Reveal, SectionTitle } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Deluxe Culture" },
      { name: "description", content: "Deluxe Culture is an Indian luxury menswear label built on craft, fit and confidence." },
      { property: "og:title", content: "Our Story — Deluxe Culture" },
      { property: "og:description", content: "Craft, fit and confidence — the story behind Deluxe Culture." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="Crafted for the Modern Gentleman" />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <Reveal><img src={img} alt="Tailored blazer" loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" /></Reveal>
        <Reveal delay={100}>
          <div className="eyebrow">Since 2020</div>
          <h2 className="mt-3 text-4xl">Luxury that feels like you.</h2>
          <p className="mt-5 leading-relaxed text-foreground/75">Deluxe Culture began with a simple belief: every man deserves clothes that make him stand taller. We source premium fabrics, obsess over fit, and finish every piece with the care of a master tailor.</p>
          <p className="mt-4 leading-relaxed text-foreground/75">From boardroom blazers to festive kurtas, our collections are designed in India for the way modern men actually live — confident, considered, and always a little better dressed.</p>
          <Link to="/products" className="btn-gold mt-8">Explore Collection</Link>
        </Reveal>
      </section>
      <section className="border-y bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow="What we stand for" title="Our Values" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[[Scissors, "Craftsmanship", "Precise cuts and hand-finished details."], [Gem, "Premium Fabrics", "Linen, wool, Supima cotton and leather."], [Crown, "Confidence", "Designs that help you own every room."], [Leaf, "Responsibility", "Small batches, less waste."]].map(([I, t, d], i) => {
              const Icon = I as typeof Crown;
              return (
                <Reveal key={t as string} delay={i * 80} className="rounded-lg border p-6 text-center">
                  <Icon className="mx-auto h-8 w-8 text-primary" strokeWidth={1.2} />
                  <h3 className="mt-4 text-2xl">{t as string}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <Reveal>
          <h2 className="text-4xl">"Dress Like a Better You."</h2>
          <p className="mt-5 leading-relaxed text-foreground/75">More than a tagline — it's our promise. Each garment is an invitation to show up as the best version of yourself.</p>
        </Reveal>
        <Reveal delay={100}><img src={img2} alt="Ivory kurta" loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" /></Reveal>
      </section>
    </>
  );
}
