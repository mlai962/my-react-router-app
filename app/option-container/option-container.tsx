import type { BaseFirebaseDocument } from "~/model/base-firebase-document";
import Option from "./option";
type OptionContainerProps = {
  optionContainerName: string;
  options: BaseFirebaseDocument[];
};
export default function OptionContainer({
  optionContainerName,
  options,
}: OptionContainerProps) {
  const handleClick = (id: string) => {
  };

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
