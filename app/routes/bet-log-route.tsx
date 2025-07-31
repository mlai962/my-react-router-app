import { collection, CollectionReference, getDocs } from "firebase/firestore";
import { BetLog } from "~/bet-log/bet-log";
import { db } from "~/firebase";
import type { Route } from "./+types/bet-log-route";
import type { User } from "~/model/user";
import type { Team } from "~/model/team";
import type { Line } from "~/model/line";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bet Log" }, { name: "description", content: "Bet Log" }];
}

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

  const teams = teamsSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const lines = linesSnap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return { users, teams, lines };
}

export default function BetLogRoute({ loaderData }: Route.ComponentProps) {
  const { users, teams, lines } = loaderData;

  return <BetLog _users={users} _teams={teams} _lines={lines} />;
}
