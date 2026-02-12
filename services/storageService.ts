import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadFile(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function getPublicUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export const STORAGE_PATHS = {
  cv: "cv/cv.pdf",
  projectImage: (projectId: string, filename: string) =>
    `projects/${projectId}/${filename}`,
} as const;
