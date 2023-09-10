import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestOnlyRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser) {
    // Redirect to the dashboard if a user is already authenticated
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
}

export default GuestOnlyRoute;
