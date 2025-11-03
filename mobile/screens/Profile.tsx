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

const bg = require("../assets/bg-screens.png"); // replace with your image

type User = {
  username: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  doctorsEmail: string;
  password: string; // required for update
};

const backendURL = "http://192.168.56.1:3000/ms-api/user"; // your backend

export default function Profile() {
  const { height } = useWindowDimensions();
  const topPad = height * 0.05;

  const [form, setForm] = useState<User>({
    username: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    doctorsEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const onChange = (k: keyof User, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // Validations
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const validDoctor =
    form.doctorsEmail === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.doctorsEmail);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth);
  const validMobile = form.mobileNumber.length <= 20;
  const validPassword = form.password.trim().length > 0;

  const canSave =
    validEmail && validDoctor && validDate && validMobile && validPassword && !saving;

  // Fetch user data
  useEffect(() => {
    const username = "demo";//replrace with dynamic username (e.g., from auth)
    fetch(`${backendURL}?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Alert.alert("Error", data.error);
          return;
        }

        setForm({
          username: data.username,
          email: data.Email,
          mobileNumber: data.MobileNumber,
          dateOfBirth: data.DateOfBirth ? data.DateOfBirth.split("T")[0] : "",
          doctorsEmail: data.DoctorsEmail,
          password: "", // keep blank for security
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        Alert.alert("Error", "Failed to fetch user data");
      })
      .finally(() => setLoading(false));
  }, []);

  // Save user updates
  const save = async () => {
    if (!canSave) {
      Alert.alert("Validation", "Please fill all required fields correctly.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${backendURL}?username=${form.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Password: form.password, // required
          Email: form.email,
          MobileNumber: form.mobileNumber,
          DateOfBirth: form.dateOfBirth,
          DoctorsEmail: form.doctorsEmail,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "User updated successfully");
        setForm((prev) => ({ ...prev, password: "" }));
      } else {
        const data = await res.json();
        Alert.alert("Error", data.error || "Update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: topPad }]}
        keyboardShouldPersistTaps="handled"
      >
        <PaperText variant="headlineSmall" style={styles.title}>
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
          {validMobile ? " " : "Too long"}
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

        <TextInput
          label="Password (required)"
          value={form.password}
          onChangeText={(t) => onChange("password", t)}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
        />
        <HelperText type={validPassword ? "info" : "error"} visible>
          {validPassword ? " " : "Password is required"}
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
  container: { paddingHorizontal: 16 },
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
