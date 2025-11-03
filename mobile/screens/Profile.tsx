// mobile/screens/Profile.tsx
import { useState } from "react";
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

const bg = require("../assets/bg-screens.png"); // keep/change to your image

type User = {
  username: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;    // YYYY-MM-DD
  doctorsEmail: string;
};

const INITIAL: User = {
  username: "demo",
  email: "demo@example.com",
  mobileNumber: "9990001111",
  dateOfBirth: "2000-01-01",
  doctorsEmail: "doctor@example.com",
};

export default function Profile() {
  const { height } = useWindowDimensions();
  const topPad = height * 0.05; // push everything 5% down

  const [form, setForm] = useState<User>(INITIAL);
  const [saving, setSaving] = useState(false);

  const onChange = (k: keyof User, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const validDoctor =
    form.doctorsEmail === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.doctorsEmail);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth);
  const validMobile = form.mobileNumber.length <= 20;

  const canSave = validEmail && validDoctor && validDate && validMobile && !saving;

  const save = async () => {
    setSaving(true);
    try {
      Alert.alert("Saved (mock)", "Wire this to your API later.");
      console.log("Profile (mock save):", form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: topPad }]}
        keyboardShouldPersistTaps="handled"
      >
        <PaperText variant="headlineSmall" style={styles.title}>
          Profile
        </PaperText>

        {/* Username — extra spacing below so it’s not tight with Email */}
        <TextInput
          label="Username"
          value={form.username}
          mode="outlined"
          style={[styles.input, styles.usernameInput]}  // 👈 extra marginBottom
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

        {/* Save button styled like Intro’s Get Started (same colors/radius/elevation) */}
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.70)",
  },
  container: {
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: "700",
    color: "#2A2A2A",
  },
  input: {
    backgroundColor: "#FFFFFFE6",
  },
  usernameInput: {
    marginBottom: 28, // 👈 extra gap between Username and Email
  },
  inputOutline: {
    borderRadius: 16,
  },

  // Match Intro button styles (color, radius, shadow); position stays inline here
  ctaBtn: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: "#4A4A4A",
    elevation: 4, // Android shadow
    // web/iOS soft shadow
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

