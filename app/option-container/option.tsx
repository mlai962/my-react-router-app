type OptionProps = {
  id: string;
  name: string;
  selected?: boolean;
  onClick: (id: string) => void;
};

export default function Option({ id, name, selected, onClick }: OptionProps) {
  return (
    <button type="button" onClick={() => onClick(id)}>
      <div
        className={`flex p-2 rounded-lg border-1
            bg-gray-400 dark:bg-gray-800 
            border-purple-500 dark:border-purple-700
            hover:bg-purple-200 dark:hover:bg-purple-600
            active:bg-purple-300 dark:active:bg-purple-500
            hover:cursor-pointer hover:disabled:cursor-not-allowed
            ${
              selected
                ? "bg-purple-300 dark:bg-purple-500"
                : "bg-gray-400 dark:bg-gray-800"
            }
        `}
      >
        <p className={`text-base font-normal`}>{name}</p>
      </div>
    </button>
  );
}
