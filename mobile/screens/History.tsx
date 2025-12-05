// mobile/screens/History.tsx
import { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Text,
  FlatList,
  Alert,
} from "react-native";
import {
  ActivityIndicator,
  HelperText,
  List,
  Text as PaperText,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import { Calendar, type DateData } from "react-native-calendars";
import { listHistory } from "../lib/api";

import { useSettings } from "../utils/SettingsContext";

// Added imports to get global username
import { getUsername } from "../utils/authStorage";
import { useNavigation, StackActions } from "@react-navigation/native";

import { getHistoryTranslations } from "../utils/translations";

//const USER = "demo";
let USER = "demo";
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
  const navigation = useNavigation();

  const { height } = useWindowDimensions();
  const topPad = height * 0.05;

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // CONSUME GLOBAL SETTINGS
  // This hook forces the component to re-render whenever settings change in Home.tsx
  const { isDarkMode, language } = useSettings();

  // Dark Mode Colors
  const themeBackgroundOverlay = isDarkMode
    ? "rgba(0, 0, 0, 0.35)"
    : "transparent";
  const textColor = isDarkMode ? "#ffffff" : "#2A2A2A";

  // Use of helper function to get translations
  const t = getHistoryTranslations(language);

  // ---- Load data ---------------------------------------------------------
  const load = async () => {
    try {
      setErr(null);
      setLoading(true);
      const raw = await listHistory(USER);

      const formatted: HistoryItem[] = (raw || []).map((i: any) => {
        // i.date comes from MySQL DATE; avoid timezone shifts by treating as plain string
        const rawDate =
          typeof i.date === "string"
            ? i.date.slice(0, 10) // "YYYY-MM-DD..."
            : new Date(i.date).toISOString().slice(0, 10);

        const [y, m, d] = rawDate.split("-");
        const pretty = `${d}/${m}/${y}`;

        return {
          id: Number(i.id),
          dateKey: rawDate, // used by calendar & filtering
          date: pretty, // shown to user
          symptomName: String(i.symptomName ?? ""),
          painScore: Number(i.painScore ?? 0),
          hours: Number(i.hours ?? 0),
        };
      });

      setItems(formatted);
    } catch (e: any) {
      console.error("history load error:", e);
      setErr(e?.message || "Network request failed");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

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

    load();
  }, []);

  // ---- Calendar marks ----------------------------------------------------
  const marked = useMemo(() => {
    const out: Record<string, { marked?: boolean; selected?: boolean }> = {};
    for (const it of items) {
      out[it.dateKey] = { ...(out[it.dateKey] || {}), marked: true };
    }
    if (selectedDate) {
      out[selectedDate] = { ...(out[selectedDate] || {}), selected: true };
    }
    return out;
  }, [items, selectedDate]);

  // ---- Filtered list for selected date -----------------------------------
  const displayItems = useMemo(
    () =>
      selectedDate ? items.filter((i) => i.dateKey === selectedDate) : items,
    [items, selectedDate]
  );

  const onDayPress = (d: DateData) => {
    // Toggle if same day tapped again
    setSelectedDate((prev) => (prev === d.dateString ? null : d.dateString));
  };

  // ---- Retry button handler ----------------------------------------------
  const onRetry = () => {
    load();
  };

  // ---- Render ------------------------------------------------------------
  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <View
        style={[
          styles.container,
          // Added dark mode color
          { paddingTop: topPad, backgroundColor: themeBackgroundOverlay },
        ]}
      >
        <PaperText
          variant="headlineSmall"
          // Added dark mode color
          style={(styles.title, { color: textColor })}
        >
          {t.screen_title}
        </PaperText>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <PaperText style={{ marginTop: 8 }}>{t.loading}}…</PaperText>
          </View>
        ) : (
          <>
            {err ? (
              <>
                <HelperText type="error" visible>
                  {err}
                </HelperText>
                <Pressable
                  onPress={onRetry}
                  style={({ pressed }) => [
                    styles.ctaBtn,
                    pressed && styles.ctaBtnPressed,
                  ]}
                >
                  <Text style={styles.ctaBtnText}>{t.retry}</Text>
                </Pressable>
              </>
            ) : null}

            {/* Calendar */}
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

            {/* History list */}
            <FlatList
              contentContainerStyle={{ padding: 8, paddingBottom: 16 }}
              data={displayItems}
              keyExtractor={(i) => String(i.id)}
              ListEmptyComponent={
                <PaperText style={{ padding: 16 }}>{t.no_logs}</PaperText>
              }
              renderItem={({ item }) => (
                <Pressable onPress={() => setSelectedItem(item)}>
                  <View style={styles.logCard}>
                    <View style={styles.logHeaderRow}>
                      <PaperText style={styles.logSymptom}>
                        {item.symptomName || t.symptom_default}
                      </PaperText>
                      <PaperText style={styles.logPain}>
                        {t.pain_label} {item.painScore}/10
                      </PaperText>
                    </View>
                    <PaperText style={styles.logMeta}>
                      {item.date} • {t.hours_label}: {item.hours}
                    </PaperText>
                  </View>
                </Pressable>
              )}
              initialNumToRender={12}
              removeClippedSubviews
            />
          </>
        )}
      </View>

      {/* Detail popup */}
      <Portal>
        <Dialog
          visible={!!selectedItem}
          onDismiss={() => setSelectedItem(null)}
        >
          {selectedItem && (
            <>
              <Dialog.Title>{selectedItem.symptomName}</Dialog.Title>
              <Dialog.Content>
                <PaperText>{t.date_label}: {selectedItem.date}</PaperText>
                <PaperText>{t.hours_label}: {selectedItem.hours}</PaperText>
                <PaperText style={{ marginTop: 8 }}>
                  {t.pain_score_label}: {selectedItem.painScore}/10
                </PaperText>
                <View style={styles.painBarWrapper}>
                  <View
                    style={[
                      styles.painBarFill,
                      {
                        width: `${
                          Math.max(0, Math.min(10, selectedItem.painScore)) * 10
                        }%`,
                      },
                    ]}
                  />
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setSelectedItem(null)}>{t.close_dialog}</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  title: {
    marginBottom: 8,
    fontWeight: "700",
    color: "#2A2A2A",
  },

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

  // List item styling
  logCard: {
    backgroundColor: "#FFFFFFE6",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  logHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  logSymptom: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A2A2A",
  },
  logPain: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b3261e",
  },
  logMeta: {
    marginTop: 2,
    fontSize: 12,
    color: "#555",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },

  // Shared CTA button (Retry)
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

  // Pain bar in dialog
  painBarWrapper: {
    marginTop: 6,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  painBarFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: "#b3261e",
  },
});
