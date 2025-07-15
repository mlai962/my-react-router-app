import type { DocumentData } from "firebase/firestore";

export type Line = { id: string; name: string } & DocumentData;
