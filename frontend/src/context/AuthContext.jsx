import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error reading auth data from localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []); // empty dependency is fine

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validate props for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
