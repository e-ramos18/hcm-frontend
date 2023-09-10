import React, { createContext, useState, useContext, useMemo } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem("token", user.token);
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
    }),
    [currentUser]
  ); // useMemo will prevent re-creation of value unless currentUser changes

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
