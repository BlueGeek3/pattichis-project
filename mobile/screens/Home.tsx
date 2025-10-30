import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { listLogDates } from "../lib/api";

const USER = "demo";

export default function Home() {
  const [dates, setDates] = useState<string[]>([]);
  const today = new Date().toISOString().slice(0,10);

  useEffect(() => { listLogDates(USER).then(setDates).catch(console.error); }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall">My MS Diary</Text>

      <Card style={{ marginTop: 12, borderRadius: 16 }}>
        <Card.Title title="Calendar (simple)" subtitle="Tap Log tab to add entries"/>
        <Card.Content>
          <Text>Today: {today}</Text>
          <Text style={{ marginTop: 8 }}>Logged dates:</Text>
          {dates.length ? dates.map(d => <Text key={d}>• {d}</Text>) : <Text>— none yet —</Text>}
        </Card.Content>
      </Card>

      <Button style={{ marginTop: 16 }} mode="contained" onPress={() => {}}>
        Add Symptom Log (use Log tab)
      </Button>
    </ScrollView>
  );
}
