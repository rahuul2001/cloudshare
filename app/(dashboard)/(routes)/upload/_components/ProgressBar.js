import React from 'react';

function ProgressBar({ progress = 40 }) {
  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="bg-gray-400 rounded-full h-6 w-full relative">
        <div
          className="bg-primary rounded-full h-6"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-gray-700 text-md">{`${Number(progress).toFixed(2)}%`}</span>
    </div>
  );
}

export default ProgressBar;
