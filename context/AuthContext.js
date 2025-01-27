import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { getAuthData, getItems } from "../src/store";
import { APP_LOGO } from "../constants";
import { get_features, profile_get } from "../src/api";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
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

  const getAuth = async (auth) => {
    setLoading(true);
    try {
      const user = await getAuthData();
      setUser(user);
      // const profile = await profile_get(user?.data?.profile_auth, user?.cookie);
      // setProfile(profile.data);
      const resp = await getItems(user, [
        { key: "profile", stateHook: setProfile, apiFallback: profile_get },
      ]);
      console.log("resp", profile, resp);
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };
  const getProfile = async () => {};
  useEffect(() => {
    getAuth();
  }, []);
  const refreshUser = async () => {
    await getAuth();
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, appLogo, darkLogo, refreshUser, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for accessing the contextg
export const useAuth = () => {
  return useContext(AuthContext);
};
