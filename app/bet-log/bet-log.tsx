import { useState } from "react";
import BinaryOptionAndNumberInput, {
  BinaryOptionType,
} from "~/inputs/binary-option-and-number-input";
import type { Line } from "~/model/line";
import { Handicap, OverUnder } from "~/model/binary-option-and-number";
import type { Team } from "~/model/team";
import type { User } from "~/model/user";
import OptionContainer from "~/option-container/option-container";
import BetAmountInput from "~/inputs/bet-amount-input";
import BetSummary from "./bet-summary";
import type { Bet } from "~/model/bet";
import BetHistory from "./bet-history";

type BetLogProps = {
  users: User[];
  teams: Team[];
  lines: Line[];
  bets: Bet[];
};

export function BetLog({ users, teams, lines, bets }: BetLogProps) {
  const maps = [
    { id: "mapMatch", name: "Match" },
    { id: "map1", name: "Map 1" },
    { id: "map2", name: "Map 2" },
    { id: "map3", name: "Map 3" },
    { id: "map4", name: "Map 4" },
    { id: "map5", name: "Map 5" },
  ];

  const userMap = new Map(users.map((user) => [user.id, user]));
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const mapMap = new Map(maps.map((map) => [map.id, map]));
  const lineMap = new Map(lines.map((line) => [line.id, line]));

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string>("");
  const [selectedLineId, setSelectedLineId] = useState<string>("");

  const [overUnder, setOverUnder] = useState<OverUnder>({
    over: true,
    value: 0.5,
  });

  const [handicap, setHandicap] = useState<Handicap>({
    plus: true,
    value: 0.5,
  });

  const [betAmount, setBetAmount] = useState<number>(0);

  return (
    <main className="flex-col p-8 space-y-4">
      <div className="w-full h-max text-4xl font-semibold text-center">
        gamba kappachungus deluxe
      </div>

      <BetSummary
        userA={
          selectedUserIds.length > 0
            ? userMap.get(selectedUserIds[0]) ?? null
            : null
        }
        userB={
          selectedUserIds.length > 1
            ? userMap.get(selectedUserIds[1]) ?? null
            : null
        }
        teamA={
          selectedTeamIds.length > 0
            ? teamMap.get(selectedTeamIds[0]) ?? null
            : null
        }
        teamB={
          selectedTeamIds.length > 1
            ? teamMap.get(selectedTeamIds[1]) ?? null
            : null
        }
        map={
          selectedMapId.length > 0
            ? mapMap.get(selectedMapId)?.name ?? null
            : null
        }
        line={
          selectedLineId.length > 0 ? lineMap.get(selectedLineId) ?? null : null
        }
        overUnder={overUnder}
        handicap={handicap}
        betAmount={betAmount}
      ></BetSummary>

      <OptionContainer
        optionContainerName="Users"
        options={users}
        maxOptionsSelectable={2}
        onSelectionChange={(selectionOrder) => {
          setSelectedUserIds(selectionOrder);
        }}
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Teams"
        options={teams}
        maxOptionsSelectable={2}
        onSelectionChange={(selectionOrder) => {
          setSelectedTeamIds(selectionOrder);
        }}
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Map"
        options={maps}
        maxOptionsSelectable={1}
        onSelectionChange={(selectionOrder) => {
          setSelectedMapId(selectionOrder[0] || "");
        }}
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Lines"
        options={lines}
        maxOptionsSelectable={1}
        onSelectionChange={(selectionOrder) => {
          setSelectedLineId(selectionOrder[0] || "");
        }}
      ></OptionContainer>

      <div className="max-sm:grid-cols-1 max-md:grid md:flex gap-4 max-md:grid-cols-2 md:justify-between">
        <BinaryOptionAndNumberInput
          onChange={(binaryOption) => {
            if (binaryOption instanceof OverUnder) {
              setOverUnder(binaryOption);
            }
          }}
          type={BinaryOptionType.OVER_UNDER}
        ></BinaryOptionAndNumberInput>

        <BinaryOptionAndNumberInput
          onChange={(binaryOption) => {
            if (binaryOption instanceof Handicap) {
              setHandicap(binaryOption);
            }
          }}
          type={BinaryOptionType.HANDICAP}
        ></BinaryOptionAndNumberInput>

        <BetAmountInput
          onChange={(amount) => setBetAmount(amount)}
        ></BetAmountInput>
      </div>

      <BetHistory initialBets={bets}></BetHistory>
    </main>
  );
}
