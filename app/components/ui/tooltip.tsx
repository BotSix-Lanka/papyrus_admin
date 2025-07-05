import React, { useState, ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
    >
      {children}
      {visible && (
        <span
          className={`absolute z-[9999] left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded bg-gray-900 text-white text-xs whitespace-pre-line shadow-lg ${className || ""}`}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}; 