import { collection, CollectionReference, getDocs } from "firebase/firestore";
import { Child } from "~/child/child";
import app, { db } from "~/firebase";
import type { Route } from "./+types/child-route";
import type { User } from "~/model/user";
import type { Team } from "~/model/team";
import type { Line } from "~/model/line";

export async function clientLoader() {
  const [usersSnap, teamsSnap, linesSnap] = await Promise.all([
    getDocs(collection(db, "users") as CollectionReference<User>),
    getDocs(collection(db, " teams") as CollectionReference<Team>),
    getDocs(collection(db, "lines") as CollectionReference<Line>),
  ]);

  const users = usersSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  console.log("Users:", users);

  const teams = teamsSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  console.log("Teams:", teams);

  const lines = linesSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  console.log("Lines:", lines);

  return { users, teams, lines };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function ChildRoute({ loaderData }: Route.ComponentProps) {
  const { users, teams, lines } = loaderData;

  return <Child firebaseOptions={app.options} users={users} />;
}
