import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "~/firebase";
import {
  Bet,
  EXTRA_BINARY_LINE_OPTION,
  EXTRA_BINARY_LINE_VALUE,
} from "~/model/bet";
import { LineType } from "~/model/line";

type BetHistoryProps = {
  initialBets: Bet[];
};

export default function BetHistory({ initialBets }: BetHistoryProps) {
  const [bets, setBets] = useState(initialBets);
  const betMap = new Map(initialBets.map((bet) => [bet.id, bet]));

  const handleBetSettlement = async (betId: string, winner: string) => {
    const betRef = doc(db, "bets", betId);

    try {
      await updateDoc(betRef, {
        winner: winner,
      });

      const updated = bets.map((bet) =>
        bet.id === betId ? { ...bet, winner: winner } : bet
      );

      setBets(updated);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="w-full h-max">
      {bets.map((bet) => {
        const binaryLineOption: boolean =
          bet.extras[EXTRA_BINARY_LINE_OPTION] ?? true;
        const binaryLineValue: number =
          bet.extras[EXTRA_BINARY_LINE_VALUE] ?? 0;

        return (
          <div
            key={bet.id}
            className="w-full h-max grid grid-cols-1 md:grid-cols-3 rounded-lg p-2 border-1 
            text-purple-200
            bg-gray-400 dark:bg-purple-950/10
            border-purple-500 dark:border-purple-700"
          >
            <div>{bet.date.toDate().toDateString()}</div>

            <div>
              {bet.userA.name} vs {bet.userB.name}
            </div>

            <div>
              {bet.teamA.name} vs {bet.teamB.name}
            </div>

            <div>
              {bet.map} {bet.line.name}{" "}
              {bet.line.lineType === LineType.NONE
                ? ""
                : bet.line.lineType === LineType.OVER_UNDER
                ? (binaryLineOption ? "o" : "u") + binaryLineValue
                : (binaryLineOption ? "+" : "-") + binaryLineValue}
            </div>

            <div>
              @{bet.odds.toFixed(2)}x ${bet.betAmount}
            </div>

            <div className="flex space-x-1">
              <label className="flex items-center text-sm font-medium">
                <input
                  id={"radio-unsettled-" + bet.id}
                  type="radio"
                  value=""
                  name="settle-bet-radio-group"
                  checked={bet.winner === ""}
                  onChange={(e) => handleBetSettlement(bet.id, e.target.value)}
                  className="w-4 h-4 me-1 
                    accent-purple-800 dark:accent-purple-600
                    bg-gray-100 dark:bg-gray-700
                    border-gray-300 dark:border-gray-600
                    focus:ring-0"
                />
                Unsettled
              </label>

              <label className="flex items-center text-sm font-medium">
                <input
                  id={"radio-userA-" + bet.id}
                  type="radio"
                  value="userA"
                  name="settle-bet-radio-group"
                  checked={bet.winner === "userA"}
                  onChange={(e) => handleBetSettlement(bet.id, e.target.value)}
                  className="w-4 h-4 me-1 
                    accent-purple-800 dark:accent-purple-600
                    bg-gray-100 dark:bg-gray-700
                    border-gray-300 dark:border-gray-600
                    focus:ring-0"
                />
                {bet.userA.name}
              </label>

              <label className="flex items-center text-sm font-medium">
                <input
                  id={"radio-userB-" + bet.id}
                  type="radio"
                  value="userB"
                  name="settle-bet-radio-group"
                  checked={bet.winner === "userB"}
                  onChange={(e) => handleBetSettlement(bet.id, e.target.value)}
                  className="w-4 h-4 me-1 
                    accent-purple-800 dark:accent-purple-600
                    bg-gray-100 dark:bg-gray-700
                    border-gray-300 dark:border-gray-600
                    focus:ring-0"
                />
                {bet.userB.name}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
