// mobile/screens/Profile.tsx
import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Pressable,
  Text,
} from "react-native";
import { Text as PaperText, TextInput, HelperText } from "react-native-paper";
import { BASE } from "../lib/api";

import { useSettings } from "../utils/SettingsContext";

import { getTranslations } from "../utils/translations";

// Added imports to get global username
import { getUsername } from "../utils/authStorage";
import { useNavigation, StackActions } from "@react-navigation/native";

const bg = require("../assets/bg-screens.png");

type User = {
  username: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  doctorsEmail: string;
};

// Use shared BASE so it works the same as other screens
const USER_ENDPOINT = `${BASE}/user`;

export default function Profile() {
  const navigation = useNavigation();

  const { height } = useWindowDimensions();
  const topPad = height * 0.05;

  const [form, setForm] = useState<User>({
    username: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    doctorsEmail: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const onChange = (k: keyof User, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // --- validations ---
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const validDoctor =
    form.doctorsEmail === "" ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.doctorsEmail);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth);
  const validMobile = /^\d{7,15}$/.test(form.mobileNumber);

  const canSave =
    validEmail && validDoctor && validDate && validMobile && !saving;

  // CONSUME GLOBAL SETTINGS
  // This hook forces the component to re-render whenever settings change in Home.tsx
  const { isDarkMode, language } = useSettings();

  // Dark Mode Colors
  const themeBackgroundOverlay = isDarkMode
    ? "rgba(0, 0, 0, 0.35)"
    : "transparent";
  const textColor = isDarkMode ? "#ffffff" : "#2A2A2A";

  // Use of helper function to get translations
  const t = getTranslations(language);

  // --- fetch user data (demo user for now) ---
  useEffect(() => {
    //const username = "demo"; // TODO: replace with auth user
    let username = "demo";
    (async () => {
      try {
        //Get global user name
        const fetchedUsername = await getUsername();
        if (!fetchedUsername) {
          Alert.alert(t.session_expired_title, t.session_expired_msg);
          navigation.dispatch(StackActions.replace("Login"));
          return;
        }
        username = fetchedUsername;
        // ---------------------

        const res = await fetch(`${USER_ENDPOINT}?username=${username}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          console.error("Fetch user error:", data.error || res.statusText);
          Alert.alert("Error", data.error || "Failed to fetch user data");
          return;
        }

        setForm({
          username: data.username,
          email: data.Email,
          mobileNumber: String(data.MobileNumber ?? ""),
          dateOfBirth: data.DateOfBirth
            ? String(data.DateOfBirth).split("T")[0]
            : "",
          doctorsEmail: data.DoctorsEmail ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        Alert.alert("Error", "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- save user updates ---
  const save = async () => {
    if (!canSave) {
      Alert.alert("Validation", "Please fill all required fields correctly.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${USER_ENDPOINT}?username=${encodeURIComponent(form.username)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Email: form.email,
            MobileNumber: form.mobileNumber,
            DateOfBirth: form.dateOfBirth,
            DoctorsEmail: form.doctorsEmail,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && !data.error) {
        Alert.alert("Success", "User updated successfully");
      } else {
        Alert.alert("Error", data.error || "Update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
        <View
          style={[
            styles.container,
            { paddingTop: topPad, alignItems: "center" },
          ]}
        >
          <Text>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <ScrollView
        contentContainerStyle={[
          // Added Dark Mode Color
          styles.container,
          { paddingTop: topPad, backgroundColor: themeBackgroundOverlay },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <PaperText
          variant="headlineSmall"
          // Added Dark Mode Color
          style={(styles.title, { color: textColor })}
        >
          Profile
        </PaperText>

        <TextInput
          label="Username"
          value={form.username}
          mode="outlined"
          style={[styles.input, styles.usernameInput]}
          outlineStyle={styles.inputOutline}
          disabled
          left={<TextInput.Icon icon="account" />}
        />

        <TextInput
          label="Email"
          value={form.email}
          onChangeText={(t) => onChange("email", t)}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
        />
        <HelperText type={validEmail ? "info" : "error"} visible>
          {validEmail ? " " : "Enter a valid email"}
        </HelperText>

        <TextInput
          label="Mobile Number"
          value={form.mobileNumber}
          onChangeText={(t) => onChange("mobileNumber", t)}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
        />
        <HelperText type={validMobile ? "info" : "error"} visible>
          {validMobile ? " " : "Phone between 7-15 digits"}
        </HelperText>

        <TextInput
          label="Date of Birth (YYYY-MM-DD)"
          value={form.dateOfBirth}
          onChangeText={(t) => onChange("dateOfBirth", t)}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          placeholder="YYYY-MM-DD"
          left={<TextInput.Icon icon="calendar" />}
        />
        <HelperText type={validDate ? "info" : "error"} visible>
          {validDate ? " " : "Format must be YYYY-MM-DD"}
        </HelperText>

        <TextInput
          label="Doctor's Email"
          value={form.doctorsEmail}
          onChangeText={(t) => onChange("doctorsEmail", t)}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          keyboardType="email-address"
          autoCapitalize="none"
          multiline
          left={<TextInput.Icon icon="stethoscope" />}
        />
        <HelperText type={validDoctor ? "info" : "error"} visible>
          {validDoctor ? " " : "Enter a valid email"}
        </HelperText>

        <View style={{ height: 8 }} />
        <Pressable
          onPress={save}
          disabled={!canSave}
          style={({ pressed }) => [
            styles.ctaBtn,
            pressed && styles.ctaBtnPressed,
            !canSave && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.ctaBtnText}>{saving ? "Saving..." : "Save"}</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  // Added flexGrow to cover whole screen when dark mode is enabled
  container: { flexGrow: 1, paddingHorizontal: 16 },
  title: { marginBottom: 8, fontWeight: "700", color: "#2A2A2A" },
  input: { backgroundColor: "#FFFFFFE6" },
  usernameInput: { marginBottom: 28 },
  inputOutline: { borderRadius: 16 },
  ctaBtn: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: "#4A4A4A",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 180,
    alignItems: "center",
  },
  ctaBtnPressed: { backgroundColor: "#5a5a5a" },
  ctaBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
