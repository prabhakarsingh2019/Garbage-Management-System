import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Verify token structure before decoding
        if (
          !storedToken.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        ) {
          throw new Error("Invalid token format");
        }

        const decoded = jwt_decode(storedToken);

        // Check token expiration
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        // Set axios headers
        authService.setAuthToken(storedToken);

        // Fetch user data
        const userData = await authService.getMe();

        if (storedToken === localStorage.getItem("token")) {
          setUser(userData.user);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        authService.setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (newToken) => {
    try {
      if (!newToken) throw new Error("No token provided");

      // Basic token validation
      if (!newToken.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
        throw new Error("Invalid token format");
      }
      authService.setAuthToken(newToken);
      localStorage.setItem("token", newToken);

      const decoded = jwt_decode(newToken);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      const userData = await authService.getMe();
      console.log(userData);
      setUser(userData.user);
      setToken(newToken);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const register = async (newToken) => {
    await login(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    authService.setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    hasRole,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
