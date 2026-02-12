import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "@/lib/firebase";
import type { Message } from "@/types/firestore";

const COLLECTION = "messages";

function toMessage(id: string, data: Record<string, unknown>): Message & { id: string } {
  return {
    id,
    name: (data.name as string) ?? "",
    email: (data.email as string) ?? "",
    message: (data.message as string) ?? "",
    createdAt: data.createdAt as Message["createdAt"],
  };
}

export async function createMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllMessages(): Promise<(Message & { id: string })[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toMessage(d.id, d.data()));
}

export async function getMessageById(id: string): Promise<(Message & { id: string }) | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toMessage(snap.id, snap.data());
}

export async function deleteMessage(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
