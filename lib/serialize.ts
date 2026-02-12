import type { Project, Experience, Skill, Certification } from "@/types/firestore";
import type { ProjectSerialized } from "@/types/firestore";

function hasToMillis(t: unknown): t is { toMillis: () => number } {
  return !!t && typeof (t as { toMillis?: () => number }).toMillis === "function";
}

export function serializeProject(p: Project & { id: string }): ProjectSerialized {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    impact: p.impact,
    techStack: p.techStack,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    imageUrl: p.imageUrl,
    featured: p.featured,
    createdAt: hasToMillis(p.createdAt) ? p.createdAt.toMillis() : null,
  };
}

export function serializeExperience(exp: Experience & { id: string }) {
  return {
    id: exp.id!,
    role: exp.role,
    company: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    techStack: exp.techStack,
    createdAt: hasToMillis(exp.createdAt) ? exp.createdAt.toMillis() : null,
  };
}

export function serializeSkill(skill: Skill & { id: string }) {
  return {
    id: skill.id!,
    name: skill.name,
    category: skill.category,
    createdAt: hasToMillis(skill.createdAt) ? skill.createdAt.toMillis() : null,
  };
}

export function serializeCertification(cert: Certification & { id: string }) {
  return {
    id: cert.id!,
    title: cert.title,
    issuer: cert.issuer,
    date: cert.date,
    description: cert.description,
    createdAt: cert.createdAt && hasToMillis(cert.createdAt) ? cert.createdAt.toMillis() : null,
  };
}
