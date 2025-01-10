import React from "react";

function Announcement({ message, onClose }) {
  return (
    <div
      className={`px-4 py-3 text-white bg-primary text-center font-lg-3`}
    >
      <p className="text-sm">{message}</p>
      <button
        onClick={onClose}
        className="mt-2 text-xs underline"
      >
        Dismiss
      </button>
    </div>
  );
}

export default Announcement;
