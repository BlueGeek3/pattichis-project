import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  // Style for the ScrollView content container
  // It centers the content vertically.
  scrollViewContent: {
    flexGrow: 1, // Allows content to fill space for centering
    justifyContent: "center", // Centers the card vertically
    paddingHorizontal: 20, // Padding from the screen edges
  },
  // The new 'Card' style for the form content itself
  formCard: {
    // 50% opaque background
    backgroundColor: "#CDE2FF",
    //backgroundColor: "#9ac4b680",
    padding: 24, // Internal padding for the card
    borderRadius: 12, // Nice rounded corners
    width: "100%",
    maxWidth: 450, // Limits width on tablets/desktops
    alignSelf: "center", // Centers the card horizontally
  },

  // Your existing styles (ensure 'bg' is defined for the ImageBackground)
  bg: {
    flex: 1,
  },
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
    //color: "#1f2937",
    color: "#000000ff", // White text for better contrast on the card
    marginBottom: 30,
    marginTop: 50,
  },
  fieldGroup: {
    marginBottom: 15, // Space between field groups
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    //color: "#CDFFD1",
    //color: "#fff", // Light text for better contrast
    color: "#9AC4FF",
    //color: "#FFEACD",
    marginBottom: 5,
    paddingLeft: 5,
    textShadowColor: "#000000ff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    width: "100%",
    height: 50,
    //backgroundColor: "#ffffff",
    backgroundColor: "#fff", // Keep inputs opaque white for easy typing
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
  registrationButton: {
    backgroundColor: "#000000ff", // Standard iOS blue
    //backgroundColor: "#FFCDFB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  registrationButtonText: {
    color: "#ffffffff",
    //color: "#CDFFD1",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "#000000ff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
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
    //backgroundColor: "#1d4ed8", // A deep blue color
    backgroundColor: "#1f2937", // Dark button for contrast
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
