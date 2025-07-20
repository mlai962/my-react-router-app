import { useState } from "react";

export default function OverUnderInput() {
  const [isOverSelected, setIsOverSelected] = useState(false);
  const [isUnderSelected, setIsUnderSelected] = useState(false);

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
              isOverSelected
                ? "bg-purple-300 dark:bg-purple-500"
                : "bg-gray-400 dark:bg-gray-800"
            }
        `}
        onClick={() => {
          setIsOverSelected(true);
          setIsUnderSelected(false);
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
              isUnderSelected
                ? "bg-purple-300 dark:bg-purple-500"
                : "bg-gray-400 dark:bg-gray-800"
            }
        `}
        onClick={() => {
          setIsUnderSelected(true);
          setIsOverSelected(false);
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
      />
    </div>
  );
}
