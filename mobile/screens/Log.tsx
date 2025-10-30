import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, TextInput, HelperText, Text } from "react-native-paper";
import { listSymptoms, createLog, createRating } from "../lib/api";

const USER = "demo";

export default function Log() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [symptomId, setSymptomId] = useState<string>("");
  const [pain, setPain] = useState("5");
  const [hours, setHours] = useState("1");
  const [rating, setRating] = useState("");
  const [symptoms, setSymptoms] = useState<any[]>([]);

  useEffect(() => { listSymptoms().then(setSymptoms).catch(console.error); }, []);

  const submit = async () => {
    await createLog({
      username: USER,
      date,
      hours: Number(hours),
      painScore: Number(pain),
      symptomId: Number(symptomId),
    });
    if (rating !== "") {
      await createRating({ username: USER, date, rating: Number(rating) });
    }
    alert("Saved!");
  };

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text variant="titleMedium">New Symptom Log</Text>

      <TextInput label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput label="Symptom ID" value={symptomId} onChangeText={setSymptomId} keyboardType="numeric" />
      <HelperText type="info">
        IDs: {symptoms.slice(0,6).map(s => `${s.id}=${s.name}`).join(", ")}...
      </HelperText>

      <TextInput label="Pain (0-10)" value={pain} onChangeText={setPain} keyboardType="numeric" />
      <TextInput label="Hours" value={hours} onChangeText={setHours} keyboardType="numeric" />
      <TextInput label="Daily Rating (optional 0-10)" value={rating} onChangeText={setRating} keyboardType="numeric" />

      <Button mode="contained" onPress={submit}>Save</Button>
    </View>
  );
}
