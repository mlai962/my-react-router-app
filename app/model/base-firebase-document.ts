import type { DocumentData } from "firebase/firestore";

export type BaseFirebaseDocument = { id: string; name: string } & DocumentData;
