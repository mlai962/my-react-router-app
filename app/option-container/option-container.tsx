type OptionContainerProps = {
  optionContainerName: string;
export default function OptionContainer({
  optionContainerName,
}: OptionContainerProps) {
  return (
    <div>
      <p className="px-2 font-bold text-xl">{optionContainerName}</p>
    <div
        className="flex w-full rounded-lg gap-2 p-2 border-1 
    bg-gray-400 dark:bg-gray-800 
            border-purple-500 dark:border-purple-700"
      >
      </div>
      </div>
  );
}
