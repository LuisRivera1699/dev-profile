import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "@/lib/firebase";
import type { Project } from "@/types/firestore";

const COLLECTION = "projects";

function toProject(id: string, data: Record<string, unknown>): Project & { id: string } {
  return {
    id,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    impact: (data.impact as string) ?? "",
    techStack: Array.isArray(data.techStack) ? (data.techStack as string[]) : [],
    githubUrl: (data.githubUrl as string) ?? "",
    liveUrl: (data.liveUrl as string) ?? "",
    imageUrl: (data.imageUrl as string) ?? "",
    featured: (data.featured as boolean) ?? false,
    createdAt: data.createdAt as Project["createdAt"],
  };
}

export async function getAllProjects(): Promise<(Project & { id: string })[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProject(d.id, d.data()));
}

export async function getFeaturedProjects(): Promise<(Project & { id: string })[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectById(id: string): Promise<(Project & { id: string }) | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toProject(snap.id, snap.data());
}

export async function createProject(
  data: Omit<Project, "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "createdAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deleteProject(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
