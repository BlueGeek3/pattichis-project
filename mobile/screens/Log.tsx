import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { listSymptoms, createLog, createRating } from "../lib/api";

const USER = "demo";

export default function Log() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [symptomId, setSymptomId] = useState<string>("");
  const [pain, setPain] = useState("5");
  const [hours, setHours] = useState("1");
  const [rating, setRating] = useState("");
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load symptoms on mount
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

      alert("Saved!");
      setSymptomId("");
      setPain("5");
      setHours("1");
      setRating("");

    } catch (err) {
      console.error(err);
      alert("Error saving log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text variant="titleMedium">New Symptom Log</Text>

      {/* Date Input */}
      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        mode="outlined"
      />

      {/* Symptom Dropdown */}
      <Dropdown
        style={{
          height: 50,
          borderColor: "#aaa",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
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

      {/* Pain Input */}
      <TextInput
        label="Pain (0–10)"
        value={pain}
        onChangeText={setPain}
        keyboardType="numeric"
        mode="outlined"
      />

      {/* Hours Input */}
      <TextInput
        label="Hours"
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
        mode="outlined"
      />

      {/* Daily Rating (optional) */}
      <TextInput
        label="Daily Rating (optional 0–10)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={submit}
        loading={loading}
        disabled={loading}
      >
        Save Log
      </Button>
    </View>
  );
}
