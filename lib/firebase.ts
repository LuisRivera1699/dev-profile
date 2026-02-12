import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type CollectionReference,
  type DocumentReference,
  type QueryConstraint,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDniLffxV_mi3u866DLlOf9-XGIZHhyBJU",
  authDomain: "atmo-67f01.firebaseapp.com",
  projectId: "atmo-67f01",
  storageBucket: "atmo-67f01.firebasestorage.app",
  messagingSenderId: "105222203436",
  appId: "1:105222203436:web:9fbfd9dd06e380b2ac0989",
  measurementId: "G-9V8PSH1SBT",
};

const app: FirebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : (getApps()[0] as FirebaseApp);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
};
export type { CollectionReference, DocumentReference, QueryConstraint };
