import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// --- CONFIGURATION ---
// !!! IMPORTANT: REPLACE 'YOUR_ACTUAL_IP_ADDRESS' with your actual local IP (e.g., 192.168.1.5)
const API_URL = "http://192.168.x.x:8080/registration.php";

// ---------------------

// Helper function for basic email format validation using RegEx
const validateEmailFormat = (email) => {
  // Standard RegEx for basic email structure validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPass, setRetypedPass] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigation = useNavigation(); // State for messages coming from the server (success/network/failure)

  // NEW STATE: Tracks the validation status of each input field
  // Statuses: 'default', 'error', 'success'
  const [fieldStatus, setFieldStatus] = useState({
    username: "default",
    email: "default",
    password: "default",
    retypedPass: "default",
  });

  // NEW State to hold specific error messages for display below the input fields
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    email: "",
    password: "",
    retypedPass: "",
  });

  // Basic client-side validation for form input
  const validateInput = (checkAll = true, fieldToCheck = null) => {
    let hasError = false;
    let newErrors = { username: "", email: "", password: "", retypedPass: "" };
    let newStatuses = {
      username: "success",
      email: "success",
      password: "success",
      retypedPass: "success",
    };

    // Clear previous server/network messages before re-validating
    setMessage("");

    // --- 1. Check Username ---
    if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
      newStatuses.username = "error";
      hasError = true;
    }

    // --- 2. Check Email ---
    if (email.length === 0) {
      newErrors.email = "Email address is required.";
      newStatuses.email = "error";
      hasError = true;
    } else if (!validateEmailFormat(email)) {
      newErrors.email =
        "Please enter a valid email address format (e.g., user@domain.com).";
      newStatuses.email = "error";
      hasError = true;
    }

    // --- 3. Check Password ---
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      newStatuses.password = "error";
      hasError = true;
    }

    // --- 4. Check Retyped Password ---
    if (password !== retypedPass || password.length < 6) {
      newStatuses.retypedPass = "error";
      hasError = true;

      if (retypedPass.length === 0) {
        newErrors.retypedPass = "Please confirm your password.";
      } else if (password !== retypedPass) {
        newErrors.retypedPass = "The passwords do not match.";
      } else if (retypedPass.length < 6) {
        newErrors.retypedPass =
          "Confirmation password must be at least 6 characters.";
      }
    }

    // Apply all status and error message updates
    setValidationErrors(newErrors);
    setFieldStatus(newStatuses);

    if (hasError) {
      setMessage("Please correct the highlighted errors before registering.");
    }

    return !hasError;
  };

  // Helper function to dynamically get the style based on field status
  const getInputStyle = (field) => {
    const status = fieldStatus[field];
    if (status === "error") {
      return styles.input_error;
    }
    if (status === "success") {
      return styles.input_success;
    }
    return {}; // Default style uses base styles.input
  };

  const handleRegistration = async () => {
    if (!validateInput(true)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Converts the JavaScript object into a JSON string for the PHP API
        body: JSON.stringify({
          username_label: username,
          password_label: password,
          email_label: email,
        }),
      });

      // PHP returns JSON, so we parse the response body
      const data = await response.json();

      if (data.success) {
        // Successful registration, clear inputs and navigate to Login
        setMessage(data.message);
        // Reset all field borders to default light gray
        setFieldStatus({
          username: "default",
          email: "default",
          password: "default",
          retypedPass: "default",
        });
        setValidationErrors({
          username: "",
          email: "",
          password: "",
          retypedPass: "",
        });
        setUsername("");
        setPassword("");
        setRetypedPass("");
        setEmail("");

        // Use a timeout to display success message before navigating
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        // Registration failed (e.g., username already exists)
        // Set all fields back to error status for visibility
        setFieldStatus({
          username: "error",
          email: "error",
          password: "error",
          retypedPass: "error",
        });
        setValidationErrors({
          username: "",
          email: "",
          password: "",
          retypedPass: "",
        });
        // The message comes directly from the PHP script
        setMessage(`Registration Failed: ${data.message}`);
      }
    } catch (error) {
      // Network error (e.g., server is offline, wrong IP, or firewall issue)
      console.error("Registration Error:", error);
      setMessage(
        "Network Error: Could not connect to the server. Check your API_URL and server status."
      );
    } finally {
      setLoading(false);
    }
  };

  // Change handlers now validate the specific field on every keystroke
  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRetypedPassChange = (text) => {
    setRetypedPass(text);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Your Account</Text>

        {/* Message Display for success/error/validation */}
        <Text
          style={[
            styles.message,
            {
              color: message.includes("successful")
                ? "green"
                : message.length > 0
                ? "red"
                : "transparent",
            },
          ]}
        >
          {message}
        </Text>
        {/* --- Username Field Group --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, getInputStyle("username")]}
            placeholder="Username"
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
          />
          {!!validationErrors.username && (
            <Text style={styles.errorText}>{validationErrors.username}</Text>
          )}
        </View>

        {/* --- Password Field Group --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, getInputStyle("password")]}
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
          />
          {!!validationErrors.password && (
            <Text style={styles.errorText}>{validationErrors.password}</Text>
          )}
        </View>

        {/* --- Confirm Password Field Group --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, getInputStyle("retypedPass")]}
            placeholder="Password (min 6 characters)"
            value={retypedPass}
            onChangeText={handleRetypedPassChange}
            secureTextEntry
            autoCapitalize="none"
          />
          {!!validationErrors.retypedPass && (
            <Text style={styles.errorText}>{validationErrors.retypedPass}</Text>
          )}
        </View>

        {/* --- Email Field Group --- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, getInputStyle("email")]}
            placeholder="Email Address"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address" // Hint to the mobile OS to show an email keyboard
            autoCapitalize="none"
          />
          {!!validationErrors.email && (
            <Text style={styles.errorText}>{validationErrors.email}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegistration}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>REGISTER</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>
            Already have an account? Login here.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#9ac4b6ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  fieldGroup: {
    marginBottom: 15, // Space between field groups
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    paddingLeft: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  // NEW Style for Error State (Red Border)
  input_error: {
    borderColor: "#EF4444", // Red-500
    borderWidth: 4, // Thicker border for visual emphasis
  },
  // NEW Style for Success State (Green Border)
  input_success: {
    borderColor: "#10B981", // Green-500
    borderWidth: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 5,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF", // Standard iOS blue
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  linkText: {
    textAlign: "center",
    color: "#007AFF",
    marginTop: 10,
    fontSize: 15,
  },
});

export default Registration;
