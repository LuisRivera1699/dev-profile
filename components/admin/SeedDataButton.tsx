"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateSettings } from "@/services/settingsService";
import { createExperience } from "@/services/experienceService";
import { createProject } from "@/services/projectService";
import { createSkill } from "@/services/skillService";
import { createCertification } from "@/services/certificationService";
import { useToast } from "@/hooks/use-toast";
import type { Experience, Project, Skill, Certification, Settings } from "@/types/firestore";

interface SeedData {
  settings: Record<string, string>;
  experiences: Omit<Experience, "createdAt">[];
  projects: Omit<Project, "createdAt">[];
  skills: Omit<Skill, "createdAt">[];
  certifications: Omit<Certification, "createdAt">[];
}

export function SeedDataButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSeed() {
    if (!confirm("This will add example content. Continue?")) return;
    setLoading(true);
    try {
      const res = await fetch("/seed-data.json");
      const data: SeedData = await res.json();

      await updateSettings({
        heroTitle: data.settings.heroTitle ?? "",
        heroSubtitle: data.settings.heroSubtitle ?? "",
        heroSummary: data.settings.heroSummary ?? "",
        aboutText: data.settings.aboutText ?? "",
        cvUrl: data.settings.cvUrl ?? "",
        contactEmail: data.settings.contactEmail,
        contactLinkedIn: data.settings.contactLinkedIn,
        contactGitHub: data.settings.contactGitHub,
        contactWallet: data.settings.contactWallet,
      } as Partial<Settings>);

      for (const exp of data.experiences) {
        await createExperience(exp);
      }
      for (const proj of data.projects) {
        await createProject(proj);
      }
      for (const skill of data.skills) {
        await createSkill(skill);
      }
      for (const cert of data.certifications) {
        await createCertification(cert);
      }

      toast({ title: "Example data loaded" });
    } catch {
      toast({ title: "Failed to seed data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleSeed} disabled={loading}>
      {loading ? "Loading…" : "Load example data"}
    </Button>
  );
}
