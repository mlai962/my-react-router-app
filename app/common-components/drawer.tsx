import { useState, type ReactNode } from "react";

type DrawerProps = {
  trigger: ReactNode;
  triggerSize: string;
  width: string;
  children: ReactNode;
};

/**
 * A slide-in drawer that appears from the right when opened.
 * - Clicking the open button slides the drawer in.
 * - Clicking the close (×) button or outside overlay closes it.
 * - Uses Tailwind CSS for styling and transitions.
 */
const Drawer = ({ trigger, triggerSize, width, children }: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Floating Open Button */}
      {!isOpen && (
        <button
          onClick={openDrawer}
          className={`fixed ${triggerSize} bottom-4 right-4 shadow-lg z-50 cursor-pointer focus:outline-none`}
          aria-label="Open Drawer"
        >
          {trigger}
        </button>
      )}

      {/* Overlay: clicking closes drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent h-full z-40"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full ${width} bg-white dark:bg-gray-950 border-l-2 border-purple-800 shadow-xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
        role="dialog"
        aria-modal={isOpen}
      >
        <div className="absolute top-2 right-2 flex justify-between items-center">
          <button onClick={closeDrawer} aria-label="Close Drawer">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
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
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
        </div>
        <div className="mt-6 p-4">
          {/* Drawer content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
