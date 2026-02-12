import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "@/lib/firebase";
import type { Skill } from "@/types/firestore";

const COLLECTION = "skills";

function toSkill(id: string, data: Record<string, unknown>): Skill & { id: string } {
  return {
    id,
    name: (data.name as string) ?? "",
    category: (data.category as string) ?? "",
    createdAt: data.createdAt as Skill["createdAt"],
  };
}

export async function getAllSkills(): Promise<(Skill & { id: string })[]> {
  const ref = collection(db, COLLECTION);
  const snap = await getDocs(ref);
  return snap.docs
    .map((d) => toSkill(d.id, d.data()))
    .sort((a, b) => {
      const cat = a.category.localeCompare(b.category);
      return cat !== 0 ? cat : a.name.localeCompare(b.name);
    });
}

export async function getSkillById(id: string): Promise<(Skill & { id: string }) | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toSkill(snap.id, snap.data());
}

export async function createSkill(data: Omit<Skill, "createdAt">): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSkill(
  id: string,
  data: Partial<Omit<Skill, "createdAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deleteSkill(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
