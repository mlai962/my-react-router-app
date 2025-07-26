import {
  collection,
  CollectionReference,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { BetLog } from "~/bet-log/bet-log";
import { db } from "~/firebase";
import type { Route } from "./+types/bet-log-route";
import type { User } from "~/model/user";
import type { Team } from "~/model/team";
import type { Line } from "~/model/line";
import { Bet, type BetDto } from "~/model/bet";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bet Log" }, { name: "description", content: "Bet Log" }];
}

export async function clientLoader() {
  const [usersSnap, teamsSnap, linesSnap, betsSnap] = await Promise.all([
    getDocs(collection(db, "users") as CollectionReference<User>),
    getDocs(collection(db, " teams") as CollectionReference<Team>),
    getDocs(collection(db, "lines") as CollectionReference<Line>),
    getDocs(collection(db, "bets") as CollectionReference<BetDto>),
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

  const bets = await Promise.all(
    betsSnap.docs.map(async (doc) => {
      const docData = doc.data();

      const userA = await getDoc(docData.userA);
      const userB = await getDoc(docData.userB);
      const teamA = await getDoc(docData.teamA);
      const teamB = await getDoc(docData.teamB);
      const line = await getDoc(docData.line);

      return new Bet(docData, doc.id, userA, userB, teamA, teamB, line);
    })
  );

  console.log(bets);

  return { users, teams, lines };
}

export default function BetLogRoute({ loaderData }: Route.ComponentProps) {
  const { users, teams, lines } = loaderData;

  return <BetLog users={users} teams={teams} lines={lines} />;
}
