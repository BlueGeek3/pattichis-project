import React, { useEffect, useState } from "react";
import { ScrollView, Dimensions, View } from "react-native";
import { Text, Button, Menu, Provider as PaperProvider } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { listHistory } from "../lib/api";

const USER = "demo";

export default function Home() {
  const [history, setHistory] = useState<any[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  // Month selection
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [monthMenuVisible, setMonthMenuVisible] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    listHistory(USER).then(setHistory).catch(console.error);
  }, []);

  // Filter history for selected month
  const monthlyEntries = history.filter((h) => {
    const d = new Date(h.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  // Compute average pain per symptom
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
    labels: symptomNames.length > 0 ? symptomNames : [""],
    datasets: [
      { data: avgPainPerSymptom.length > 0 ? avgPainPerSymptom : [0] }
    ],
  };

  // Group history by month for PDF
  const groupedByMonth: Record<string, any[]> = {};
  history.forEach((h) => {
    const d = new Date(h.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(h);
  });

  // Generate multi-month PDF report
  async function generateFullReport() {
    if (!history.length) {
      alert("No history entries to report.");
      return;
    }

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
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
          <h1>MS Symptom Report</h1>
          <p><strong>User:</strong> ${USER}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

          ${Object.keys(groupedByMonth)
            .sort((a, b) => b.localeCompare(a))
            .map((monthKey) => {
              const entries = groupedByMonth[monthKey];
              const [year, monthNum] = monthKey.split("-");
              const monthIndex = Number(monthNum) - 1;
              const monthName = monthNames[monthIndex];

              const avgPain = (entries.reduce((sum, x) => sum + x.painScore, 0) / entries.length).toFixed(1);
              const avgHours = (entries.reduce((sum, x) => sum + x.hours, 0) / entries.length).toFixed(1);

              const symptomMapMonth: Record<string, number[]> = {};
              entries.forEach((h) => {
                if (!symptomMapMonth[h.symptomName]) symptomMapMonth[h.symptomName] = [];
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
                  <p><strong>Total entries:</strong> ${entries.length}</p>
                  <p><strong>Average pain score:</strong> ${avgPain}</p>
                  <p><strong>Average hours affected:</strong> ${avgHours}</p>
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
                  ${entries
                    .map((h) => `<tr><td>${h.date}</td><td>${h.symptomName}</td><td>${h.painScore}</td><td>${h.hours}</td></tr>`)
                    .join("")}
                </table>
              `;
            })
            .join("")}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  }

  return (
    <PaperProvider>
      <ScrollView style={{ padding: 16 }}>
        <Text variant="titleMedium" style={{ marginTop: 50 }}>
Syptom Diary
</Text>

        {/* Month picker */}
        <View style={{ marginTop: 16 }}>
          <Menu
            visible={monthMenuVisible}
            onDismiss={() => setMonthMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMonthMenuVisible(true)}>
                Selected Month: {monthNames[selectedMonth]} {selectedYear}
              </Button>
            }
          >
            {monthNames.map((name, i) => (
              <Menu.Item
                key={i}
                onPress={() => {
                  setSelectedMonth(i);
                  setMonthMenuVisible(false);
                }}
                title={name}
              />
            ))}
          </Menu>
        </View>

        {/* Bar chart wrapped in horizontal scroll */}
        {monthlyEntries.length > 0 && (
          <ScrollView horizontal style={{ marginTop: 24 }}>
            <View
              style={{
                width: Math.max(symptomNames.length * 120, Dimensions.get("window").width - 32),
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 8,
              }}
            >
              <BarChart
                data={barChartData}
                width={Math.max(symptomNames.length * 120, Dimensions.get("window").width - 32)}
                height={300}
                fromZero
                showValuesOnTopOfBars={true}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                style={{ borderRadius: 16 }}
                withHorizontalLabels={true}
                withInnerLines={true}
                barPercentage={0.6}
                formatXLabel={(label) => (label.length > 12 ? label.slice(0, 12) + "…" : label)}
              />
            </View>
          </ScrollView>
        )}

        {/* Full history PDF Report */}
        <Button style={{ marginTop: 29 }} mode="contained" onPress={generateFullReport}>
          Download Full History PDF Report
        </Button>

        <Button style={{ marginTop: 16 }} mode="outlined">
          Add Symptom Log (use Log tab)
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}
