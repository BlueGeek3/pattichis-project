import AsyncStorage from "@react-native-async-storage/async-storage";

// Key used to store the authentication token
const AUTH_TOKEN_KEY = "@user_auth_token";

/**
 * Saves the authentication token to the device.
 * @param {string} token
 */
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log("Token saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

/**
 * Retrieves the authentication token from the device.
 * @returns {Promise<string|null>} The token or null if not found.
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    console.log("Token retrieved successfully");
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

/**
 * Removes the authentication token (used for logging out).
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing token:", error);
    throw error;
  }
};
