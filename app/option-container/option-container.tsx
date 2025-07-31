import type { BaseFirebaseDocument } from "~/model/base-firebase-document";
import Option from "./option";
import { useEffect, useState } from "react";

type OptionContainerProps = {
  optionContainerName: string;
  options: BaseFirebaseDocument[];

  /** Maximum number of options that can be selected at once */
  maxOptionsSelectable: number;

  /**
   * Called whenever the selection changes.
   * Receives an array of IDs ordered from least-recently-used → most-recently-used.
   */
  onSelectionChange: (selectionOrder: string[]) => void;

  onAddOptionClick?: (optionContainerName: string) => void;
};

export default function OptionContainer({
  optionContainerName,
  options,
  maxOptionsSelectable,
  onSelectionChange,
  onAddOptionClick,
}: OptionContainerProps) {
  // [0] = most-recently-clicked, [..., last] = least-recently-clicked
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleClick = (id: string) => {
    setSelectedIds((prev) => {
      // 1) If already selected → unselect by filtering it out
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }

      // 2) Otherwise, new selection → evict LRU if at capacity
      const updated = [...prev];
      if (updated.length >= maxOptionsSelectable) {
        updated.pop(); // remove least‐recent
      }

      // 3) Add the clicked id as most‐recent
      updated.unshift(id);
      return updated;
    });
  };

  // Notify parent on every change, giving them [LRU → MRU]
  useEffect(() => {
    if (onSelectionChange) {
      const lruToMru = [...selectedIds].reverse();
      onSelectionChange(lruToMru);
    }
  }, [selectedIds]);

  return (
    <div>
      <p className="px-2 font-bold text-xl text-purple-200">
        {optionContainerName}
      </p>
      <div
        className="flex flex-wrap w-full rounded-lg gap-2 p-2 border-1 
            bg-gray-400 dark:bg-purple-950/10
            border-purple-500 dark:border-purple-700"
      >
        {options
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((option) => (
            <Option
              key={option.id}
              id={option.id}
              selected={selectedIds.includes(option.id)}
              onClick={(id) => {
                handleClick(id);
              }}
            >
              {option.name}
            </Option>
          ))}

        {onAddOptionClick ? (
          <Option
            key={`add-new-option-${optionContainerName}`}
            id={`add-new-option-${optionContainerName}`}
            selected={false}
            onClick={() => {
              if (onAddOptionClick) onAddOptionClick(optionContainerName);
            }}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Option>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
