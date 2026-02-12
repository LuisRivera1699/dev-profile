interface AboutProps {
  aboutText: string;
}

export function About({ aboutText }: AboutProps) {
  return (
    <section id="about" className="border-b border-border/80 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
          {`// about`}
        </h2>
        <div className="mt-8 rounded-lg border border-border/80 bg-card/50 p-6 font-mono text-sm leading-relaxed text-muted-foreground">
          <div className="whitespace-pre-wrap">{aboutText}</div>
        </div>
      </div>
    </section>
  );
}
