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
};

export default function OptionContainer({
  optionContainerName,
  options,
  maxOptionsSelectable,
  onSelectionChange,
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
      <p className="px-2 font-bold text-xl">{optionContainerName}</p>
      <div
        className="flex w-full rounded-lg gap-2 p-2 border-1 
            bg-gray-400 dark:bg-gray-800 
            border-purple-500 dark:border-purple-700"
      >
        {options.map((option) => (
          <Option
            key={option.id}
            id={option.id}
            name={option.name}
            selected={selectedIds.includes(option.id)}
            onClick={(id) => {
              handleClick(id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
