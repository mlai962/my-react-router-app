import { type FirebaseOptions } from "firebase/app";
import { useState } from "react";
import OverUnderInput from "~/inputs/over-under-input";
import type { Line } from "~/model/line";
import type { OverUnder } from "~/model/over-under";
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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const userMap = new Map(users.map((user) => [user.id, user]));
  const [overUnder, setOverUnder] = useState<OverUnder>({
    over: false,
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
        onSelectionChange={(selectionOrder) => {}}
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Lines"
        options={lines}
        maxOptionsSelectable={1}
        onSelectionChange={(selectionOrder) => {}}
      ></OptionContainer>

      <OverUnderInput
        onChange={(overUnder) => {
          setOverUnder(overUnder);
        }}
      ></OverUnderInput>
    </main>
  );
}
