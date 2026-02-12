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
import type { Experience } from "@/types/firestore";

const COLLECTION = "experiences";

function toExperience(id: string, data: Record<string, unknown>): Experience & { id: string } {
  return {
    id,
    role: (data.role as string) ?? "",
    company: (data.company as string) ?? "",
    startDate: (data.startDate as string) ?? "",
    endDate: (data.endDate as string) ?? "",
    description: (data.description as string) ?? "",
    techStack: Array.isArray(data.techStack) ? (data.techStack as string[]) : [],
    createdAt: data.createdAt as Experience["createdAt"],
  };
}

export async function getAllExperiences(): Promise<(Experience & { id: string })[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toExperience(d.id, d.data()));
}

export async function getExperienceById(
  id: string
): Promise<(Experience & { id: string }) | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toExperience(snap.id, snap.data());
}

export async function createExperience(
  data: Omit<Experience, "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateExperience(
  id: string,
  data: Partial<Omit<Experience, "createdAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deleteExperience(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
