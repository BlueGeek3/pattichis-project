import { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import {
  listSymptoms,
  createLog,
  createRating,
  createBloodPressure,
} from "../lib/api";

import { useSettings } from "../utils/SettingsContext";

import { getTranslations } from "../utils/translations";

// Added imports to get global username
import { getUsername } from "../utils/authStorage";
import { useNavigation, StackActions } from "@react-navigation/native";

//const USER = "demo";
let USER = "demo";
const bg = require("../assets/bg-screens.png");

export default function Log() {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [symptomId, setSymptomId] = useState<string>("");
  const [pain, setPain] = useState("5");
  const [hours, setHours] = useState("1");
  const [rating, setRating] = useState("");
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const { height } = useWindowDimensions();
  const topPad = height * 0.08;

  // CONSUME GLOBAL SETTINGS
  // This hook forces the component to re-render whenever settings change in Home.tsx
  const { isDarkMode, language } = useSettings();

  // Dark Mode Colors
  const themeBackgroundOverlay = isDarkMode
    ? "rgba(0, 0, 0, 0.35)"
    : "transparent";

  // Use of helper function to get translations
  const t = getTranslations(language);

  // Load symptoms on mount
  useEffect(() => {
    //Get global user name
    const loadCredentials = async () => {
      const fetchedUsername = await getUsername();

      if (!fetchedUsername) {
        Alert.alert(t.session_expired_title, t.session_expired_msg);
        navigation.dispatch(StackActions.replace("Login"));
        return;
      }
      USER = fetchedUsername;
    };
    loadCredentials();
    // ---------------------
    listSymptoms().then(setSymptoms).catch(console.error);
  }, []);

  const submit = async () => {
    if (!symptomId) return alert("Please choose a symptom");
    if (Number(pain) < 0 || Number(pain) > 10)
      return alert("Pain must be 0–10");
    if (rating !== "" && (Number(rating) < 0 || Number(rating) > 10))
      return alert("Daily rating must be 0–10");

    setLoading(true);

    try {
      await createLog({
        username: USER,
        date,
        hours: Number(hours),
        painScore: Number(pain),
        symptomId: Number(symptomId),
      });

      if (rating !== "") {
        await createRating({
          username: USER,
          date,
          rating: Number(rating),
        });
      }

      if (systolic !== "" && diastolic !== "") {
        await createBloodPressure({
          username: USER,
          systolic,
          diastolic,
          date,
        });
      }

      alert("Saved!");

      setSymptomId("");
      setPain("5");
      setHours("1");
      setRating("");
      setSystolic("");
      setDiastolic("");
    } catch (err) {
      console.error(err);
      alert("Error saving log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <ScrollView
        contentContainerStyle={[
          styles.container,
          // Added Dark Mode Color
          {
            paddingTop: topPad,
            paddingBottom: 24,
            backgroundColor: themeBackgroundOverlay,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text variant="titleMedium" style={styles.title}>
            New Symptom Log
          </Text>

          {/* DATE */}
          <TextInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            mode="outlined"
            style={styles.input}
          />

          {/* DROPDOWN MUST BE FIRST & SEPARATED (z-index fix) */}
          <View style={styles.dropdownWrapper}>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={symptoms.map((s) => ({
                label: s.name,
                value: String(s.id),
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select a symptom"
              value={symptomId}
              onChange={(item) => setSymptomId(item.value)}
            />
          </View>

          {/* ALL INPUTS BELOW MUST HAVE LOWER Z-INDEX */}
          <View style={{ zIndex: 1 }}>
            <TextInput
              label="Pain (0–10)"
              value={pain}
              onChangeText={setPain}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Hours"
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Daily Rating (optional 0–10)"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Systolic Pressure"
              value={systolic}
              onChangeText={setSystolic}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Diastolic Pressure"
              value={diastolic}
              onChangeText={setDiastolic}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
          </View>

          <Button
            mode="contained"
            onPress={submit}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
            textColor="#ffffff"
          >
            Save Log
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFFE6",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    marginBottom: 12,
    fontWeight: "700",
    color: "#2A2A2A",
  },
  input: {
    marginTop: 8,
  },
  dropdownWrapper: {
    zIndex: 2000,
    position: "relative",
    marginTop: 8,
  },
  dropdown: {
    height: 50,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  dropdownContainer: {
    zIndex: 3000,
    position: "absolute",
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: "#4A4A4A",
    alignSelf: "center",
    paddingHorizontal: 24,
  },
});
