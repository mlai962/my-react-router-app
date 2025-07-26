import { type FirebaseOptions } from "firebase/app";
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

type BetLogProps = {
  firebaseOptions: FirebaseOptions;
  users: User[];
  teams: Team[];
  lines: Line[];
};

export function BetLog({ firebaseOptions, users, teams, lines }: BetLogProps) {
  const userMap = new Map(users.map((user) => [user.id, user]));

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
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
    </main>
  );
}
