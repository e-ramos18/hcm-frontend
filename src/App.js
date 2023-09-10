import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedWrapper, GuestOnlyRoute } from "./hoc";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import apiRequest from "./utils/apiRequest";

function App() {
  useEffect(() => {
    (async () => {
      const [data, error] = await apiRequest("get", "/test");

      if (data?.message === "Backend is working!") {
        // This is optional. You can also decide to do nothing on success.
        toast.success("Backend is operational!");
      } else {
        toast.error("Backend is not operational at the moment.");
      }
    })();
  }, []);
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="bottom-right" />
        <Routes>
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <Login />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyRoute>
                <Register />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedWrapper>
                <Dashboard />
              </ProtectedWrapper>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
