import React, { useEffect, type MouseEvent, type ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50"
      // Don't allow outside click to dismiss
      onClick={() => {
        // No-op (modal stays open)
      }}
    >
      <div
        className="min-w-sm min-h-64 max-w-max max-h-max bg-gray-900 border-2 border-purple-900 rounded-lg p-8 relative"
        onClick={stopPropagation}
      >
        <button
          className="absolute top-1 right-3 text-xl text-white cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
