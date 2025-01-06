import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { getAuthData } from "../src/store";
import { APP_LOGO } from "../constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const appLogo = useMemo(() => {
    return user?.data?.partner
      ? APP_LOGO[String(user?.data?.partner || "").toUpperCase()]
      : APP_LOGO.WORKPLAY;
  }, [user]);
  const darkLogo = useMemo(() => {
    return user?.data?.partner
      ? APP_LOGO[String(user?.data?.partner || "").toUpperCase() + "_DARK"]
      : APP_LOGO.WORKPLAY_DARK;
  }, [user]);
  const getAuth = async () => {
    setLoading(true);
    try {
      const user = await getAuthData();
      setUser(user);
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, appLogo, darkLogo }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for accessing the context
export const useAuth = () => {
  return useContext(AuthContext);
};
