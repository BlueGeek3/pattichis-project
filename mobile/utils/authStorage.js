import AsyncStorage from "@react-native-async-storage/async-storage";

// KEY for the username
const USERNAME_KEY = "@user_username";

/**
 * Saves the authenticated user's username.
 * @param {string} username
 */
export const saveUsername = async (username) => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username);
    console.log("Username saved successfully");
  } catch (error) {
    console.error("Error saving username:", error);
    throw error;
  }
};

/**
 * Retrieves the authenticated user's username.
 * @returns {Promise<string|null>} The username or null if not found.
 */
export const getUsername = async () => {
  try {
    const username = await AsyncStorage.getItem(USERNAME_KEY);
    console.log("Username retrieved successfully");
    return username;
  } catch (error) {
    console.error("Error retrieving username:", error);
    return null;
  }
};

/**
 * Removes the authentication token (used for logging out).
 */
export const removeUsername = async () => {
  try {
    await AsyncStorage.removeItem(USERNAME_KEY);
    console.log("User removed successfully");
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};
