import React from "react";
import { ImageBackground, SafeAreaView, View, Pressable, Text, StyleSheet } from "react-native";
const bg = require("../assets/bg-intro.png");

export default function Intro({ navigation }: any) {
  return (
    <ImageBackground
      source={bg}
      style={styles.bg}
      resizeMode="cover"           // fill the screen; may crop edges
    >
      {/* Optional soft tint over image */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>My MS Diary</Text>
          <Pressable
            onPress={() => navigation.replace("Tabs")}
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>Get Started</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 233, 209, 0.35)", // optional warm tint
  },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#2A2A2A", marginBottom: 24 },
  btn: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 24, backgroundColor: "#4A4A4A", elevation: 4 },
  btnPressed: { backgroundColor: "#5a5a5a" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
