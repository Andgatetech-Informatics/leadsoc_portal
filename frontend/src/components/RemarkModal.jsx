import { ArrowUp, ArrowUpNarrowWide } from "lucide-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const RemarkModal = ({ isOpen, onClose, onSave, initialRemark }) => {
  const [remarks, setRemarks] = useState([]);
  const [remarkText, setRemarkText] = useState("");
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.user);

  const currentUserId = user?.userData?._id;

  const getDateLabel = (date) => {
    const msgDate = moment(date).startOf("day");
    const today = moment().startOf("day");

    if (msgDate.isSame(today)) return "Today";
    if (msgDate.isSame(today.clone().subtract(1, "day"))) return "Yesterday";

    return msgDate.format("DD MMM YYYY");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [remarks]);

  useEffect(() => {
    if (isOpen) setRemarks(initialRemark || []);
  }, [isOpen, initialRemark]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
      absolute right-0 top-0 h-full w-full sm:w-[420px]
      bg-white border-l border-gray-200
      transform transition-transform duration-300 ease-out
      ${isOpen ? "translate-x-0" : "translate-x-full"}
    `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Candidate Remarks
            </h2>
            <p className="text-xs text-gray-500">
              Internal HR notes and interview feedback
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-700"
            aria-label="Close remarks panel"
          >
            <FaTimes size={16} />
          </button>
        </header>

        {/* Content */}
        <section className="flex flex-col h-[calc(90vh-140px)] px-6 py-4">
          {/* Saved Remarks – Scrollable */}
          <div className="flex-1 overflow-y-auto bg-[#efeae2] p-3 space-y-3">
            {remarks.map((remark, index) => {
              const isMe = String(remark.by) === String(currentUserId);

              const currentDateLabel = getDateLabel(remark.date);
              const previousDateLabel =
                index > 0 ? getDateLabel(remarks[index - 1].date) : null;

              return (
                <div key={remark._id || index}>
                  {/* Date separator */}
                  {currentDateLabel !== previousDateLabel && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {currentDateLabel}
                      </span>
                    </div>
                  )}

                  {/* Message row */}
                  <div
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className="
            max-w-[70%] bg-white px-4 py-2 rounded-lg
            text-sm text-gray-800 shadow-sm border
          "
                    >
                      {/* Name / Me */}
                      <p
                        className={`text-xs font-medium  ${
                          isMe
                            ? "text-gray-500 text-left"
                            : "text-blue-600 text-left"
                        }`}
                      >
                        {isMe ? "Me" : remark.name}
                      </p>

                      {/* Message */}
                      <p className="leading-relaxed">{remark.title}</p>

                      {/* Time */}
                      <div className="mt-1 text-[11px] text-gray-400 text-right">
                        {moment(remark.date).format("hh:mm A")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        </section>

        <footer className="absolute bottom-2 w-full border-t bg-white px-4 py-3">
          <div className="flex items-end gap-3">
            {/* Message input */}
            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              rows={4}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (remarkText.trim()) {
                    onSave(remarkText);
                    setRemarkText("");
                  }
                }
              }}
              className="
        flex-1 resize-none rounded-xl border border-gray-300
        px-4 py-2 text-sm text-gray-800
        focus:outline-none focus:ring-1 focus:ring-blue-600
        max-h-32 overflow-y-auto
      "
              placeholder="Type a remark…"
            />
            <button
              onClick={() => {
                if (!remarkText.trim()) return;
                onSave(remarkText);
                setRemarkText("");
              }}
              disabled={!remarkText.trim()}
              className="
    bg-blue-700 text-white rounded-xl
    px-3 py-2
    hover:bg-blue-700 disabled:opacity-40
    flex items-center justify-center
  "
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
};

export default RemarkModal;
