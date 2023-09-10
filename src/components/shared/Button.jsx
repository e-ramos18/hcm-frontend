import React from "react";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { FaSpinner } from "react-icons/fa";

function Button({
  variant = "primary",
  size = "medium",
  rounded = false,
  fullWidth = false,
  icon = null,
  tooltip = "",
  isLoading = false,
  children = null, // This prop can be optional
  ...props
}) {
  // Define the standard colors and sizes
  const COLORS = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    link: "bg-transparent hover:bg-transparent hover:underline text-blue-500", // Added link variant
  };

  const SIZES = {
    small: "text-sm px-2 py-1",
    medium: "text-base px-4 py-2",
    large: "text-lg px-6 py-3",
  };

  // Combine the classes
  const btnClasses = `
    ${COLORS[variant] || COLORS.primary} 
    ${SIZES[size] || SIZES.medium}
    ${rounded ? "rounded-full" : "rounded-md"}
    ${fullWidth ? "w-full" : ""}
    ${isLoading ? "cursor-not-allowed flex justify-center items-center" : ""}
  `;

  // If an icon is provided, render the icon button
  if (icon) {
    return (
      <Tooltip title={tooltip} position="bottom" trigger="mouseenter">
        <button
          className="bg-gray-600 hover:bg-gray-400 text-white w-10 h-10 rounded-full flex items-center justify-center"
          {...props}
        >
          {icon}
        </button>
      </Tooltip>
    );
  }

  return (
    <button className={`${btnClasses.trim()}`} {...props} disabled={isLoading}>
      {isLoading ? <FaSpinner className="animate-spin" /> : children}
    </button>
  );
}

export default Button;
