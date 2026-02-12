import type { Skill as SkillType } from "@/types/firestore";
import { SKILL_CATEGORIES } from "@/types/firestore";

interface SkillsProps {
  skills: (SkillType & { id: string })[];
}

const categoryOrder = [...SKILL_CATEGORIES];

export function Skills({ skills }: SkillsProps) {
  const byCategory = categoryOrder.reduce<Record<string, (SkillType & { id: string })[]>>(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat);
      return acc;
    },
    {}
  );

  const categoriesWithSkills = categoryOrder.filter(
    (cat) => (byCategory[cat]?.length ?? 0) > 0
  );

  return (
    <section id="skills" className="border-b border-border/80 bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-4xl px-6">
        <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
          {`// skills`}
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithSkills.map((category) => (
            <div key={category} className="rounded-lg border border-border/80 bg-card/50 p-4">
              <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                {category}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(byCategory[category] ?? []).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
