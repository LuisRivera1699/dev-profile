import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "@/lib/firebase";
import type { Settings } from "@/types/firestore";

const SETTINGS_ID = "public";
const SETTINGS_COLLECTION = "settings";

export async function getSettings(): Promise<Settings | null> {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Settings;
}

export async function updateSettings(data: Partial<Settings>): Promise<void> {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_ID);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { ...data });
  } else {
    await setDoc(ref, {
      heroTitle: data.heroTitle ?? "",
      heroSubtitle: data.heroSubtitle ?? "",
      heroSummary: data.heroSummary ?? "",
      aboutText: data.aboutText ?? "",
      cvUrl: data.cvUrl ?? "",
      ...data,
    });
  }
}
