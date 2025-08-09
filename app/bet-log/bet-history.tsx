import {
  Bet,
  EXTRA_BINARY_LINE_OPTION,
  EXTRA_BINARY_LINE_VALUE,
} from "../model/bet";
import { LineType } from "../model/line";
import Spinner from "../common-components/spinner";

type BetHistoryProps = {
  bets: Bet[];
  handleBetSettlement: (betId: string, winner: string) => void;
  handleBetDeletion: (betId: string) => void;
  isShowBetSettlementSpinner: boolean;
  currentBetIdBeingSettled: string;
};

export default function BetHistory({
  bets,
  handleBetSettlement,
  handleBetDeletion,
  isShowBetSettlementSpinner,
  currentBetIdBeingSettled,
}: BetHistoryProps) {
  return (
    <div className="w-full h-max space-y-1">
      {bets.map((bet) => {
        const binaryLineOption: boolean =
          bet.extras[EXTRA_BINARY_LINE_OPTION] ?? true;
        const binaryLineValue: number =
          bet.extras[EXTRA_BINARY_LINE_VALUE] ?? 0;

        return (
          <div
            key={bet.id}
            className="w-full h-max rounded-lg p-2 border-1 relative
            text-purple-200
            bg-gray-400 dark:bg-purple-950/10
            border-purple-500 dark:border-purple-700"
          >
            <div
              className={`w-full h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
                isShowBetSettlementSpinner && currentBetIdBeingSettled == bet.id
                  ? "opacity-20"
                  : ""
              }`}
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

              <div className="flex w-full items-center">
                <div className="w-1/3">@{bet.odds.toFixed(2)}x</div>
                <div className="w-1/3">${bet.betAmount}</div>
              </div>

              <div className="flex w-full">
                <div className="w-1/3 flex items-center">
                  <label className="flex items-center text-sm font-medium hover:cursor-pointer">
                    <input
                      id={"radio-unsettled-" + bet.id}
                      type="radio"
                      value=""
                      name={"settle-bet-radio-group" + bet.id}
                      checked={bet.winner.length === 0}
                      onChange={(e) =>
                        handleBetSettlement(bet.id, e.target.value)
                      }
                      className="w-4 h-4 me-1 
                    accent-purple-800 dark:accent-purple-600
                    bg-gray-100 dark:bg-gray-700
                    border-gray-300 dark:border-gray-600
                    focus:ring-0 hover:cursor-pointer"
                    />
                    Unsettled
                  </label>
                </div>

                <div className="w-1/3 flex items-center">
                  <label className="flex items-center text-sm font-medium hover:cursor-pointer">
                    <input
                      id={"radio-userA-" + bet.id}
                      type="radio"
                      value="userA"
                      name={"settle-bet-radio-group" + bet.id}
                      checked={bet.winner === "userA"}
                      onChange={(e) =>
                        handleBetSettlement(bet.id, e.target.value)
                      }
                      className="w-4 h-4 me-1 
                    accent-purple-800 dark:accent-purple-600
                    bg-gray-100 dark:bg-gray-700
                    border-gray-300 dark:border-gray-600
                    focus:ring-0"
                    />
                    {bet.userA.name}
                  </label>
                </div>

                <div className="w-1/3 flex items-center">
                  <label className="flex items-center text-sm font-medium hover:cursor-pointer">
                    <input
                      id={"radio-userB-" + bet.id}
                      type="radio"
                      value="userB"
                      name={"settle-bet-radio-group" + bet.id}
                      checked={bet.winner === "userB"}
                      onChange={(e) =>
                        handleBetSettlement(bet.id, e.target.value)
                      }
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
            </div>

            <svg
              className="w-6 h-6 text-gray-800 dark:text-white 
                hover:text-red-500/75 cursor-pointer absolute top-1 right-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              onClick={() => handleBetDeletion(bet.id)}
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>

            <Spinner
              isShowSpinner={
                isShowBetSettlementSpinner && currentBetIdBeingSettled == bet.id
              }
            />
          </div>
        );
      })}
    </div>
  );
}
