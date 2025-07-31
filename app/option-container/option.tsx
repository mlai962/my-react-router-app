import type { ReactNode } from "react";

type OptionProps = {
  id: string;
  selected?: boolean;
  onClick: (id: string) => void;
  children: ReactNode;
};

const Option: React.FC<OptionProps> = ({ id, selected, onClick, children }) => {
  return (
    <button type="button" onClick={() => onClick(id)}>
      <div
        className={`flex p-2 rounded-lg
            hover:bg-purple-200 dark:hover:bg-purple-600
            active:bg-purple-300 dark:active:bg-purple-500
            hover:cursor-pointer hover:disabled:cursor-not-allowed
            ${
              selected
                ? "bg-purple-300 dark:bg-purple-500/75 border-purple-600 dark:border-purple-800 border-2"
                : "bg-gray-400 dark:bg-purple-700/50 border-purple-500 dark:border-purple-700 border-1"
            }
        `}
      >
        <p className={`text-base ${selected ? "font-bold" : "font-normal"}`}>
          {children}
        </p>
      </div>
    </button>
  );
};

export default Option;
