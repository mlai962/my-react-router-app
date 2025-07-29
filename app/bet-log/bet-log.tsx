import { useEffect, useState } from "react";
import BinaryOptionAndNumberInput, {
  BinaryOptionType,
} from "~/inputs/binary-option-and-number-input";
import { LineType, type Line } from "~/model/line";
import { Handicap, OverUnder } from "~/model/binary-option-and-number";
import type { Team } from "~/model/team";
import type { User } from "~/model/user";
import OptionContainer from "~/option-container/option-container";
import NumberInput from "~/inputs/bet-amount-input";
import BetSummary from "./bet-summary";
import {
  Bet,
  EXTRA_BINARY_LINE_OPTION,
  EXTRA_BINARY_LINE_VALUE,
  type BetDto,
} from "~/model/bet";
import BetHistory from "./bet-history";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "~/firebase";

type BetLogProps = {
  users: User[];
  teams: Team[];
  lines: Line[];
};

export function BetLog({ users, teams, lines }: BetLogProps) {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bets") as CollectionReference<BetDto>,
      async (snapshot) => {
        const bets = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const docData = doc.data();

            const userA = await getDoc(docData.userA);
            const userB = await getDoc(docData.userB);
            const teamA = await getDoc(docData.teamA);
            const teamB = await getDoc(docData.teamB);
            const line = await getDoc(docData.line);

            return new Bet(docData, doc.id, userA, userB, teamA, teamB, line);
          })
        );

        setBets(
          [...bets].sort((a, b) => b.date.toMillis() - a.date.toMillis())
        );

        console.log(bets);
      }
    );

    return () => unsubscribe();
  }, []);

  const [balanceCampbell, setBalanceCampbell] = useState(0);
  const [balanceJungwoo, setBalanceJungwoo] = useState(0);

  useEffect(() => {
    setBalanceCampbell(calculateBalance("Campbell", bets));
    setBalanceJungwoo(calculateBalance("Jungwoo", bets));
  }, [bets]);

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

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [overUnder, setOverUnder] = useState<OverUnder>({
    over: true,
    value: 0.5,
  });

  const [handicap, setHandicap] = useState<Handicap>({
    plus: true,
    value: 0.5,
  });

  const [odds, setOdds] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(0);

  const handleBetSubmit = async () => {
    if (selectedUserIds.length < 2) return;
    if (selectedTeamIds.length < 2) return;
    if (selectedMapId.length === 0) return;
    if (selectedLineId.length === 0) return;
    if (odds <= 0) return;
    if (betAmount <= 0) return;

    await addDoc(collection(db, "bets"), {
      userA: doc(db, "users", selectedUserIds[0]) as DocumentReference<
        User,
        DocumentData
      >,
      userB: doc(db, "users", selectedUserIds[1]) as DocumentReference<
        User,
        DocumentData
      >,
      teamA: doc(db, " teams", selectedTeamIds[0]) as DocumentReference<
        Team,
        DocumentData
      >,
      teamB: doc(db, " teams", selectedTeamIds[1]) as DocumentReference<
        Team,
        DocumentData
      >,
      line: doc(db, "lines", selectedLineId) as DocumentReference<
        Line,
        DocumentData
      >,
      map: mapMap.get(selectedMapId)?.name!,
      extras: {
        [EXTRA_BINARY_LINE_OPTION]:
          lineMap.get(selectedLineId)?.lineType === LineType.OVER_UNDER
            ? overUnder.over
            : handicap.plus,
        [EXTRA_BINARY_LINE_VALUE]:
          lineMap.get(selectedLineId)?.lineType === LineType.OVER_UNDER
            ? overUnder.value
            : handicap.value,
      },
      betAmount: betAmount,
      date: Timestamp.fromDate(new Date(date)),
      odds: odds,
      winner: "",
    });
  };

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
        odds={odds}
        betAmount={betAmount}
        date={date}
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

      <div className="flex flex-wrap justify-between gap-2">
        <div
          className="w-[258px] h-[82px] p-2 rounded-lg border-1 text-purple-200
            bg-gray-400 dark:bg-purple-950/10
            border-purple-500 dark:border-purple-700"
        >
          <input
            type="date"
            value={date}
            className="w-full h-full focus:outline-none"
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>

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

        <NumberInput
          onChange={(odds) => setOdds(odds)}
          placeholder="odds..."
          svgPath="M8.891 15.107 15.11 8.89m-5.183-.52h.01m3.089 7.254h.01M14.08 3.902a2.849 2.849 0 0 0 2.176.902 2.845 2.845 0 0 1 2.94 2.94 2.849 2.849 0 0 0 .901 2.176 2.847 2.847 0 0 1 0 4.16 2.848 2.848 0 0 0-.901 2.175 2.843 2.843 0 0 1-2.94 2.94 2.848 2.848 0 0 0-2.176.902 2.847 2.847 0 0 1-4.16 0 2.85 2.85 0 0 0-2.176-.902 2.845 2.845 0 0 1-2.94-2.94 2.848 2.848 0 0 0-.901-2.176 2.848 2.848 0 0 1 0-4.16 2.849 2.849 0 0 0 .901-2.176 2.845 2.845 0 0 1 2.941-2.94 2.849 2.849 0 0 0 2.176-.901 2.847 2.847 0 0 1 4.159 0Z"
        ></NumberInput>

        <NumberInput
          onChange={(amount) => setBetAmount(amount)}
          placeholder="bet amount..."
          svgPath="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
        ></NumberInput>

        <button
          type="button"
          onClick={() => handleBetSubmit()}
          className="w-[258px] h-[82px] rounded-lg border-1 text-purple-200
            bg-gray-400 dark:bg-purple-950/10
            border-purple-500 dark:border-purple-700
            hover:bg-purple-200 dark:hover:bg-purple-600
            active:bg-purple-300 dark:active:bg-purple-500
            hover:cursor-pointer hover:disabled:cursor-not-allowed"
        >
          submit gamba
        </button>
      </div>

      <BetHistory
        bets={bets}
        handleBetSettlement={handleBetSettlement}
      ></BetHistory>
    </main>
  );
}
