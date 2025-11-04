// mobile/screens/History.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Text,
  FlatList,
  type ListRenderItem,
} from "react-native";
import { ActivityIndicator, HelperText, List, Text as PaperText } from "react-native-paper";
import { Calendar, type DateData } from "react-native-calendars";
import { listHistory } from "../lib/api";

const USER = "demo";
const bg = require("../assets/bg-screens.png");

type HistoryItem = {
  id: number;
  /** canonical date key used by calendar & filtering (YYYY-MM-DD) */
  dateKey: string;
  /** human readable date shown in the list (DD/MM/YYYY) */
  date: string;
  symptomName: string;
  painScore: number;
  hours: number;
};

export default function History() {
  const { height } = useWindowDimensions();
  const topPad = height * 0.05;

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const raw = await listHistory(USER);

        const formatted: HistoryItem[] = (raw || []).map((i: any) => {
          const d = new Date(i.date);
          const dateKey = d.toISOString().slice(0, 10); // YYYY-MM-DD
          const date = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Nicosia",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(d); // DD/MM/YYYY
          return {
            id: Number(i.id),
            dateKey,
            date,
            symptomName: String(i.symptomName ?? ""),
            painScore: Number(i.painScore ?? 0),
            hours: Number(i.hours ?? 0),
          };
        });

        setItems(formatted);
      } catch (e: any) {
        setErr(e?.message || "Network request failed");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Calendar marks
  const marked = useMemo(() => {
    const out: Record<string, { marked?: boolean; selected?: boolean }> = {};
    for (const it of items) out[it.dateKey] = { ...(out[it.dateKey] || {}), marked: true };
    if (selected) out[selected] = { ...(out[selected] || {}), selected: true };
    return out;
  }, [items, selected]);

  // List filtering by selected date (if any)
  const displayItems = useMemo(
    () => (selected ? items.filter((i) => i.dateKey === selected) : items),
    [items, selected]
  );

  const onDayPress = (d: DateData) => setSelected(d.dateString);

  // Typed, memoized row renderer
  const renderItem: ListRenderItem<HistoryItem> = useCallback(
    ({ item }) => (
      <List.Item
        style={styles.listItem}
        title={`${item.date} — ${item.symptomName}`}
        description={`Pain ${item.painScore}/10 • Hours ${item.hours}`}
        left={(p) => <List.Icon {...p} icon="calendar" />}
      />
    ),
    []
  );

  const retry = async () => {
    try {
      setErr(null);
      setLoading(true);
      const raw = await listHistory(USER);
      const formatted: HistoryItem[] = (raw || []).map((i: any) => {
        const d = new Date(i.date);
        const dateKey = d.toISOString().slice(0, 10);
        const date = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Nicosia",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(d);
        return {
          id: Number(i.id),
          dateKey,
          date,
          symptomName: String(i.symptomName ?? ""),
          painScore: Number(i.painScore ?? 0),
          hours: Number(i.hours ?? 0),
        };
      });
      setItems(formatted);
    } catch (e: any) {
      setErr(e?.message || "Network request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: topPad }]}>
        <PaperText variant="headlineSmall" style={styles.title}>
          History
        </PaperText>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <PaperText style={{ marginTop: 8 }}>Loading…</PaperText>
          </View>
        ) : (
          <>
            {err ? (
              <>
                <HelperText type="error" visible>
                  {err}
                </HelperText>
                <Pressable onPress={retry} style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}>
                  <Text style={styles.ctaBtnText}>Retry</Text>
                </Pressable>
              </>
            ) : null}

            <View style={styles.calendarCard}>
              <Calendar
                onDayPress={onDayPress}
                markedDates={marked}
                enableSwipeMonths
                theme={{
                  todayTextColor: "#4A4A4A",
                  selectedDayBackgroundColor: "#4A4A4A",
                  arrowColor: "#4A4A4A",
                }}
                style={{ borderRadius: 16, overflow: "hidden" }}
              />
            </View>

            <FlatList
              contentContainerStyle={{ padding: 8, paddingBottom: 16 }}
              data={displayItems}
              keyExtractor={(i) => String(i.id)}
              ListEmptyComponent={<PaperText style={{ padding: 16 }}>No logs yet.</PaperText>}
              renderItem={renderItem}
              initialNumToRender={12}
              removeClippedSubviews
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  title: { marginBottom: 8, fontWeight: "700", color: "#2A2A2A" },
  calendarCard: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFFE6",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    backgroundColor: "#FFFFFFE6",
    borderRadius: 12,
    marginVertical: 4,
  },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  ctaBtn: {
    alignSelf: "center",
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: "#4A4A4A",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 160,
    alignItems: "center",
  },
  ctaBtnPressed: { backgroundColor: "#5a5a5a" },
  ctaBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
