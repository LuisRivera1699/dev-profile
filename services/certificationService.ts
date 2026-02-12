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
import type { Certification } from "@/types/firestore";

const COLLECTION = "certifications";

function toCertification(
  id: string,
  data: Record<string, unknown>
): Certification & { id: string } {
  return {
    id,
    title: (data.title as string) ?? "",
    issuer: (data.issuer as string) ?? "",
    date: (data.date as string) ?? "",
    description: (data.description as string) ?? "",
    createdAt: data.createdAt as Certification["createdAt"],
  };
}

export async function getAllCertifications(): Promise<
  (Certification & { id: string })[]
> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toCertification(d.id, d.data()));
}

export async function getCertificationById(
  id: string
): Promise<(Certification & { id: string }) | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toCertification(snap.id, snap.data());
}

export async function createCertification(
  data: Omit<Certification, "createdAt">
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCertification(
  id: string,
  data: Partial<Omit<Certification, "createdAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
}

export async function deleteCertification(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
