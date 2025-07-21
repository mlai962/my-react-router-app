import { type FirebaseOptions } from "firebase/app";
import { useState } from "react";
import BinaryOptionAndNumberInput, {
  BinaryOptionType,
} from "~/inputs/binary-option-and-number-input";
import type { Line } from "~/model/line";
import { OverUnder } from "~/model/binary-option-and-number";
import type { Team } from "~/model/team";
import type { User } from "~/model/user";
import OptionContainer from "~/option-container/option-container";

type ChildProps = {
  firebaseOptions: FirebaseOptions;
  users: User[];
  teams: Team[];
  lines: Line[];
};

export function Child({ firebaseOptions, users, teams, lines }: ChildProps) {
  const userMap = new Map(users.map((user) => [user.id, user]));

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string>("");

  const [overUnder, setOverUnder] = useState<OverUnder>({
    over: true,
    value: 0.5,
  });

  return (
    <main className="flex-col p-8 space-y-4">
      <div className="flex-col p-4 bg-blue-950 border-2 border-blue-300 rounded-xl w-full h-full">
        <p>apiKey: {firebaseOptions.apiKey}</p>
        <p>authDomain: {firebaseOptions.authDomain}</p>
        <p>projectId: {firebaseOptions.projectId}</p>
        <p>storageBucket: {firebaseOptions.storageBucket}</p>
        <p>messagingSenderId: {firebaseOptions.messagingSenderId}</p>
        <p>appId: {firebaseOptions.appId}</p>
        <p>measurementId: {firebaseOptions.measurementId}</p>
        <br></br>
        {users.map((user, index) => (
          <p key={index}>
            id: {user.id} name: {user.name}
          </p>
        ))}
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

      <BinaryOptionAndNumberInput
        onChange={(binaryOption) => {
          if (binaryOption instanceof OverUnder) {
            setOverUnder(binaryOption);
          }
        }}
        type={BinaryOptionType.OVER_UNDER}
      ></BinaryOptionAndNumberInput>
    </main>
  );
}
