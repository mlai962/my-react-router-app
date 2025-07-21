import { useState } from "react";
import { Handicap, OverUnder } from "~/model/binary-option-and-number";

export enum BinaryOptionType {
  OVER_UNDER,
  HANDICAP,
}

type BinaryOptionAndNumberInputProps = {
  onChange: (binaryOption: OverUnder | Handicap) => void;
  type: BinaryOptionType;
};

export default function BinaryOptionAndNumberInput({
  onChange,
  type,
}: BinaryOptionAndNumberInputProps) {
  const [isOptionOneSelected, setIsOptionOneSelected] = useState(true);
  const [isOptionTwoSelected, setIsOptionTwoSelected] = useState(false);

  const [value, setValue] = useState<number>(0.5);

  const handleOptionChange = (isOptionOne: boolean) => {
    setIsOptionOneSelected(isOptionOne);
    setIsOptionTwoSelected(!isOptionOne);

    executeOnChange(isOptionOne, value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.value is a string, so parse it
    const parsed = parseFloat(e.target.value);
    // if the field is empty, parsed will be NaN
    const newValue = !isNaN(parsed) ? parsed : 0;
    setValue(newValue);

    executeOnChange(isOptionOneSelected, newValue);
  };

  const executeOnChange = (isOptionOne: boolean, value: number) => {
    if (type === BinaryOptionType.OVER_UNDER) {
      onChange(new OverUnder(isOptionOne, value));
    } else if (type === BinaryOptionType.HANDICAP) {
      onChange(new Handicap(isOptionOne, value));
    }
  };

  return (
    <div
      className="flex w-max rounded-lg gap-2 p-2 border-1 
        bg-gray-400 dark:bg-gray-800 
        border-purple-500 dark:border-purple-700"
    >
      <button
        className={`w-16 h-16 rounded-lg border-1
          border-purple-500 dark:border-purple-700
          hover:bg-purple-200 dark:hover:bg-purple-600
          active:bg-purple-300 dark:active:bg-purple-500
          hover:cursor-pointer hover:disabled:cursor-not-allowed
            ${
              isOptionOneSelected
                ? "bg-purple-300 dark:bg-purple-500"
                : "bg-gray-400 dark:bg-gray-800"
            }
        `}
        onClick={() => {
          handleOptionChange(true);
        }}
      >
        {type === BinaryOptionType.OVER_UNDER ? "O" : "+"}
      </button>
      <button
        className={`w-16 h-16 rounded-lg border-1
          border-purple-500 dark:border-purple-700
          hover:bg-purple-200 dark:hover:bg-purple-600
          active:bg-purple-300 dark:active:bg-purple-500
          hover:cursor-pointer hover:disabled:cursor-not-allowed
            ${
              isOptionTwoSelected
                ? "bg-purple-300 dark:bg-purple-500"
                : "bg-gray-400 dark:bg-gray-800"
            }
        `}
        onClick={() => {
          handleOptionChange(false);
        }}
      >
        {type === BinaryOptionType.OVER_UNDER ? "U" : "-"}
      </button>
      <input
        className={`w-24 h-16 rounded-lg border-1 p-2
          border-purple-500 dark:border-purple-700
          hover:disabled:cursor-not-allowed
          focus:outline-none
        `}
        type="number"
        step="0.5"
        min="0.5"
        defaultValue="0.5"
        onChange={handleValueChange}
      />
    </div>
  );
}
