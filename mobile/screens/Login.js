import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../Styles/GlobalStyles";

// Import the saveToken function from your new utility file
// Ensure the path "../utils/authStorage" matches your folder structure
import { saveAuthToken } from "../utils/authStorage";

// IMPORTANT: REPLACE 'YOUR_ACTUAL_IP_ADDRESS' below with the IP from ipconfig/System Settings.
// ----------------------------------------------------------------------
const API_URL = "http://192.168.x.x:8080/login.php";

export default function Login() {
  const navigation = useNavigation();

  // State for user input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for UI feedback
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the login process by sending credentials to the PHP API.
   */
  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send username and password as JSON payload
        body: JSON.stringify({ username, password }),
      });

      // Check if the network request itself failed (e.g., 404, 500)
      if (!response.ok) {
        // Read the response text for better debugging
        const errorText = await response.text();
        throw new Error(
          `Server responded with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        // --- TOKEN LOGIC START ---
        // 1. Check if the token exists in the response
        if (data.token) {
          // 2. Save the token persistently
          console.log(
            "Login successful. Token received from server:",
            data.token
          );
          await saveAuthToken(data.token);
        } else {
          console.warn(
            "Login was successful, but NO token was returned by the server."
          );
        }
        // --- TOKEN LOGIC END ---
        // Login successful
        setMessage("Login successful! Redirecting...");

        // Navigate to the Main Menu Scene
        navigation.navigate("Tabs");

        // Clear state after successful navigation
        setUsername("");
        setPassword("");
      } else {
        // Login failed (e.g., bad credentials) - show message from API
        setMessage(`Login Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(
        `Network Error: Could not connect to the server. Check your API_URL and server status.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      KeyboardAvoidingView
    >
      <ScrollView
        contentContainerStyle={GlobalStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={GlobalStyles.header}>Welcome Back!</Text>

        {/* Username Input Group */}
        <View style={GlobalStyles.fieldGroup}>
          <Text style={GlobalStyles.label}>Username</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Enter your username"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input Group */}
        <View style={GlobalStyles.fieldGroup}>
          <Text style={GlobalStyles.label}>Password</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Message Display (Feedback) */}
        {message ? (
          <Text
            style={[
              GlobalStyles.message,
              { color: message.includes("successful") ? "#10b981" : "#ef4444" },
            ]}
          >
            {message}
          </Text>
        ) : null}

        {/* Login Button */}
        <TouchableOpacity
          style={GlobalStyles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={GlobalStyles.loginButtonText}>LOG IN</Text>
          )}
        </TouchableOpacity>

        {/* Footer Links (Forgot Password & Register) */}
        <View style={GlobalStyles.footerLinks}>
          <TouchableOpacity
            onPress={() => {
              /* Placeholder for future implementation */
            }}
          >
            <Text style={GlobalStyles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={GlobalStyles.linkText}>New User? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
