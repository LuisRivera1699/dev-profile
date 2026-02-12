import type { Settings } from "@/types/firestore";
import { getSettings } from "@/services/settingsService";
import { getAllExperiences } from "@/services/experienceService";
import { getAllProjects } from "@/services/projectService";
import { getAllSkills } from "@/services/skillService";
import { getAllCertifications } from "@/services/certificationService";
import { serializeProject } from "@/lib/serialize";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

const DEFAULT_SETTINGS: Settings = {
  heroTitle: "Senior Web3 Engineer & Technical Lead",
  heroSubtitle: "DeFi infrastructure · Smart contracts · Layer 2",
  heroSummary:
    "I build scalable blockchain systems and lead technical teams. Focused on DeFi protocol architecture, trading infrastructure, and secure smart contract design.",
  aboutText: `I'm a Senior Web3 Engineer and Technical Lead with deep experience building production DeFi infrastructure, trading systems, and smart contract architecture.

My work spans protocol design, Layer 2 scaling, and cross-chain integrations. I've led engineering teams through design, implementation, and mainnet launches.

I focus on clean architecture, security-first development, and shipping systems that scale.`,
  cvUrl: "",
};

async function getSiteData(): Promise<{
  settings: Settings;
  experiences: Awaited<ReturnType<typeof getAllExperiences>>;
  projects: Awaited<ReturnType<typeof getAllProjects>>;
  skills: Awaited<ReturnType<typeof getAllSkills>>;
  certifications: Awaited<ReturnType<typeof getAllCertifications>>;
}> {
  try {
    const [settings, experiences, projects, skills, certifications] =
      await Promise.all([
        getSettings(),
        getAllExperiences(),
        getAllProjects(),
        getAllSkills(),
        getAllCertifications(),
      ]);
    return {
      settings: settings ?? DEFAULT_SETTINGS,
      experiences: experiences ?? [],
      projects: projects ?? [],
      skills: skills ?? [],
      certifications: certifications ?? [],
    };
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      experiences: [],
      projects: [],
      skills: [],
      certifications: [],
    };
  }
}

export default async function HomePage() {
  const { settings, experiences, projects, skills, certifications } =
    await getSiteData();

  const heroTitle =
    settings.heroTitle || DEFAULT_SETTINGS.heroTitle;
  const heroSubtitle =
    settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle;
  const heroSummary =
    settings.heroSummary || DEFAULT_SETTINGS.heroSummary;
  const aboutText = settings.aboutText || DEFAULT_SETTINGS.aboutText;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          title={heroTitle}
          subtitle={heroSubtitle}
          summary={heroSummary}
        />
        <About aboutText={aboutText} />
        <Experience experiences={experiences} />
        <Projects projects={projects.map(serializeProject)} />
        <Skills skills={skills} />
        <Certifications certifications={certifications} />
        <Contact
          email={settings.contactEmail}
          linkedin={settings.contactLinkedIn}
          github={settings.contactGitHub}
          wallet={settings.contactWallet}
        />
      </main>
      <Footer />
    </div>
  );
}
