import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useColorScheme } from "react-native";

// Define the shape of the Context
interface SettingsContextType {
  isDarkMode: boolean;
  language: string;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
}

// Create the Context with a default empty value
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Create a custom hook for easy consumption
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Create the Provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Determine initial dark mode state from system
  const systemColorScheme = useColorScheme();

  // State for the global settings
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [language, setLanguage] = useState("English");

  // Functions to update the global state
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isDarkMode,
      language,
      toggleDarkMode,
      setLanguage,
    }),
    [isDarkMode, language, toggleDarkMode]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
