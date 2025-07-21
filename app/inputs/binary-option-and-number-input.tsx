import { useState } from "react";
import type { OverUnder } from "~/model/binary-option-and-number";

type BinaryOptionAndNumberInputProps = {
  onChange: (overUnder: OverUnder) => void;
};

export default function BinaryOptionAndNumberInput({
  onChange,
}: BinaryOptionAndNumberInputProps) {
  const [isOptionOneSelected, setIsOptionOneSelected] = useState(true);
  const [isOptionTwoSelected, setIsOptionTwoSelected] = useState(false);

  const [value, setValue] = useState<number>(0.5);

  const handleOptionChange = (isOver: boolean) => {
    setIsOptionOneSelected(isOver);
    setIsOptionTwoSelected(!isOver);

    onChange({
      over: isOver,
      value: value,
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.value is a string, so parse it
    const parsed = parseFloat(e.target.value);
    // if the field is empty, parsed will be NaN
    const newValue = !isNaN(parsed) ? parsed : 0;
    setValue(newValue);

    onChange({
      over: isOptionOneSelected,
      value: newValue,
    });
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
        O
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
        U
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
