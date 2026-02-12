import type { Experience as ExperienceType } from "@/types/firestore";

interface ExperienceProps {
  experiences: (ExperienceType & { id: string })[];
}

export function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="work" className="border-b border-border/80 bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
          {`// experience`}
        </h2>
        <div className="mt-10 space-y-0">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="border-l-2 border-primary/50 pl-6 py-8 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-mono text-lg font-medium text-foreground">
                  {exp.role}
                </h3>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="font-mono text-xs text-primary">
                  {exp.startDate} — {exp.endDate}
                </p>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground text-sm">
                {exp.description}
              </p>
              {exp.techStack?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border bg-muted/80 px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
