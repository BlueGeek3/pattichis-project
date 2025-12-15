import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  Text,
  Button,
  Menu,
  Provider as PaperProvider,
  Modal,
  Portal,
  List,
  Switch,
  Divider,
} from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { listHistory } from "../lib/api";
import { useNavigation, StackActions, useFocusEffect } from "@react-navigation/native";
import { getUsername, removeUsername } from "../utils/authStorage";
import { useSettings } from "../utils/SettingsContext";
import { getHomeTranslations, getMonthNames } from "../utils/translations";

let USER = "demo";
const AVAILABLE_LANGUAGES = ["English", "Greek"];
const bg = require("../assets/bg-screens.png");

// ------------------ Settings Modal ------------------
const SettingsModal = ({ isVisible, onClose }) => {
  const { isDarkMode, language, toggleDarkMode, setLanguage } = useSettings();
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const t = getHomeTranslations(language);

  const modalBackground = isDarkMode ? "#1e1e1e" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#000000";
  const dividerColor = isDarkMode ? "#333" : "#ccc";
  const currentLanguageColor = isDarkMode ? "#aaa" : "#666";

  const SWITCH_COLORS = {
    SWITCH_ON_COLOR: "#8F8F8F",
    SWITCH_ON_THUMB: "#A9A9A9",
    SWITCH_OFF_TRACK: "#FFC7C7",
    SWITCH_OFF_THUMB: "#FFFAFA",
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: modalBackground,
          padding: 20,
          margin: 20,
          borderRadius: 12,
        }}
      >
        <Text variant="titleLarge" style={{ color: textColor, marginBottom: 20 }}>
          {t.settings_title}
        </Text>

        {/* Dark Mode */}
        <List.Item
          title={t.dark_mode_title}
          titleStyle={{ color: textColor }}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{
                false: SWITCH_COLORS.SWITCH_OFF_TRACK,
                true: SWITCH_COLORS.SWITCH_ON_COLOR,
              }}
              thumbColor={isDarkMode ? SWITCH_COLORS.SWITCH_ON_THUMB : SWITCH_COLORS.SWITCH_OFF_THUMB}
            />
          )}
        />
        <Divider style={{ backgroundColor: dividerColor }} />

        {/* Language Selector */}
        <List.Item
          title={t.language_title}
          titleStyle={{ color: textColor }}
          description={language}
          descriptionStyle={{ color: currentLanguageColor }}
          right={() => (
            <Menu
              visible={languageMenuVisible}
              onDismiss={() => setLanguageMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  textColor="#000"
                  style={{
                    marginTop: 8,
                    borderColor: "#2A2A2A",
                    borderWidth: 1,
                    backgroundColor: "#FFFFFFE6",
                  }}
                  onPress={() => setLanguageMenuVisible(true)}
                >
                  {t.change_btn}
                </Button>
              }
            >
              {AVAILABLE_LANGUAGES.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    setLanguage(item);
                    setLanguageMenuVisible(false);
                  }}
                  title={item}
                  style={{ backgroundColor: language === item ? "#e0f7fa" : "white" }}
                />
              ))}
            </Menu>
          )}
        />

        <Button
          mode="contained"
          onPress={onClose}
          style={{ marginTop: 30, backgroundColor: "#4A4A4A", borderRadius: 24 }}
          textColor="#ffffff"
        >
          {t.close_btn}
        </Button>
      </Modal>
    </Portal>
  );
};

// ------------------ Home Component ------------------
export default function Home() {
  const navigation = useNavigation();
  const { isDarkMode, language } = useSettings();

  const [history, setHistory] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("Demo");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [monthMenuVisible, setMonthMenuVisible] = useState(false);
  const [yearMenuVisible, setYearMenuVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const t = getHomeTranslations(language);
  const monthNames = getMonthNames(language);

  const { height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  // Reset menu visibility when screen is focused
  useFocusEffect(
    useCallback(() => {
      setMonthMenuVisible(false);
      setYearMenuVisible(false);
      setMenuVisible(false);
    }, [])
  );

  useEffect(() => {
    const loadCredentials = async () => {
      const fetchedUsername = await getUsername();
      if (!fetchedUsername) {
        Alert.alert(t.session_expired_title, t.session_expired_msg);
        navigation.dispatch(StackActions.replace("Login"));
        return;
      }
      USER = fetchedUsername;
      setUserName(fetchedUsername!);
      listHistory(USER).then(setHistory).catch(console.error);
    };
    loadCredentials();
  }, []);

  const handleLogout = useCallback(async () => {
    setMenuVisible(false);
    try {
      await removeUsername();
      Alert.alert(t.logged_out_title, t.logged_out_msg);
      navigation.dispatch(StackActions.replace("Login"));
    } catch (e) {
      Alert.alert(t.logout_error_title, t.logout_error_msg);
    }
  }, [navigation]);

  const monthlyEntries = history.filter((h) => {
    const d = new Date(h.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const symptomMap: Record<string, number[]> = {};
  monthlyEntries.forEach((h) => {
    if (!symptomMap[h.symptomName]) symptomMap[h.symptomName] = [];
    symptomMap[h.symptomName].push(h.painScore);
  });

  const symptomNames = Object.keys(symptomMap);
  const avgPainPerSymptom = symptomNames.map((name) => {
    const scores = symptomMap[name];
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  });

  const barChartData = {
    labels: symptomNames.length ? symptomNames : [""],
    datasets: [{ data: avgPainPerSymptom.length ? avgPainPerSymptom : [0] }],
  };

  const themeBackgroundOverlay = isDarkMode ? "rgba(0, 0, 0, 0.35)" : "transparent";
  const cardBackground = isDarkMode ? "#1e1e1e" : "#FFFFFFE6";
  const textColorHeader = isDarkMode ? "#ffffff" : "#2A2A2A";
  const headerBorder = isDarkMode ? "#333" : "#eee";

  // ----------------- PDF Report -----------------
  const groupedByMonth: Record<string, any[]> = {};
  history.forEach((h) => {
    const d = new Date(h.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(h);
  });

  const generateFullReport = async () => {
    if (!history.length) {
      alert(t.no_report_data);
      return;
    }

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; }
            h2 { margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #444; padding: 8px; text-align: center; }
            th { background-color: #f0f0f0; }
            .summary { margin-top: 10px; }
            .chart { margin-top: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${t.header_title}</h1>
          <p><strong>${t.report_user_label}</strong> ${USER}</p>
          <p><strong>${t.report_generated_label}</strong> ${new Date().toLocaleString()}</p>

          ${Object.keys(groupedByMonth)
            .sort((a, b) => b.localeCompare(a))
            .map((monthKey) => {
              const entries = groupedByMonth[monthKey];
              const [year, monthNum] = monthKey.split("-");
              const monthIndex = Number(monthNum) - 1;
              const monthName = monthNames[monthIndex];

              const avgPain = (
                entries.reduce((s, x) => s + x.painScore, 0) / entries.length
              ).toFixed(1);
              const avgHours = (
                entries.reduce((s, x) => s + x.hours, 0) / entries.length
              ).toFixed(1);

              const symptomMapMonth: Record<string, number[]> = {};
              entries.forEach((h) => {
                if (!symptomMapMonth[h.symptomName])
                  symptomMapMonth[h.symptomName] = [];
                symptomMapMonth[h.symptomName].push(h.painScore);
              });
              const symptomNamesMonth = Object.keys(symptomMapMonth);
              const avgPainPerSymptomMonth = symptomNamesMonth.map((name) => {
                const scores = symptomMapMonth[name];
                return scores.reduce((sum, s) => sum + s, 0) / scores.length;
              });

              return `
                <h2>${monthName} ${year}</h2>
                <div class="summary">
                  <p><strong>${t.report_entries_label}</strong> ${entries.length}</p>
                  <p><strong>${t.report_avg_pain_label}</strong> ${avgPain}</p>
                  <p><strong>${t.report_avg_hours_label}</strong> ${avgHours}</p>
                </div>
                <div class="chart">
                  <img src="https://quickchart.io/chart?c={
                    type:'bar',
                    data:{
                      labels:[${symptomNamesMonth.map((s) => `'${s}'`).join(",")}],
                      datasets:[{label:'Avg Pain',data:[${avgPainPerSymptomMonth.join(",")}]}]
                    },
                    options:{plugins:{legend:{display:false}}}
                  }" />
                </div>
                <table>
                  <tr><th>Date</th><th>Symptom</th><th>Pain</th><th>Hours</th></tr>
                  ${entries.map(
                    (h) =>
                      `<tr><td>${h.date}</td><td>${h.symptomName}</td><td>${h.painScore}</td><td>${h.hours}</td></tr>`
                  ).join("")}
                </table>
              `;
            })
            .join("")}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };
  // -------------------------------------------

  return (
    <PaperProvider>
      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
      />

      <ImageBackground
        source={bg}
        resizeMode="cover"
        style={[styles.bg, isWeb && { height, width: "100%" }]}
      >
        <View style={{ flex: 1, backgroundColor: themeBackgroundOverlay }}>
          {/* Header */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 50,
            paddingBottom: 10,
            backgroundColor: cardBackground,
            borderBottomWidth: 1,
            borderBottomColor: headerBorder
          }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold", color: textColorHeader }}>
              {t.header_title2} ({language})
            </Text>

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#4A4A4A",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setMenuVisible((prev) => !prev)}
                >
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              }
            >
              <Menu.Item title={USER} titleStyle={{ color: "#000000ff" }} />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  setIsSettingsModalVisible(true);
                }}
                title={t.settings_menu}
              />
              <Menu.Item
                onPress={handleLogout}
                title={t.logout_menu}
                titleStyle={{ color: "#b3261e" }}
              />
            </Menu>
          </View>

          <ScrollView style={{ padding: 16 }}>
            {/* Month/Year selectors */}
            <View style={{ marginVertical: 8, flexDirection: "row", justifyContent: "space-between" }}>
              <Menu
                visible={monthMenuVisible}
                onDismiss={() => setMonthMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => { setMonthMenuVisible(true); setYearMenuVisible(false); }}
                  >
                    {t.month_prefix} {monthNames[selectedMonth]}
                  </Button>
                }
              >
                {monthNames.map((name, i) => (
                  <Menu.Item key={i} title={name} onPress={() => { setSelectedMonth(i); setMonthMenuVisible(false); }} />
                ))}
              </Menu>

              <Menu
                visible={yearMenuVisible}
                onDismiss={() => setYearMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => { setYearMenuVisible(true); setMonthMenuVisible(false); }}
                  >
                    {t.year_prefix} {selectedYear}
                  </Button>
                }
              >
                {[2025, 2024, 2023, 2022].map((y) => (
                  <Menu.Item key={y} title={String(y)} onPress={() => { setSelectedYear(y); setYearMenuVisible(false); }} />
                ))}
              </Menu>
            </View>

            {/* Bar Chart */}
            {monthlyEntries.length > 0 && (
              <ScrollView horizontal style={{ marginTop: 24 }}>
                <View style={{
                  width: Math.max(symptomNames.length * 120, Dimensions.get("window").width - 32),
                  backgroundColor: "#FFFFFFE6",
                  borderRadius: 16,
                  padding: 8
                }}>
                  <BarChart
                    data={barChartData}
                    width={Math.max(symptomNames.length * 120, Dimensions.get("window").width - 32)}
                    height={300}
                    fromZero
                    showValuesOnTopOfBars
                    chartConfig={{
                      backgroundColor: "#ffffff",
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 1,
                      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                    }}
                    barPercentage={0.6}
                  />
                </View>
              </ScrollView>
            )}

            {/* PDF Report Button */}
            <Button
              style={{ marginTop: 24, borderRadius: 24, backgroundColor: "#4A4A4A" }}
              mode="contained"
              onPress={generateFullReport}
              textColor="#ffffff"
            >
              {t.download_report_btn}
            </Button>
          </ScrollView>
        </View>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
});
