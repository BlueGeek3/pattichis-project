import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
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
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 30,
    marginTop: 50,
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
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1f2937",
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
    marginTop: 15,
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
  loginButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#1d4ed8", // A deep blue color
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    // Shadow for iOS
    shadowColor: "#1d4ed8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Shadow for Android
    elevation: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  footerLinks: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
});

export default GlobalStyles;
