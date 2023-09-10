import { useAuth } from "../context/AuthContext"; // Adjust the path accordingly
import { Navigate } from "react-router-dom";

const ProtectedWrapper = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not authenticated, navigate to login
    return <Navigate to="/login" />;
  }

  // User is authenticated, render the child component
  return children;
};

export default ProtectedWrapper;
