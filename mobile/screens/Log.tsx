import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { listSymptoms, createLog, createRating, createBloodPressure } from "../lib/api";

const USER = "demo";

export default function Log() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [symptomId, setSymptomId] = useState<string>("");
  const [pain, setPain] = useState("5");
  const [hours, setHours] = useState("1");
  const [rating, setRating] = useState("");
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  useEffect(() => {
    listSymptoms()
      .then(setSymptoms)
      .catch(console.error);
  }, []);

  const submit = async () => {
    if (!symptomId) return alert("Please choose a symptom");
    if (Number(pain) < 0 || Number(pain) > 10) return alert("Pain must be 0–10");
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
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text variant="titleMedium">New Symptom Log</Text>

      {/* DATE */}
      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
      />

      {/* DROPDOWN MUST BE FIRST & SEPARATED */}
      <View style={{ zIndex: 2000, position: "relative" }}>
        <Dropdown
          style={{
            height: 50,
            borderColor: "#aaa",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: "white",
          }}
          containerStyle={{
            zIndex: 3000,
            position: "absolute",
          }}
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
        />

        <TextInput
          label="Hours"
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          mode="outlined"
        />

        <TextInput
          label="Daily Rating (optional 0–10)"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          mode="outlined"
        />

        <TextInput
          label="Systolic Pressure"
          value={systolic}
          onChangeText={setSystolic}
          keyboardType="numeric"
          mode="outlined"
        />

        <TextInput
          label="Diastolic Pressure"
          value={diastolic}
          onChangeText={setDiastolic}
          keyboardType="numeric"
          mode="outlined"
        />
      </View>

      <Button
        mode="contained"
        onPress={submit}
        loading={loading}
        disabled={loading}
      >
        Save Log
      </Button>
    </ScrollView>
  );
}
