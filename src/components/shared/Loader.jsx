import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <FaSpinner className="animate-spin text-gray-600 h-10 w-10" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loader;
