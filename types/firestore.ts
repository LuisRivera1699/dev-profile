import type { Timestamp } from "firebase/firestore";

export interface User {
  email: string;
  role: "admin" | "user";
  createdAt: Timestamp;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack: string[];
  createdAt: Timestamp;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  impact: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
  createdAt: Timestamp;
}

/** Serialized for passing from Server to Client (createdAt as ms) */
export type ProjectSerialized = Omit<Project, "createdAt"> & {
  id: string;
  createdAt: number | null;
};

export interface Skill {
  id?: string;
  name: string;
  category: string;
  createdAt: Timestamp;
}

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  createdAt?: Timestamp;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
}

export interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  heroSummary: string;
  aboutText: string;
  cvUrl: string;
  contactEmail?: string;
  contactLinkedIn?: string;
  contactGitHub?: string;
  contactWallet?: string;
}

export const SKILL_CATEGORIES = [
  "Blockchain",
  "Backend",
  "Frontend",
  "DevOps",
  "AI",
  "Leadership",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
