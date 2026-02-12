import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle: string;
  summary: string;
}

export function Hero({ title, subtitle, summary }: HeroProps) {
  return (
    <section className="relative border-b border-border/80 bg-background py-24 md:py-32 bg-grid">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-sm text-primary mb-4">$ whoami</p>
        <h1 className="font-mono text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-lg text-primary md:text-xl">
          {subtitle}
        </p>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          {summary}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild className="font-mono text-sm">
            <Link href="#work">./view_work</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="font-mono text-sm border-primary/50 text-primary hover:bg-primary/10">
            <Link href="#contact">./contact</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
