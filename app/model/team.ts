import type { DocumentData } from "firebase/firestore";

export type Team = { id: string; name: string } & DocumentData;
