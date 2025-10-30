import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { List, Text } from "react-native-paper";
import { listHistory } from "../lib/api";

const USER = "demo";

export default function History() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { listHistory(USER).then(setItems).catch(console.error); }, []);

  return (
    <FlatList
      contentContainerStyle={{ padding: 8 }}
      data={items}
      keyExtractor={(i) => String(i.id)}
      ListEmptyComponent={<Text style={{ padding: 16 }}>No logs yet.</Text>}
      renderItem={({ item }) => (
        <List.Item
          title={`${item.date} — ${item.symptomName}`}
          description={`Pain ${item.painScore}/10 • Hours ${item.hours}`}
          left={(p) => <List.Icon {...p} icon="calendar" />}
        />
      )}
    />
  );
}
