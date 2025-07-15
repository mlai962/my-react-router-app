import type { DocumentData } from "firebase/firestore";

export type User = { id: string; name: string } & DocumentData;
