import type { BaseFirebaseDocument } from "./base-firebase-document";

export type Line = BaseFirebaseDocument & { lineType: LineType };

export enum LineType {
  NONE = "NONE",
  HANDICAP = "HANDICAP",
  OVER_UNDER = "OVER_UNDER",
}
