import { useState } from "react";
import ChatWindow from "./ChatWindow";
import { X } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Animated Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex items-center justify-center h-14 w-14 rounded-full bg-[#1e1e2f] hover:bg-[##1f2937] shadow-lg transition"
        >
          {/* Ping background animation */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1e1e2f] opacity-70"></span>

          {/* Icon changes based on open state */}
          <span className="relative z-10 flex items-center justify-center h-14 w-14 rounded-full bg-[#1e1e2f]">
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.79 9.79 0 01-4.9-1.3L3 20l1.3-3.1A8.964 8.964 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            )}
          </span>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 animate-slide-up">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
