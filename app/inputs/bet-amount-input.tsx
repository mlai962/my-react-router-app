type BetAmountInputProps = {
  onChange: (amount: number) => void;
};

export default function BetAmountInput({ onChange }: BetAmountInputProps) {
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
          d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
        />
      </svg>

      <input
        className="w-52 h-16 focus:outline-none text-xl font-semibold"
        type="text"
        placeholder="bet amount..."
        onChange={(e) => {
          const raw = e.target.value;

          const n = Number(raw);
          onChange(Number.isNaN(n) ? 0 : n);
        }}
      />
    </div>
  );
}
