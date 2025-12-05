import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Intro from "./screens/Intro";
import Home from "./screens/Home";
import History from "./screens/History";
import Log from "./screens/Log";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SettingsProvider, useSettings } from "./utils/SettingsContext";
import { getTabNamesTranslations } from "./utils/translations";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  // Use the global settings context inside the Tabs component
  const { isDarkMode, language } = useSettings();

  // Apply dynamic styling based on the global theme state
  const tabBarBackgroundColor = isDarkMode ? "#1e1e1e" : "#f8f8f8";
  const tabBarInactiveColor = isDarkMode ? "#888" : "#666";

  const tabNames = getTabNamesTranslations(language);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, string> = {
            Home: "home",
            History: "history",
            Log: "plus-circle",
            Profile: "account",
          };
          return (
            <MaterialCommunityIcons
              name={map[route.name]}
              size={size}
              color={color}
            />
          );
        },
        // Apply responsive styling to the tab bar container
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopColor: isDarkMode ? "#333" : "#ddd",
        },
        tabBarInactiveTintColor: tabBarInactiveColor,
        tabBarActiveTintColor: "#007BFF", // Keep active color blue regardless of mode
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: tabNames.Home }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{ tabBarLabel: tabNames.History }}
      />
      <Tab.Screen
        name="Log"
        component={Log}
        options={{ tabBarLabel: tabNames.Log }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: tabNames.Profile }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="Tabs" component={Tabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SettingsProvider>
  );
}
