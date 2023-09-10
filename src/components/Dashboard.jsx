import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { IoMdCalendar, IoMdList } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import NoTimeLogsMessage from "./NoTimeLogsMessage";
import { Button, Loader } from "./shared";
import apiRequest from "../utils/apiRequest";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function EventComponent({ event }) {
  return (
    <div>
      <strong>{event.title}</strong>
      <div>Time In: {event.timeInfo.timeIn}</div>
      <div>Time Out: {event.timeInfo.timeOut}</div>
    </div>
  );
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLogs, setTimeLogs] = useState([]);
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [view, setView] = useState("table"); // 'table' or 'calendar'
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimeLogs();
    fetchLatestTimeLog();
  }, [currentUser.id]);

  const fetchLatestTimeLog = async () => {
    try {
      setIsLoading(true);
      const [data, error] = await apiRequest(
        "get",
        `/time/logs/latest/${currentUser.id}`
      );

      if (data?.data) {
        const latestLog = data.data;
        setIsTimedIn(!!(latestLog?.timeIn && !latestLog.timeOut));
      } else {
        console.error("Failed to fetch latest time log:", error);
        setIsTimedIn(false); // By default, assume user is not timed in
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      setIsLoading(true);
      const [data, error] = await apiRequest("get", "/time/logs/currentUser");

      if (data?.data) {
        setTimeLogs(data.data);
      } else {
        console.error("Failed to fetch time logs:", error);
        toast.error("Failed to fetch time logs. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeIn = async () => {
    const [data, error] = await apiRequest("post", "/time/in");

    if (data?.data) {
      toast.success(data.message);
      // Assuming your backend will return the new log on a successful time-in
      setIsTimedIn(true); // update the state to reflect the user has timed in
      setTimeLogs((prevLogs) => [...prevLogs, data.data]);
    } else {
      const errorMessage = error.message || "Error timing in.";
      toast.error(errorMessage);
    }
  };

  const handleTimeOut = async () => {
    const [data, error] = await apiRequest("post", "/time/out");

    if (data) {
      toast.success(data.message);
      setIsTimedIn(false); // update the state to reflect the user has timed out
      fetchTimeLogs(); // fetch the updated time logs
    } else {
      const errorMessage = error.message || "Failed to time out.";
      toast.error(errorMessage);
    }
  };

  const events = timeLogs.map((log) => ({
    title: `Hours Worked: ${
      log.hoursWorked ? log.hoursWorked.toFixed(2) : "Incomplete"
    }`,
    start: new Date(log.timeIn),
    end: log.timeOut ? new Date(log.timeOut) : new Date(log.timeIn),
    allDay: false,
    timeInfo: {
      timeIn: new Date(log.timeIn).toLocaleTimeString(),
      timeOut: log.timeOut
        ? new Date(log.timeOut).toLocaleTimeString()
        : "Not Yet",
    },
  }));

  const handleLogout = async () => {
    // If you have a backend route for logout:
    const [data, error] = await apiRequest("post", "/auth/logout");

    if (data?.status === "success") {
      logout();
      navigate("/login"); // Redirect to login after logout.
    } else {
      const errorMessage = error.message || "Failed to logout.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">HCM Dashboard</h2>
        <Button onClick={handleLogout} variant="danger" rounded>
          Logout
        </Button>
      </div>
      <p className="text-gray-600 mb-4">
        Welcome,{" "}
        <span className="text-gray-800 font-bold">{currentUser.username}</span>!
      </p>
      <div className="flex items-center justify-between">
        <div>
          {isTimedIn ? (
            <Button onClick={handleTimeOut} variant="danger" rounded>
              Time Out
            </Button>
          ) : (
            <Button onClick={handleTimeIn} rounded>
              Time In
            </Button>
          )}
          {/* Toggle View Buttons */}
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => setView("table")}
            icon={<IoMdList size={20} />} // Adjust size as needed
            tooltip="Table View"
          ></Button>
          <Button
            onClick={() => setView("calendar")}
            icon={<IoMdCalendar size={20} />} // Adjust size as needed
            tooltip="Calendar View"
          ></Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Fetching time logs..." />
      ) : timeLogs.length ? (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md overflow-x-auto max-h-[42rem] overflow-y-auto">
          <h3 className="text-xl mb-4">Your Time Logs:</h3>
          {/* Conditional Rendering based on the view */}
          {view === "table" ? (
            <>
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time In</th>
                    <th className="px-4 py-2 text-left">Time Out</th>
                    <th className="px-4 py-2 text-left">Hours Worked</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {timeLogs.map((log) => (
                    <tr key={log._id}>
                      <td className="border px-4 py-2">{log._id}</td>
                      <td className="border px-4 py-2">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(log.timeIn).toLocaleTimeString()}
                      </td>
                      <td className="border px-4 py-2">
                        {log.timeOut ? (
                          new Date(log.timeOut).toLocaleTimeString()
                        ) : (
                          <span className="font-bold">
                            Time out not recorded yet
                          </span>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {log.hoursWorked ? (
                          log.hoursWorked.toFixed(2)
                        ) : (
                          <span className="font-bold">
                            Total hours not available yet
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              components={{
                event: EventComponent,
              }}
            />
          )}
        </div>
      ) : (
        <NoTimeLogsMessage />
      )}
    </div>
  );
};

export default Dashboard;
