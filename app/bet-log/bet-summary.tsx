import type { Handicap, OverUnder } from "../model/binary-option-and-number";
import { LineType, type Line } from "../model/line";
import type { Team } from "../model/team";
import type { User } from "../model/user";

type BetSummaryProps = {
  userA: User | null;
  userB: User | null;
  teamA: Team | null;
  teamB: Team | null;
  line: Line | null;
  map: string | null;
  overUnder: OverUnder;
  handicap: Handicap;
  odds: number | null;
  betAmount: number | null;
  date: string;
};

export default function BetSummary({
  userA,
  userB,
  teamA,
  teamB,
  line,
  map,
  overUnder,
  handicap,
  odds,
  betAmount,
  date,
}: BetSummaryProps) {
  return (
    <div
      className="w-full h-max rounded-lg p-2 border-1 text-purple-200
        bg-gray-400 dark:bg-purple-950/10
        border-purple-500 dark:border-purple-700"
    >
      <div className="w-full min-h-32 h-max flex font-bold text-center items-center">
        <div className="w-5/12 h-max">
          <div className="w-full h-3/4 truncate text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            {teamA ? teamA.name : ""}
          </div>
          <div className="w-full h-1/4 text-xl">{userA ? userA.name : ""}</div>
        </div>

        <div className="w-2/12">{"vs"}</div>

        <div className="w-5/12 h-max">
          <div className="w-full h-3/4 truncate text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            {teamB ? teamB.name : ""}
          </div>
          <div className="w-full h-1/4 text-xl">{userB ? userB.name : ""}</div>
        </div>
      </div>

      <div className="w-full h-max p-2 flex-wrap font-bold text-center items-center text-xl">
        {date} {map ? map : ""} {line ? line.name : ""}{" "}
        {line && line.lineType == LineType.OVER_UNDER && overUnder
          ? (overUnder.over ? "o" : "u") + overUnder.value
          : ""}{" "}
        {line && line.lineType == LineType.HANDICAP && handicap
          ? (handicap.plus ? "+" : "-") + handicap.value
          : ""}{" "}
        {odds ? "@" + odds.toFixed(2) + "x " : ""}
        {betAmount ? "$" + betAmount : ""}
      </div>
    </div>
  );
}
