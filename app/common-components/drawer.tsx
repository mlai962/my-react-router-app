import { useState, type ReactNode } from "react";

type DrawerProps = {
  children: ReactNode;
};

/**
 * A slide-in drawer that appears from the right when opened.
 * - Clicking the open button slides the drawer in.
 * - Clicking the close (×) button or outside overlay closes it.
 * - Uses Tailwind CSS for styling and transitions.
 */
const Drawer = ({ children }: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Floating Open Button */}
      {!isOpen && (
        <button
          onClick={openDrawer}
          className="fixed bottom-8 left-8 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 focus:outline-none"
          aria-label="Open Drawer"
        >
          Open
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
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
        role="dialog"
        aria-modal={isOpen}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={closeDrawer}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Close Drawer"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {/* Drawer content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
