// RefreshContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";

type RefreshContextType = {
  refreshFlag: number;
  triggerRefresh: () => void;
  isRefreshing: boolean;
  setIsRefreshing: (value: boolean) => void;
  darkmode: boolean;
  setDarkmode: (value: boolean) => void;
};

type RefreshProviderProps = {
  children: React.ReactNode;
};

const RefreshContext = createContext<RefreshContextType | null>(null);

export function RefreshProvider({ children }: RefreshProviderProps) {

  const [refreshFlag, setRefreshFlag] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [darkmode, setDarkmode] = useState(false);

  // ✅ Load from storage ONCE
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const value = await AsyncStorage.getItem("darkMode");
        if (value !== null) {
          setDarkmode(JSON.parse(value));
        }
      } catch (e) {
        console.log("Failed to load dark mode", e);
      }
    };

    loadDarkMode();
  }, []);

  // ✅ Apply theme WHEN darkmode changes
  useEffect(() => {
    Appearance.setColorScheme(darkmode ? "dark" : "light");
  }, [darkmode]);

  const triggerRefresh = () => setRefreshFlag((prev) => prev + 1);

  return (
    <RefreshContext.Provider value={{ refreshFlag, triggerRefresh, isRefreshing, setIsRefreshing, darkmode, setDarkmode }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useAppRefresh() {
  const ctx = useContext(RefreshContext);
  if (!ctx) {
    throw new Error("useAppRefresh must be used inside <RefreshProvider>");
  }
  return ctx;
}
