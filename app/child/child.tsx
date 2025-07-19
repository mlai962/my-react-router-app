import { type FirebaseOptions } from "firebase/app";
import type { User } from "~/model/user";
import OptionContainer from "~/option-container/option-container";

export function Child({
  firebaseOptions,
  users,
}: {
  firebaseOptions: FirebaseOptions;
  users: User[];
}) {
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

      <OptionContainer></OptionContainer>
    </main>
  );
}
