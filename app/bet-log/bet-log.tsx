import { useEffect, useState } from "react";
import BinaryOptionAndNumberInput, {
  BinaryOptionType,
} from "../inputs/binary-option-and-number-input";
import { LineType, type Line } from "../model/line";
import { Handicap, OverUnder } from "../model/binary-option-and-number";
import type { Team } from "../model/team";
import type { User } from "../model/user";
import OptionContainer from "../option-container/option-container";
import NumberInput from "../inputs/bet-amount-input";
import BetSummary from "./bet-summary";
import {
  Bet,
  EXTRA_BINARY_LINE_OPTION,
  EXTRA_BINARY_LINE_VALUE,
  type BetDto,
} from "../model/bet";
import BetHistory from "./bet-history";
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import Modal from "../common-components/modal";
import Drawer from "../common-components/drawer";
import Spinner from "../common-components/spinner";

type BetLogProps = {
  _users: User[];
  _teams: Team[];
  _lines: Line[];
};

export function BetLog({ _users, _teams, _lines }: BetLogProps) {
  const [users, setUsers] = useState<User[]>(_users);
  const [teams, setTeams] = useState<Team[]>(_teams);
  const [lines, setLines] = useState<Line[]>(_lines);
  const [bets, setBets] = useState<Bet[]>([]);

  const [maps, setMaps] = useState<{ id: string; name: string }[]>([
    { id: "mapMatch", name: "Match" },
    { id: "map1", name: "Map 1" },
    { id: "map2", name: "Map 2" },
    { id: "map3", name: "Map 3" },
    { id: "map4", name: "Map 4" },
    { id: "map5", name: "Map 5" },
  ]);

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
      }
    );

    return () => unsubscribe();
  }, []);

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

  const [isShowBetSubmitSpinner, setIsShowBetSubmitSpinner] =
    useState<boolean>(false);
  const handleBetSubmit = async () => {
    if (selectedUserIds.length < 2) return;
    if (selectedTeamIds.length < 2) return;
    if (selectedMapId.length === 0) return;
    if (selectedLineId.length === 0) return;
    if (odds <= 0) return;
    if (betAmount <= 0) return;

    setIsShowBetSubmitSpinner(true);

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
      map: maps.find((m) => m.id === selectedMapId)?.name!,
      extras: {
        [EXTRA_BINARY_LINE_OPTION]:
          lines.find((l) => l.id === selectedLineId)?.lineType ===
          LineType.OVER_UNDER
            ? overUnder.over
            : handicap.plus,
        [EXTRA_BINARY_LINE_VALUE]:
          lines.find((l) => l.id === selectedLineId)?.lineType ===
          LineType.OVER_UNDER
            ? overUnder.value
            : handicap.value,
      },
      betAmount: betAmount,
      date: Timestamp.fromDate(new Date(date)),
      odds: odds,
      winner: "",
    });

    setIsShowBetSubmitSpinner(false);
  };

  const [isShowBetSettlementSpinner, setIsShowBetSettlementSpinner] =
    useState<boolean>(false);
  const [currentBetIdBeingSettled, setCurrentBetIdBeingSettled] =
    useState<string>("");
  const handleBetSettlement = async (betId: string, winner: string) => {
    setIsShowBetSettlementSpinner(true);
    setCurrentBetIdBeingSettled(betId);

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

    setIsShowBetSettlementSpinner(false);
    setCurrentBetIdBeingSettled("");
  };
  const handleBetDeletion = async (betId: string) => {
    setIsShowBetSettlementSpinner(true);
    setCurrentBetIdBeingSettled(betId);

    await deleteDoc(doc(db, "bets", betId));

    setIsShowBetSettlementSpinner(false);
    setCurrentBetIdBeingSettled("");
  };

  const [isAddOptionModalOpen, setIsAddOptionModalOpen] =
    useState<boolean>(false);
  const [
    addOptionModalOptionContainerName,
    setAddOptionModalOptionContainerName,
  ] = useState<string>("");
  const [newOptionName, setNewOptionName] = useState<string>("");
  const [newLineType, setNewLineType] = useState<LineType>(LineType.NONE);
  const handleOnAddOptionClick = (optionContainerName: string) => {
    setAddOptionModalOptionContainerName(optionContainerName);
    setNewOptionName("");

    setIsAddOptionModalOpen(true);
  };
  const handleAddNewOption = async () => {
    setIsAddOptionModalOpen(false);

    const collectionName =
      addOptionModalOptionContainerName === "Teams"
        ? " teams"
        : addOptionModalOptionContainerName.toLowerCase();

    if (collectionName === "Maps") {
      setMaps((prev) => [
        ...prev,
        { id: `newOptionName-${Date.now()}`, name: newOptionName },
      ]);
    } else {
      const newOption = {
        name: newOptionName,
        ...(collectionName === "lines" && { lineType: newLineType }),
      };

      const docRef = await addDoc(collection(db, collectionName), newOption);

      if (collectionName === "users") {
        setUsers((prev) => [...prev, { ...newOption, id: docRef.id }]);
      } else if (collectionName === " teams") {
        setTeams((prev) => [...prev, { ...newOption, id: docRef.id }]);
      } else if (collectionName === "lines") {
        setLines((prev) => [
          ...prev,
          { name: newOptionName, lineType: newLineType, id: docRef.id },
        ]);
      }
    }
  };

  return (
    <main className="flex-col p-8 space-y-4">
      <Drawer
        trigger={
          <div className="bg-gray-900 border-1 border-purple-800 p-4 rounded-lg shadow-lg hover:bg-gray-800 hover:border-2">
            Show Balances
          </div>
        }
        triggerSize="w-max h-max"
        width="w-80"
      >
        <div className="flex-col space-y-4">
          {users.map((u) => {
            return (
              <div>
                <div className="font-extrabold underline">{u.name}</div>
                <div>
                  Total Net Profit:{" "}
                  {formatProfit(calculateProfit(u.name, "", bets))}
                  {users
                    .filter((u2) => u2.id != u.id)
                    .map((u2) => {
                      return (
                        <div>
                          Profit vs {u2.name}:{" "}
                          {formatProfit(calculateProfit(u.name, u2.name, bets))}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </Drawer>

      <Modal
        isOpen={isAddOptionModalOpen}
        onClose={() => setIsAddOptionModalOpen(false)}
      >
        <div className="w-full min-h-64 flex flex-col justify-between items-center text-purple-200">
          <div className="text-white text-xl">
            Add a new option to the{" "}
            <span className="font-bold">
              {addOptionModalOptionContainerName}
            </span>{" "}
            list
          </div>

          <div
            className="flex w-full h-14 rounded-lg gap-2 p-2 border-1 items-center
              bg-gray-400 dark:bg-purple-950/10
              border-purple-500 dark:border-purple-700
              focus:outline-none"
          >
            <input
              className="w-full h-8 focus:outline-none text-xl text-center font-semibold"
              type="text"
              placeholder="New option name..."
              onChange={(e) => {
                setNewOptionName(e.target.value);
              }}
            />
          </div>

          {addOptionModalOptionContainerName === "Lines" ? (
            <div className="w-full flex justify-between">
              <button
                className={`w-16 h-16 rounded-lg border-1
                  border-purple-500 dark:border-purple-700
                  hover:bg-purple-200 dark:hover:bg-purple-600
                  active:bg-purple-300 dark:active:bg-purple-500
                  hover:cursor-pointer hover:disabled:cursor-not-allowed
                  ${
                    newLineType === LineType.NONE
                      ? "bg-purple-300 dark:bg-purple-500/75"
                      : "bg-gray-400 dark:bg-purple-700/50"
                  }
                `}
                onClick={() => {
                  setNewLineType(LineType.NONE);
                }}
              >
                N/A
              </button>
              <button
                className={`w-16 h-16 rounded-lg border-1
                  border-purple-500 dark:border-purple-700
                  hover:bg-purple-200 dark:hover:bg-purple-600
                  active:bg-purple-300 dark:active:bg-purple-500
                  hover:cursor-pointer hover:disabled:cursor-not-allowed
                    ${
                      newLineType === LineType.OVER_UNDER
                        ? "bg-purple-300 dark:bg-purple-500/75"
                        : "bg-gray-400 dark:bg-purple-700/50"
                    }
                `}
                onClick={() => {
                  setNewLineType(LineType.OVER_UNDER);
                }}
              >
                O/U
              </button>
              <button
                className={`w-16 h-16 rounded-lg border-1
                  border-purple-500 dark:border-purple-700
                  hover:bg-purple-200 dark:hover:bg-purple-600
                  active:bg-purple-300 dark:active:bg-purple-500
                  hover:cursor-pointer hover:disabled:cursor-not-allowed
                    ${
                      newLineType === LineType.HANDICAP
                        ? "bg-purple-300 dark:bg-purple-500/75"
                        : "bg-gray-400 dark:bg-purple-700/50"
                    }
                `}
                onClick={() => {
                  setNewLineType(LineType.HANDICAP);
                }}
              >
                +/-
              </button>
            </div>
          ) : (
            <></>
          )}

          <button
            className="flex w-full h-14 rounded-lg gap-2 p-2 border-1 items-center justify-center text-2xl font-bold
              bg-gray-400 dark:bg-purple-950/10
              border-purple-500 dark:border-purple-700
              hover:bg-purple-200 dark:hover:bg-purple-600
              cursor-pointer focus:outline-none"
            onClick={() => handleAddNewOption()}
          >
            Submit
          </button>
        </div>
      </Modal>

      <div className="w-full h-max text-4xl font-semibold text-center text-purple-200">
        gamba kappachungus deluxe
      </div>

      <BetSummary
        userA={
          selectedUserIds.length > 0
            ? users.find((u) => u.id === selectedUserIds[0]) ?? null
            : null
        }
        userB={
          selectedUserIds.length > 1
            ? users.find((u) => u.id === selectedUserIds[1]) ?? null
            : null
        }
        teamA={
          selectedTeamIds.length > 0
            ? teams.find((t) => t.id === selectedTeamIds[0]) ?? null
            : null
        }
        teamB={
          selectedTeamIds.length > 1
            ? teams.find((t) => t.id === selectedTeamIds[1]) ?? null
            : null
        }
        map={
          selectedMapId.length > 0
            ? maps.find((m) => m.id === selectedMapId)?.name ?? null
            : null
        }
        line={
          selectedLineId.length > 0
            ? lines.find((l) => l.id === selectedLineId) ?? null
            : null
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
        onAddOptionClick={(optionContainerName) =>
          handleOnAddOptionClick(optionContainerName)
        }
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Teams"
        options={teams}
        maxOptionsSelectable={2}
        onSelectionChange={(selectionOrder) => {
          setSelectedTeamIds(selectionOrder);
        }}
        onAddOptionClick={(optionContainerName) =>
          handleOnAddOptionClick(optionContainerName)
        }
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Maps"
        options={maps}
        maxOptionsSelectable={1}
        onSelectionChange={(selectionOrder) => {
          setSelectedMapId(selectionOrder[0] || "");
        }}
        onAddOptionClick={(optionContainerName) =>
          handleOnAddOptionClick(optionContainerName)
        }
      ></OptionContainer>

      <OptionContainer
        optionContainerName="Lines"
        options={lines}
        maxOptionsSelectable={1}
        onSelectionChange={(selectionOrder) => {
          setSelectedLineId(selectionOrder[0] || "");
        }}
        onAddOptionClick={(optionContainerName) =>
          handleOnAddOptionClick(optionContainerName)
        }
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
          className="w-[258px] h-[82px] rounded-lg border-1 text-purple-200 relative
            bg-gray-400 dark:bg-purple-950/10
            border-purple-500 dark:border-purple-700
            hover:bg-purple-200 dark:hover:bg-purple-600
            active:bg-purple-300 dark:active:bg-purple-500
            hover:cursor-pointer hover:disabled:cursor-not-allowed"
        >
          <span className={`${isShowBetSubmitSpinner ? "opacity-20" : ""}`}>
            submit gamba
          </span>
          <Spinner isShowSpinner={isShowBetSubmitSpinner} />
        </button>
      </div>

      <BetHistory
        bets={bets}
        handleBetSettlement={handleBetSettlement}
        handleBetDeletion={handleBetDeletion}
        isShowBetSettlementSpinner={isShowBetSettlementSpinner}
        currentBetIdBeingSettled={currentBetIdBeingSettled}
      ></BetHistory>
    </main>
  );
}

/**
 * userA: the user whose balance is being calculated, the return value is net profit relative to them
 * userB: the other user who userA's profit is being calculated against, EMPTY STRING if all users
 */
const calculateProfit = (userA: string, userB: string, bets: Bet[]) => {
  return bets.reduce((total, bet) => {
    var multiplier: number;

    if (bet.odds == 1.33) {
      multiplier = 4 / 3;
    } else if (bet.odds == 1.66) {
      multiplier = 5 / 3;
    } else {
      multiplier = bet.odds;
    }

    if (
      bet.userA.name === userA &&
      (bet.userB.name === userB || userB === "") &&
      bet.winner === "userA"
    ) {
      return total + bet.betAmount * (multiplier - 1);
    } else if (
      bet.userA.name === userA &&
      (bet.userB.name === userB || userB === "") &&
      bet.winner === "userB"
    ) {
      return total - bet.betAmount;
    } else if (
      bet.userB.name === userA &&
      (bet.userA.name === userB || userB === "") &&
      bet.winner === "userA"
    ) {
      return total - bet.betAmount * (multiplier - 1);
    } else if (
      bet.userB.name === userA &&
      (bet.userA.name === userB || userB === "") &&
      bet.winner === "userB"
    ) {
      return total + bet.betAmount;
    }

    return total;
  }, 0.0);
};

const formatProfit = (profit: number) => {
  return `${profit < 0 ? "-" : "+"}$${profit < 0 ? -profit : profit}`;
};
