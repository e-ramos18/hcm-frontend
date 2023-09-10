import React, { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <h3 className="text-3xl font-semibold text-blue-800">
      {time.toLocaleTimeString()}
    </h3>
  );
}

export default Clock;
