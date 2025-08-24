type BetAmountInputProps = {
  onChange: (amount: number) => void;
  placeholder: string;
  svgPath: string;
};

export default function NumberInput({
  onChange,
  placeholder,
  svgPath,
}: BetAmountInputProps) {
  return (
    <div
      className="flex w-max rounded-lg gap-2 p-2 border-1 items-center
        bg-gray-400 dark:bg-purple-950/10
        border-purple-500 dark:border-purple-700
        hover:disabled:cursor-not-allowed
        focus:outline-none"
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
          d={svgPath}
        />
      </svg>

      <input
        className="w-52 h-16 focus:outline-none text-xl font-semibold caret-purple-400"
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;

          const n = Number(raw);
          onChange(Number.isNaN(n) ? 0 : n);
        }}
      />
    </div>
  );
}
