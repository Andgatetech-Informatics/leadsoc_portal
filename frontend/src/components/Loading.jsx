import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // Optional spinner icon

const PercentageLoader = () => {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-800">
    

      {/* Progress Bar */}
      <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Percentage Text */}
      <p className="mt-3 text-sm text-gray-600 font-medium">
        Loading... {progress}%
      </p>
    </div>
  );
};

export default PercentageLoader;
